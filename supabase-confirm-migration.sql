-- ============================================================
-- Attendance confirmation + per-event notes
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Set when an approved player taps "Yes, I'll be there" in their email.
alter table rsvps  add column if not exists attendance_confirmed_at timestamptz;

-- Instructions for confirmed attendees, one per line, shown in the
-- approval email (e.g. arrive early, what to wear).
alter table events add column if not exists attendee_notes text;

-- Roster view gains the confirmation column (appended at the end, as
-- `create or replace view` requires).
create or replace view rsvp_admin as
select
  r.id as rsvp_id, e.title as event_title, e.event_date, e.capacity,
  m.full_name, m.email, m.phone, r.attendee_type, r.status,
  m.shirt_size, m.emergency_contact_name, m.emergency_contact_phone,
  (w.id is not null) as waiver_signed, r.created_at as requested_at,
  r.attendance_confirmed_at
from rsvps r
  join events  e on e.id = r.event_id
  join members m on m.id = r.member_id
  left join waivers w on w.member_id = r.member_id and w.event_id = r.event_id
order by e.event_date asc, r.created_at asc;
