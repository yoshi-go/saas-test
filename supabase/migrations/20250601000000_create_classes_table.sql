-- Create a table for classes
create table classes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  instructor text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  capacity integer default 20,
  price decimal(10,2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table classes enable row level security;

-- Users can only see their own classes
create policy "Users can view own classes." on classes
  for select using (auth.uid() = user_id);

-- Users can insert their own classes
create policy "Users can insert own classes." on classes
  for insert with check (auth.uid() = user_id);

-- Users can update their own classes
create policy "Users can update own classes." on classes
  for update using (auth.uid() = user_id);

-- Users can delete their own classes
create policy "Users can delete own classes." on classes
  for delete using (auth.uid() = user_id);

-- Create an index on user_id for better query performance
create index classes_user_id_idx on classes(user_id);

-- Create an index on created_at for ordering
create index classes_created_at_idx on classes(created_at);

-- Function to automatically update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at when a class is modified
create trigger update_classes_updated_at
  before update on classes
  for each row
  execute function update_updated_at_column();