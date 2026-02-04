-- notece.me schema
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

create table if not exists boards (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
  title text not null,
  hero_image_url text,
  theme jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists widgets (
  id text primary key,
  board_id text references boards(id) on delete cascade,
  type text not null,
  title text not null,
  layout jsonb not null,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
alter table boards enable row level security;
alter table widgets enable row level security;

create policy "Profiles are viewable by owner"
  on profiles for select
  using (auth.uid() = id);

create policy "Profiles can be inserted by owner"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Boards are viewable by owner"
  on boards for select
  using (auth.uid() = user_id);

create policy "Boards are insertable by owner"
  on boards for insert
  with check (auth.uid() = user_id);

create policy "Boards are updateable by owner"
  on boards for update
  using (auth.uid() = user_id);

create policy "Boards are deletable by owner"
  on boards for delete
  using (auth.uid() = user_id);

create policy "Widgets are viewable by board owner"
  on widgets for select
  using (auth.uid() = (select user_id from boards where id = widgets.board_id));

create policy "Widgets are insertable by board owner"
  on widgets for insert
  with check (auth.uid() = (select user_id from boards where id = widgets.board_id));

create policy "Widgets are updateable by board owner"
  on widgets for update
  using (auth.uid() = (select user_id from boards where id = widgets.board_id));

create policy "Widgets are deletable by board owner"
  on widgets for delete
  using (auth.uid() = (select user_id from boards where id = widgets.board_id));

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
