-- Add is_cover column to agency_photos table
ALTER TABLE agency_photos
ADD COLUMN IF NOT EXISTS is_cover boolean DEFAULT false;

-- Create a function to ensure only one cover photo per agency
CREATE OR REPLACE FUNCTION ensure_single_cover_photo()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_cover THEN
    -- Set is_cover to false for all other photos of the same agency
    UPDATE agency_photos
    SET is_cover = false
    WHERE agency_id = NEW.agency_id
    AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to maintain single cover photo constraint
DROP TRIGGER IF EXISTS ensure_single_cover_photo_trigger ON agency_photos;
CREATE TRIGGER ensure_single_cover_photo_trigger
  BEFORE INSERT OR UPDATE OF is_cover
  ON agency_photos
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_cover_photo();

-- Set first photo as cover for agencies without a cover photo
DO $$
DECLARE
  agency_rec RECORD;
  first_photo_id uuid;
BEGIN
  FOR agency_rec IN SELECT DISTINCT agency_id FROM agency_photos WHERE NOT EXISTS (
    SELECT 1 FROM agency_photos WHERE agency_id = agency_photos.agency_id AND is_cover = true
  ) LOOP
    SELECT id INTO first_photo_id
    FROM agency_photos
    WHERE agency_id = agency_rec.agency_id
    ORDER BY created_at ASC
    LIMIT 1;
    
    IF first_photo_id IS NOT NULL THEN
      UPDATE agency_photos
      SET is_cover = true
      WHERE id = first_photo_id;
    END IF;
  END LOOP;
END $$;