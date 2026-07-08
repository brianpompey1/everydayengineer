-- Add State and University fields to events for location filtering.
-- Run in: Supabase Dashboard → SQL Editor → New query

alter table events add column if not exists state text;
alter table events add column if not exists university text;

alter table events
  add constraint events_university_check
  check (
    university is null or university in (
      'Morgan State University',
      'Auburn University',
      'Canisius University',
      'University at Buffalo'
    )
  );

-- Backfill existing seeded events as New York (community, off-campus events)
update events set state = 'New York' where state is null;

-- Seed one event per university so the University filter has real data
insert into events (title, description, location, event_date, category, capacity, is_published, state, university)
values
  (
    'Society Hoops · Morgan State',
    'Weekly pickup run hosted on campus. All levels welcome.',
    'Hill Field House · Baltimore, MD',
    (now() + interval '9 days')::timestamptz,
    'Society Hoops',
    30,
    true,
    'Maryland',
    'Morgan State University'
  ),
  (
    'Deep-Tech Lab · Auburn',
    'A hands-on session on systems design, hosted with the Auburn engineering community.',
    'Shelby Center · Auburn, AL',
    (now() + interval '14 days')::timestamptz,
    'Deep-Tech Lab',
    24,
    true,
    'Alabama',
    'Auburn University'
  ),
  (
    'Community Brunch · Canisius',
    'The original ritual, on the road. Eggs, dialogue, no slides.',
    'Canisius University · Buffalo, NY',
    (now() + interval '18 days')::timestamptz,
    'Brunch',
    40,
    true,
    'New York',
    'Canisius University'
  ),
  (
    'Founders Office Hours · UB',
    'Open office hours with the founder, hosted at University at Buffalo.',
    'University at Buffalo · Buffalo, NY',
    (now() + interval '21 days')::timestamptz,
    'Workshop',
    20,
    true,
    'New York',
    'University at Buffalo'
  );
