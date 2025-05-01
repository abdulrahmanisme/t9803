/*
  # Add slug support for agencies

  1. Changes
    - Add slug column to agencies table
    - Create function to generate URL-friendly slugs
    - Add trigger to automatically generate slugs
    - Add unique constraint on slugs
    - Backfill existing agencies with slugs

  2. Security
    - No changes to RLS policies needed
*/

-- Add slug column
ALTER TABLE agencies
ADD COLUMN IF NOT EXISTS slug text;

-- Create function to generate slugs
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
      name || '-' || location,
      '[^a-zA-Z0-9]+',
      '-',
      'g'
    )
  );
  
  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);
  
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

-- Create trigger to generate slugs
CREATE OR REPLACE FUNCTION generate_agency_slug_trigger()
RETURNS trigger AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_agency_slug(NEW.name, NEW.location);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_agency_slug
  BEFORE INSERT OR UPDATE
  ON agencies
  FOR EACH ROW
  EXECUTE FUNCTION generate_agency_slug_trigger();

-- Add unique constraint
ALTER TABLE agencies
ADD CONSTRAINT unique_agency_slug UNIQUE (slug);

-- Backfill existing agencies
UPDATE agencies
SET slug = generate_agency_slug(name, location)
WHERE slug IS NULL;