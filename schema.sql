-- Enable UUID extension
-- create extension if not exists "uuid-ossp"; -- Not needed if using gen_random_uuid()

-- 1. Tenants Table
create table tenants (
  id text primary key, -- using text id as requested (e.g. 'walmart', '3c-consulting')
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed tenants
insert into tenants (id, name) values 
  ('walmart', 'Walmart'),
  ('3c-consulting', '3C Consulting'),
  ('primary-battery-tech', 'Primary Battery Technology'),
  ('wac-amp', 'WAC AMP'),
  ('cob', 'COB'),
  ('echelon', 'Echelon'),
  ('arvest', 'Arvest'),
  ('startup-lab', 'Startup Lab'),
  ('admin', 'Admin');

-- 2. Tenant Members Table
create table tenant_members (
  id uuid default gen_random_uuid() primary key,
  tenant_id text references tenants(id) not null,
  user_id uuid references auth.users(id) not null,
  role text check (role in ('student', 'admin')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id) -- User belongs to exactly one tenant
);

-- 3. Tasks Table
create table tasks (
  id uuid default gen_random_uuid() primary key,
  tenant_id text references tenants(id) not null,
  title text not null,
  description text not null,
  priority text check (priority in ('low', 'medium', 'high', 'critical')) not null,
  status text check (status in ('backlog', 'todo', 'in-progress', 'blocked', 'done')) not null,
  story_points integer not null,
  assignee_id uuid references auth.users(id), -- Nullable if unassigned
  assignee_name text, -- Storing display name for easier frontend display, or could join profiles
  blocker_details text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Daily Check-ins Table
create table daily_checkins (
  id uuid default gen_random_uuid() primary key,
  tenant_id text references tenants(id) not null,
  user_id uuid references auth.users(id) not null,
  date date not null,
  sprint_week text not null,
  yesterday text not null,
  today text not null,
  impediments text not null,
  help_needed text not null,
  display_name text, -- Added to cache the user's display name at time of specific checkin
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ================= Row Level Security (RLS) =================

alter table tenants enable row level security;
alter table tenant_members enable row level security;
alter table tasks enable row level security;
alter table daily_checkins enable row level security;

-- Helper function to get current user's tenant_id
create or replace function get_my_tenant_id()
returns text
language sql
security definer
as $$
  select tenant_id from tenant_members where user_id = auth.uid() limit 1;
$$;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM tenant_members
    WHERE user_id = (SELECT auth.uid())
      AND role = 'admin'
  );
$$;

-- Policies for Tenants
-- Everyone can read tenants (needed for login selection if dynamic, but mostly static)
create policy "Visible to authenticated users" on tenants
  for select using (auth.role() = 'authenticated');

-- Policies for Tenant Members
-- Users can see their own membership
create policy "Users can see own membership" on tenant_members
  for select using (auth.uid() = user_id);
  
-- Admins can see all memberships
create policy "Admins can see all memberships" on tenant_members
  for select using (is_admin());

-- Insert policy: strictly speaking, registration logic should handle this via trigger or edge function
-- But for this migration, we'll allow authenticated users to insert their *own* membership if they don't have one
create policy "Users can self-register" on tenant_members
  for insert with check (auth.uid() = user_id);

-- Policies for Tasks
-- Users can see tasks in their tenant
create policy "View tasks in own tenant" on tasks
  for select using (
    tenant_id = get_my_tenant_id() 
    or is_admin()
  );

-- Users can insert tasks in their tenant
create policy "Create tasks in own tenant" on tasks
  for insert with check (
    tenant_id = get_my_tenant_id()
  );

-- Users can update tasks in their tenant
create policy "Update tasks in own tenant" on tasks
  for update using (
    tenant_id = get_my_tenant_id()
  );

-- Users can delete tasks in their tenant
create policy "Delete tasks in own tenant" on tasks
  for delete using (
    tenant_id = get_my_tenant_id()
  );

-- Policies for Daily Check-ins
-- Users can see check-ins in their tenant
create policy "View check-ins in own tenant" on daily_checkins
  for select using (
    tenant_id = get_my_tenant_id() 
    or is_admin()
  );

-- Users can create check-ins in their tenant
create policy "Create check-ins in own tenant" on daily_checkins
  for insert with check (
    tenant_id = get_my_tenant_id() 
    and auth.uid() = user_id
  );

-- Users can update their own check-ins
create policy "Update own check-ins" on daily_checkins
  for update using (
    tenant_id = get_my_tenant_id() 
    and auth.uid() = user_id
  );

-- Users can delete their own check-ins
create policy "Delete own check-ins" on daily_checkins
  for delete using (
    tenant_id = get_my_tenant_id() 
    and auth.uid() = user_id
  );
