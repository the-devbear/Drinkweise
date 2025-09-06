-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create policy for authenticated users to insert their own profile pictures
CREATE POLICY "Users can insert their own profile pictures" ON storage.objects
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    bucket_id = 'profile-pictures' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create policy for authenticated users to view their own profile pictures
CREATE POLICY "Users can view their own profile pictures" ON storage.objects
  FOR SELECT 
  TO authenticated 
  USING (
    bucket_id = 'profile-pictures' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create policy for public to view profile pictures (since bucket is public)
CREATE POLICY "Anyone can view profile pictures" ON storage.objects
  FOR SELECT 
  TO public 
  USING (bucket_id = 'profile-pictures');

-- Create policy for authenticated users to update their own profile pictures
CREATE POLICY "Users can update their own profile pictures" ON storage.objects
  FOR UPDATE 
  TO authenticated 
  USING (
    bucket_id = 'profile-pictures' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create policy for authenticated users to delete their own profile pictures
CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
  FOR DELETE 
  TO authenticated 
  USING (
    bucket_id = 'profile-pictures' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );