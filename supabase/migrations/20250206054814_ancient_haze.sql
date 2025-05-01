/*
  # Storage setup for agency photos

  1. Create storage bucket for agency photos
  2. Set up storage policies for:
    - Public read access
    - Authenticated upload access
    - Owner-only delete access
*/

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('agency-photos', 'agency-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to photos
CREATE POLICY "Public can view agency photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'agency-photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload agency photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'agency-photos' AND
  (storage.foldername(name))[1] = 'agency-photos'
);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own agency photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'agency-photos' AND
  auth.uid()::text = (storage.foldername(name))[2]
);