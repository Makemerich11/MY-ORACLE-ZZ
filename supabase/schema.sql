-- Run this in your Supabase SQL editor

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  dob date,
  birth_time text,
  birth_city text,
  tier integer default 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'free',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can only read/write their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, dob)
  values (
    new.id,
    new.email,
    (new.raw_user_meta_data->>'dob')::date
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
