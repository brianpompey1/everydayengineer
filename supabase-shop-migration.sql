-- ============================================================
-- Shop
-- Run in: Supabase Dashboard → SQL Editor → New query
--
-- Products and stock are managed in the Table Editor:
--   · products          — name, price, description, photos, published
--   · product_variants  — one row per size, with its stock count
--   · orders            — every order; change status to shipped / picked_up
--   · restock_requests  — who's waiting for a sold-out size
--
-- RLS is on with no policies: the site reads these with the server key
-- only, so nothing here is readable with the public key.
-- ============================================================

create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text,
  price_cents   integer not null check (price_cents > 0),
  category      text not null default 'Apparel',
  -- Stripe Tax category: clothing, or general goods (e.g. the water bottle).
  tax_code      text not null default 'txcd_30011000',
  -- Photo URLs, first one is the main photo. Empty shows a placeholder.
  images        text[] not null default '{}',
  -- Sets only: which products make up each part, e.g.
  -- [{"label":"Hoodie","products":["hoodie","zip-hoodie"]},{"label":"Pants","products":["pants"]}]
  set_parts     jsonb,
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  size        text not null,           -- 'M', 'L', 'XL', or 'One size'
  stock       integer not null default 0 check (stock >= 0),
  sort_order  integer not null default 0,
  unique (product_id, size)
);

do $$ begin
  create type order_status as enum ('pending', 'paid', 'shipped', 'picked_up', 'cancelled', 'expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type fulfillment_method as enum ('ship', 'pickup');
exception when duplicate_object then null; end $$;

create table if not exists orders (
  id                 uuid primary key default gen_random_uuid(),
  status             order_status not null default 'pending',
  fulfillment        fulfillment_method not null,
  email              text,
  customer_name      text,
  phone              text,
  shipping_address   jsonb,
  -- What was ordered, e.g. "Zip Hoodie (L) ×1, Pants (M) ×1" — easy to read when packing.
  summary            text,
  subtotal_cents     integer not null,
  shipping_cents     integer not null default 0,
  tax_cents          integer,
  total_cents        integer,
  member_id          uuid references members(id) on delete set null,
  stripe_session_id  text unique,
  expires_at         timestamptz,
  created_at         timestamptz not null default now(),
  paid_at            timestamptz,
  fulfilled_at       timestamptz,
  notes              text
);

create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    uuid references products(id) on delete set null,
  name          text not null,
  detail        text,                 -- e.g. "L" or "Zip Hoodie L · Pants M"
  unit_cents    integer not null,
  quantity      integer not null check (quantity > 0),
  -- Every stock unit this line used: [{"variant_id":"…","quantity":1}, …]
  stock         jsonb not null
);

create table if not exists restock_requests (
  id           uuid primary key default gen_random_uuid(),
  variant_id   uuid not null references product_variants(id) on delete cascade,
  email        text not null,
  created_at   timestamptz not null default now(),
  notified_at  timestamptz
);
create unique index if not exists restock_requests_waiting
  on restock_requests (variant_id, lower(email)) where notified_at is null;

alter table products         enable row level security;
alter table product_variants enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;
alter table restock_requests enable row level security;

-- ── Stock holds ──
-- Takes stock for an order all at once, or not at all. Two people buying the
-- last hoodie at the same moment can't both get it.
create or replace function reserve_stock(lines jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  line jsonb;
  updated int;
begin
  for line in select * from jsonb_array_elements(lines) loop
    update product_variants
       set stock = stock - (line->>'quantity')::int
     where id = (line->>'variant_id')::uuid
       and stock >= (line->>'quantity')::int;
    get diagnostics updated = row_count;
    if updated = 0 then
      raise exception 'OUT_OF_STOCK:%', line->>'variant_id';
    end if;
  end loop;
end;
$$;

-- Puts an unpaid order's stock back. Only acts on a pending order, once.
create or replace function release_order_stock(p_order_id uuid, p_status order_status)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  item record;
  part jsonb;
begin
  update orders set status = p_status
   where id = p_order_id and status = 'pending';
  if not found then
    return false;
  end if;

  for item in select stock from order_items where order_id = p_order_id loop
    for part in select * from jsonb_array_elements(item.stock) loop
      update product_variants
         set stock = stock + (part->>'quantity')::int
       where id = (part->>'variant_id')::uuid;
    end loop;
  end loop;
  return true;
end;
$$;

revoke all on function reserve_stock(jsonb) from public, anon, authenticated;
revoke all on function release_order_stock(uuid, order_status) from public, anon, authenticated;

-- ── Catalog ──
insert into products (slug, name, price_cents, category, tax_code, sort_order) values
  ('tee',          'Tee',             3200, 'Apparel',     'txcd_30011000', 10),
  ('zip-hoodie',   'Zip Hoodie',      6500, 'Apparel',     'txcd_30011000', 20),
  ('hoodie',       'Pullover Hoodie', 6500, 'Apparel',     'txcd_30011000', 30),
  ('pants',        'Pants',           5000, 'Apparel',     'txcd_30011000', 40),
  ('set',          'Hoodie + Pants Set', 10000, 'Sets',    'txcd_30011000', 5),
  ('water-bottle', 'Water Bottle',    4000, 'Accessories', 'txcd_99999999', 50),
  ('long-sleeve',  'Long Sleeve',     3600, 'Apparel',     'txcd_30011000', 60),
  ('camo-hoodie',  'Box Camo Hoodie', 7000, 'Apparel',     'txcd_30011000', 70),
  ('canvas-vest',  'Canvas Vest',     8600, 'Apparel',     'txcd_30011000', 80)
on conflict (slug) do nothing;

update products
   set set_parts = '[{"label":"Hoodie","products":["hoodie","zip-hoodie"]},{"label":"Pants","products":["pants"]}]'::jsonb,
       description = 'A hoodie and pants together — save $15. Choose either hoodie and your sizes.'
 where slug = 'set' and set_parts is null;

-- Sizes and stock.
insert into product_variants (product_id, size, stock, sort_order)
select p.id, v.size, v.stock, v.sort_order
  from (values
    ('tee',          'M', 10, 1), ('tee',          'L', 15, 2), ('tee',          'XL', 10, 3),
    ('hoodie',       'M',  4, 1), ('hoodie',       'L',  0, 2), ('hoodie',       'XL',  0, 3),
    ('zip-hoodie',   'M',  0, 1), ('zip-hoodie',   'L', 11, 2), ('zip-hoodie',   'XL', 10, 3),
    ('pants',        'M',  3, 1), ('pants',        'L', 13, 2), ('pants',        'XL',  9, 3),
    ('long-sleeve',  'M',  0, 1), ('long-sleeve',  'L',  0, 2), ('long-sleeve',  'XL',  0, 3),
    ('camo-hoodie',  'M',  0, 1), ('camo-hoodie',  'L',  0, 2), ('camo-hoodie',  'XL',  0, 3),
    ('canvas-vest',  'M',  0, 1), ('canvas-vest',  'L',  0, 2), ('canvas-vest',  'XL',  0, 3),
    ('water-bottle', 'One size', 3, 1)
  ) as v(slug, size, stock, sort_order)
  join products p on p.slug = v.slug
on conflict (product_id, size) do nothing;
