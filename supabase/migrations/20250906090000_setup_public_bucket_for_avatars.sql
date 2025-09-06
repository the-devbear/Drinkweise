-- Ensure a public storage bucket exists for hosting public assets like avatars
-- Idempotent creation: do nothing if the bucket already exists
insert into storage.buckets (id, name, public)
values ('public', 'public', true)
on conflict (id) do nothing;

-- Public read access to files in the public bucket
drop policy if exists "Public read access to public bucket" on storage.objects;
create policy "Public read access to public bucket"
on storage.objects
for select
to public
using (bucket_id = 'public');

-- Allow authenticated users to upload their own avatar under avatars/<userId>.*
drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'public'
  and split_part(name, '/', 1) = 'avatars'
  and split_part(split_part(name, '/', 2), '.', 1) = auth.uid()::text
);

-- Allow authenticated users to update their own avatar object
drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'public'
  and split_part(name, '/', 1) = 'avatars'
  and split_part(split_part(name, '/', 2), '.', 1) = auth.uid()::text
)
with check (
  bucket_id = 'public'
  and split_part(name, '/', 1) = 'avatars'
  and split_part(split_part(name, '/', 2), '.', 1) = auth.uid()::text
);

-- Allow authenticated users to delete their own avatar object
drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'public'
  and split_part(name, '/', 1) = 'avatars'
  and split_part(split_part(name, '/', 2), '.', 1) = auth.uid()::text
);

