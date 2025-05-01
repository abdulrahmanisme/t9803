/*
  # Fix agency slugs and add missing columns

  1. Changes
    - Add missing columns to agencies table
    - Update slug generation to be more robust
    - Add indexes for performance
    - Add data validation constraints

  2. Security
    - Ensure RLS policies cover new columns
*/

-- Add missing columns if they don't exist
ALTER TABLE agencies
ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS price numeric DEFAULT 0;

-- Improve slug generation function
CREATE OR REPLACE FUNCTION generate_agency_slug(name text, location text)
RETURNS text AS $$
DECLARE
  base_slug text;
  new_slug text;
  counter integer := 1;
BEGIN
  -- Create base slug from name and location
  base_slug := lower(
    regexp_replace(
      regexp_replace(
        name || '-' || location,
        '[^a-zA-Z0-9\s-]',
        '',
        'g'
      ),
      '\s+',
      '-',
      'g'
    )
  );
  
  -- Remove leading/trailing hyphens and multiple consecutive hyphens
  base_slug := regexp_replace(trim(both '-' from base_slug), '-+', '-', 'g');
  
  -- Initial slug attempt
  new_slug := base_slug;
  
  -- Keep trying until we find a unique slug
  WHILE EXISTS (SELECT 1 FROM agencies WHERE slug = new_slug) LOOP
    counter := counter + 1;
    new_slug := base_slug || '-' || counter::text;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing agencies with missing slugs
UPDATE agencies
SET 
  slug = generate_agency_slug(name, location)
WHERE slug IS NULL;

-- Add validation constraints
ALTER TABLE agencies
ADD CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5),
ADD CONSTRAINT valid_price CHECK (price >= 0),
ADD CONSTRAINT valid_trust_score CHECK (trust_score >= 0 AND trust_score <= 100);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS agencies_slug_idx ON agencies (slug);
CREATE INDEX IF NOT EXISTS agencies_rating_idx ON agencies (rating);
CREATE INDEX IF NOT EXISTS agencies_trust_score_idx ON agencies (trust_score);
CREATE INDEX IF NOT EXISTS agencies_location_idx ON agencies (location);

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Public can view agencies" ON agencies;
CREATE POLICY "Public can view agencies"
  ON agencies
  FOR SELECT
  TO public
  USING (
    status = 'approved' OR 
    (CASE 
      WHEN auth.uid() IS NOT NULL THEN owner_id = auth.uid()
      ELSE false
    END)
  );