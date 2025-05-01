/*
  # Add brochure support for agencies

  1. Create storage bucket for brochures
  2. Add brochure_url column to agencies table
  3. Set up storage policies for brochures
*/

-- Create storage bucket for brochures if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('agency-brochures', 'agency-brochures', true)
ON CONFLICT (id) DO NOTHING;

-- Add brochure_url column to agencies table
ALTER TABLE agencies
ADD COLUMN IF NOT EXISTS brochure_url text;

-- Allow public read access to brochures
CREATE POLICY "Public can view agency brochures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'agency-brochures');

-- Allow authenticated users to upload brochures
CREATE POLICY "Authenticated users can upload agency brochures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'agency-brochures');

-- Allow users to delete their own brochures
CREATE POLICY "Users can delete agency brochures"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'agency-brochures' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Update bucket to ensure it's public
UPDATE storage.buckets
SET public = true
WHERE id = 'agency-brochures'; 