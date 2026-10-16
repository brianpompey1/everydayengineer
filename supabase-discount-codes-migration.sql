-- ============================================================
-- Discount codes on paid events
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- The promotion code used at checkout (e.g. EECSTUDENT), if any.
alter table rsvps add column if not exists discount_code text;
