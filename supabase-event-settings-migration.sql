-- ============================================================
-- Per-event RSVP settings
-- Run in: Supabase Dashboard → SQL Editor → New query
--
-- Every event used to assume the basketball run: spectators allowed,
-- 21+ required, and the basketball waiver. Each is now set per event
-- in the Table Editor.
-- ============================================================

-- Uncheck for participant-only events (no "come watch" option).
alter table events add column if not exists allow_spectators boolean not null default true;

-- Participants must confirm they are 21 or older.
alter table events add column if not exists requires_21_plus boolean not null default true;

-- The waiver participants sign for this event. Leave waiver_text empty for
-- events that need no waiver. Paragraphs are separated by a blank line.
-- The exact text is snapshotted with every signature, so editing it later
-- never changes what someone already agreed to.
alter table events add column if not exists waiver_title       text;
alter table events add column if not exists waiver_text        text;
alter table events add column if not exists waiver_agree_label text;
