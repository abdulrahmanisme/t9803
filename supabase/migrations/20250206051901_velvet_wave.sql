/*
  # Add verification and rating columns to agencies

  1. New Columns
    - `is_verified` (boolean) - Indicates if the agency is verified
    - `rating` (numeric) - Agency's average rating
    - `total_reviews` (integer) - Total number of reviews

  2. Changes
    - Add constraints and default values
    - Update existing records
*/

-- Add verification and rating columns
ALTER TABLE agencies
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0;

-- Add constraints
ALTER TABLE agencies
ADD CONSTRAINT valid_total_reviews CHECK (total_reviews >= 0);

-- Create function to update agency rating
CREATE OR REPLACE FUNCTION update_agency_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE agencies
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE agency_id = NEW.agency_id
      AND status = 'approved'
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE agency_id = NEW.agency_id
      AND status = 'approved'
    )
  WHERE id = NEW.agency_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating updates
DROP TRIGGER IF EXISTS update_agency_rating_trigger ON reviews;
CREATE TRIGGER update_agency_rating_trigger
  AFTER INSERT OR UPDATE OF status
  ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_agency_rating();

-- Update existing ratings
UPDATE agencies a
SET 
  rating = COALESCE(
    (
      SELECT AVG(r.rating)
      FROM reviews r
      WHERE r.agency_id = a.id
      AND r.status = 'approved'
    ),
    0
  ),
  total_reviews = COALESCE(
    (
      SELECT COUNT(*)
      FROM reviews r
      WHERE r.agency_id = a.id
      AND r.status = 'approved'
    ),
    0
  );