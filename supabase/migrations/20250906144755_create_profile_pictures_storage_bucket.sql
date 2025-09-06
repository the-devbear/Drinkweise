-- Create storage bucket for profile pictures
insert into storage.buckets (id, name, public)
values ('profile-pictures', 'profile-pictures', true);

-- Create policy to allow authenticated users to upload their own profile pictures
create policy "Users can upload their own profile pictures"
on storage.objects for insert
to authenticated
with check (bucket_id = 'profile-pictures' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow authenticated users to update their own profile pictures  
create policy "Users can update their own profile pictures"
on storage.objects for update
to authenticated
using (bucket_id = 'profile-pictures' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow authenticated users to delete their own profile pictures
create policy "Users can delete their own profile pictures"
on storage.objects for delete
to authenticated
using (bucket_id = 'profile-pictures' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow public read access to profile pictures
create policy "Profile pictures are publicly accessible"
on storage.objects for select
to public
using (bucket_id = 'profile-pictures');
