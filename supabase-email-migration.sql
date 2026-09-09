-- ============================================================
-- Email notifications migration
-- Run in: Supabase Dashboard → SQL Editor → New query
-- Run this AFTER supabase-rsvp-migration.sql
-- ============================================================

-- Private street address. Only ever included in emails to approved
-- players — never rendered on the public event page.
alter table events add column if not exists venue_address text;

-- Guards against sending the same notification twice if a status is
-- toggled back and forth, or if the webhook retries.
alter table rsvps add column if not exists last_notified_status text;

-- Backfill so existing rows don't fire notifications retroactively.
update rsvps set last_notified_status = status where last_notified_status is null;

-- Example: set the address for the basketball run
-- update events
--   set venue_address = '696 Jamaica Ave, Brooklyn, NY 11208'
--   where title ilike '%Basketball Run%';
