-- ============================================================
-- Paid events
-- Run in: Supabase Dashboard → SQL Editor → New query
--
-- An event with a price is paid. Participants still request a spot and are
-- approved in the Table Editor as before; approval emails them a payment
-- link, and paying is what confirms the spot.
-- ============================================================

-- Price per participant, in cents (2500 = $25). Leave empty for free events.
alter table events add column if not exists price_cents integer
  check (price_cents is null or price_cents > 0);

-- Filled in when Stripe confirms the payment.
alter table rsvps add column if not exists paid_at           timestamptz;
alter table rsvps add column if not exists amount_paid_cents integer;
alter table rsvps add column if not exists stripe_session_id text;

create unique index if not exists rsvps_stripe_session_id_key
  on rsvps (stripe_session_id) where stripe_session_id is not null;

-- Pilates: $25.
update events set price_cents = 2500
where id = '0665ebae-c30d-4ae2-8564-66391d13bb81';
