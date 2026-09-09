-- ============================================================
-- RSVP + Waiver migration
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── 1. Member profile fields (collected once, on first RSVP) ──
alter table members add column if not exists phone                   text;
alter table members add column if not exists company_or_school       text;
alter table members add column if not exists professional_status     text;  -- student | graduate | professional
alter table members add column if not exists shirt_size              text;  -- S | M | L | XL | XXL
alter table members add column if not exists is_21_plus              boolean;
alter table members add column if not exists emergency_contact_name  text;
alter table members add column if not exists emergency_contact_phone text;
alter table members add column if not exists heard_about_us          text;

-- ── 2. RSVPs: attendee type + approval status ──
alter table rsvps add column if not exists attendee_type text;
alter table rsvps add column if not exists updated_at    timestamptz default now();

-- Migrate any legacy rows from the old going/maybe/not_going model
update rsvps set attendee_type = 'player' where attendee_type is null;
update rsvps set status = 'approved' where status = 'going';
update rsvps set status = 'pending'  where status = 'maybe';
update rsvps set status = 'declined' where status = 'not_going';

alter table rsvps alter column status set default 'pending';
alter table rsvps alter column attendee_type set not null;

do $$ begin
  alter table rsvps add constraint rsvps_status_check
    check (status in ('pending', 'approved', 'waitlisted', 'declined'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table rsvps add constraint rsvps_attendee_type_check
    check (attendee_type in ('player', 'spectator'));
exception when duplicate_object then null; end $$;

-- ── 3. Waivers — one signature per member per event ──
-- waiver_text is an immutable snapshot of exactly what was agreed to,
-- so a signature can always be tied back to the wording in force that day.
create table if not exists waivers (
  id                      uuid primary key default gen_random_uuid(),
  member_id               uuid not null references members(id) on delete cascade,
  event_id                uuid not null references events(id) on delete cascade,
  waiver_version          text not null,
  waiver_text             text not null,
  signature_name          text not null,
  signed_at               timestamptz not null default now(),
  signature_date          date not null,
  emergency_contact_name  text not null,
  emergency_contact_phone text not null,
  is_21_plus              boolean not null,
  agreed                  boolean not null,
  unique (member_id, event_id)
);

alter table waivers enable row level security;

-- ── 4. Admin roster view ──
-- The raw rsvps table is all UUIDs. This joins it into something readable
-- for approving people from the Supabase dashboard.
create or replace view rsvp_admin as
select
  r.id                      as rsvp_id,
  e.title                   as event_title,
  e.event_date,
  e.capacity,
  m.full_name,
  m.email,
  m.phone,
  r.attendee_type,
  r.status,
  m.shirt_size,
  m.emergency_contact_name,
  m.emergency_contact_phone,
  (w.id is not null)        as waiver_signed,
  r.created_at              as requested_at
from rsvps r
  join events  e on e.id = r.event_id
  join members m on m.id = r.member_id
  left join waivers w on w.member_id = r.member_id and w.event_id = r.event_id
order by e.event_date asc, r.created_at asc;
