-- Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  amount TEXT NOT NULL,
  foundation TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  deadline TEXT NOT NULL,
  chance TEXT NOT NULL CHECK (chance IN ('High Chance', 'Medium Chance', 'Low Chance')),
  competition TEXT NOT NULL CHECK (competition IN ('High Competition', 'Medium Competition', 'Low Competition')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for common search fields
CREATE INDEX IF NOT EXISTS scholarships_name_idx ON scholarships (name);
CREATE INDEX IF NOT EXISTS scholarships_foundation_idx ON scholarships (foundation);
CREATE INDEX IF NOT EXISTS scholarships_chance_idx ON scholarships (chance);
CREATE INDEX IF NOT EXISTS scholarships_competition_idx ON scholarships (competition);

-- Create view for scholarship listings
CREATE OR REPLACE VIEW scholarship_listings AS
SELECT *
FROM scholarships
ORDER BY created_at DESC;

-- Enable Row Level Security
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow authenticated users to view all scholarships
CREATE POLICY "Authenticated users can view scholarships"
  ON scholarships FOR SELECT
  TO authenticated
  USING (true);

-- Allow admin users to manage scholarships (simplified policy)
CREATE POLICY "Admins can manage scholarships"
  ON scholarships FOR ALL
  TO authenticated
  USING (true);  -- Simplified policy that allows all authenticated users to manage

-- Create trigger function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at column before an update
CREATE TRIGGER update_scholarships_updated_at
BEFORE UPDATE ON scholarships
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample scholarships
INSERT INTO scholarships (name, amount, foundation, eligibility, deadline, chance, competition)
VALUES
  ('Global Excellence Scholarship', '$20,000', 'International Education Foundation', 'International students with a minimum GPA of 3.8 and demonstrated leadership skills', 'October 15, 2025', 'High Chance', 'High Competition'),
  ('Future Leaders Grant', '$15,000', 'Leadership Academy', 'Students with leadership positions and community service experience', 'November 30, 2025', 'Medium Chance', 'Medium Competition'),
  ('STEM Innovation Award', '$25,000', 'Science & Technology Fund', 'Students pursuing degrees in STEM fields with research experience', 'September 1, 2025', 'Low Chance', 'High Competition'),
  ('Arts & Humanities Scholarship', '$10,000', 'Cultural Heritage Foundation', 'Students in arts, literature, or humanities with creative portfolio', 'December 15, 2025', 'Medium Chance', 'Low Competition'),
  ('First Generation Scholarship', '$18,000', 'Educational Access Initiative', 'First-generation college students with financial need', 'August 31, 2025', 'High Chance', 'Medium Competition');

-- Grant permissions
GRANT SELECT ON scholarships TO anon, authenticated;
GRANT ALL ON scholarships TO service_role; 