-- ============================================================
-- Emerging Estates · Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- MEMBERS
create table if not exists members (
  id            uuid primary key default gen_random_uuid(),
  clerk_id      text unique not null,
  email         text unique not null,
  full_name     text,
  username      text unique,
  avatar_url    text,
  location      text,
  bio           text,
  role          text default 'member',        -- 'member' | 'admin'
  discipline    text,                          -- e.g. 'Software Engineer'
  company       text,
  linkedin_url  text,
  instagram_url text,
  twitter_url   text,
  joined_at     timestamptz default now(),
  updated_at    timestamptz default now()
);

-- GOALS
create table if not exists goals (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid references members(id) on delete cascade,
  title       text not null,
  description text,
  target_date date,
  status      text default 'active',          -- 'active' | 'completed' | 'archived'
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- HABITS (nested under goals)
create table if not exists habits (
  id          uuid primary key default gen_random_uuid(),
  goal_id     uuid references goals(id) on delete cascade,
  member_id   uuid references members(id) on delete cascade,
  title       text not null,
  description text,
  frequency   text default 'daily',           -- 'daily' | 'weekly'
  target_days int default 7,                  -- days per week
  color       text default '#C9A84C',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- HABIT LOGS (daily check-ins)
create table if not exists habit_logs (
  id         uuid primary key default gen_random_uuid(),
  habit_id   uuid references habits(id) on delete cascade,
  member_id  uuid references members(id) on delete cascade,
  logged_date date not null default current_date,
  completed  boolean default true,
  note       text,
  created_at timestamptz default now(),
  unique(habit_id, logged_date)
);

-- EVENTS (admin-created)
create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  location     text,
  event_date   timestamptz not null,
  end_date     timestamptz,
  cover_image  text,
  category     text,                           -- 'hoops' | 'workshop' | 'social' | 'wellness' | 'retreat'
  capacity     int,
  is_published boolean default false,
  created_by   uuid references members(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- RSVPs
create table if not exists rsvps (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid references events(id) on delete cascade,
  member_id  uuid references members(id) on delete cascade,
  status     text default 'going',             -- 'going' | 'maybe' | 'not_going'
  created_at timestamptz default now(),
  unique(event_id, member_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table members   enable row level security;
alter table goals     enable row level security;
alter table habits    enable row level security;
alter table habit_logs enable row level security;
alter table events    enable row level security;
alter table rsvps     enable row level security;

-- Members: anyone can read profiles, only owner can update
create policy "Members are viewable by all members"
  on members for select using (true);

create policy "Members can update own profile"
  on members for update using (clerk_id = current_setting('app.clerk_id', true));

-- Goals: private to owner
create policy "Goals are private to owner"
  on goals for all using (
    member_id = (select id from members where clerk_id = current_setting('app.clerk_id', true))
  );

-- Habits: private to owner
create policy "Habits are private to owner"
  on habits for all using (
    member_id = (select id from members where clerk_id = current_setting('app.clerk_id', true))
  );

-- Habit logs: private to owner
create policy "Habit logs are private to owner"
  on habit_logs for all using (
    member_id = (select id from members where clerk_id = current_setting('app.clerk_id', true))
  );

-- Events: published events visible to all members
create policy "Published events are viewable by all"
  on events for select using (is_published = true);

create policy "Admins can manage events"
  on events for all using (
    exists (select 1 from members where clerk_id = current_setting('app.clerk_id', true) and role = 'admin')
  );

-- RSVPs: members can manage own RSVPs
create policy "Members can manage own RSVPs"
  on rsvps for all using (
    member_id = (select id from members where clerk_id = current_setting('app.clerk_id', true))
  );

create policy "RSVPs are visible to event owner and admin"
  on rsvps for select using (true);
