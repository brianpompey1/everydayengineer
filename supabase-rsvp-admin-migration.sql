-- ============================================================
-- Approve RSVPs from the Table Editor
--   · status becomes a dropdown (Postgres enum)
--   · each rsvps row shows who it is and which event
-- Run in: Supabase Dashboard → SQL Editor → New query
-- Run AFTER supabase-rsvp-migration.sql and supabase-email-migration.sql
-- ============================================================

-- ── 1. Status dropdown ──
do $$ begin
  create type rsvp_status as enum ('pending', 'approved', 'waitlisted', 'declined');
exception when duplicate_object then null; end $$;

-- The roster view reads rsvps.status, so it must be dropped before the
-- column type can change. It is recreated at the bottom.
drop view if exists rsvp_admin;

-- The enum replaces the old text check constraint.
alter table rsvps drop constraint if exists rsvps_status_check;

alter table rsvps alter column status drop default;
alter table rsvps alter column status type rsvp_status using status::rsvp_status;
alter table rsvps alter column status set default 'pending';
alter table rsvps alter column status set not null;

-- ── 2. Who and what, on the row itself ──
-- Snapshot copies for the admin roster, filled in when the RSVP is created.
alter table rsvps add column if not exists member_name  text;
alter table rsvps add column if not exists member_email text;
alter table rsvps add column if not exists event_title  text;

create or replace function rsvps_fill_display()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  select m.full_name, m.email
    into new.member_name, new.member_email
    from members m
   where m.id = new.member_id;

  select e.title
    into new.event_title
    from events e
   where e.id = new.event_id;

  return new;
end;
$$;

drop trigger if exists rsvps_fill_display on rsvps;
create trigger rsvps_fill_display
  before insert on rsvps
  for each row execute function rsvps_fill_display();

-- Backfill existing rows. These updates leave status untouched, so the
-- email webhook sees no status change and sends nothing.
update rsvps r
   set member_name = m.full_name,
       member_email = m.email
  from members m
 where m.id = r.member_id
   and r.member_email is null;

update rsvps r
   set event_title = e.title
  from events e
 where e.id = r.event_id
   and r.event_title is null;

-- ── 3. Recreate the read-only roster view ──
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
