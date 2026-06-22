-- Seed a few real events so /events and /today have something to show.
-- Run in: Supabase Dashboard → SQL Editor → New query

insert into events (title, description, location, event_date, category, capacity, is_published)
values
  (
    'Society Hoops · Week 14',
    'Weekly pickup run. All levels welcome. Bring two pairs of socks.',
    'Brownsville Rec · Brooklyn',
    (now() + interval '3 days')::timestamptz,
    'Society Hoops',
    30,
    true
  ),
  (
    'Deep-Tech Lab · Distributed Systems',
    'A practical session on consensus, partition tolerance, and the systems we choose to live with.',
    'EE Loft · DUMBO',
    (now() + interval '5 days')::timestamptz,
    'Deep-Tech Lab',
    24,
    true
  ),
  (
    'Community Brunch',
    'The original ritual. Eggs, dialogue, no slides. Bring someone you''d want at the table.',
    'Bed-Stuy · TBA',
    (now() + interval '12 days')::timestamptz,
    'Brunch',
    60,
    true
  );
