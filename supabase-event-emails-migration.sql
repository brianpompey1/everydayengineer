-- ============================================================
-- Per-event email wording
-- Run in: Supabase Dashboard → SQL Editor → New query
--
-- Optional text that replaces the standard body of the confirmation
-- ("you're in") and waitlist emails for one event. Blank lines
-- separate paragraphs. Leave empty to use the standard wording.
-- ============================================================

alter table events add column if not exists confirmed_email_message text;
alter table events add column if not exists waitlist_email_message  text;
