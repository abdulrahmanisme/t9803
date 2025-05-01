/*
  # Fix storage policies for agency photos
  
  1. Updates storage policies to:
    - Allow public access to all photos
    - Simplify upload permissions
    - Fix delete permissions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view agency photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload agency photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own agency photos" ON storage.objects;

-- Create simpler, more permissive policies
CREATE POLICY "Public can view agency photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'agency-photos');

CREATE POLICY "Authenticated users can upload agency photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'agency-photos');

CREATE POLICY "Users can delete agency photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'agency-photos');

-- Update bucket to ensure it's public
UPDATE storage.buckets
SET public = true
WHERE id = 'agency-photos';