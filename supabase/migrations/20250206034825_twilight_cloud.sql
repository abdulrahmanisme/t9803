/*
  # Create agencies and related tables

  1. New Tables
    - `agencies`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references profiles)
      - `name` (text, not null)
      - `location` (text, not null)
      - `description` (text)
      - `trust_score` (numeric)
      - `contact_phone` (text)
      - `contact_email` (text)
      - `website` (text)
      - `business_hours` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `agency_services`
      - `id` (uuid, primary key)
      - `agency_id` (uuid, references agencies)
      - `name` (text, not null)
      - `description` (text)
      - `created_at` (timestamp)

    - `agency_photos`
      - `id` (uuid, primary key)
      - `agency_id` (uuid, references agencies)
      - `url` (text, not null)
      - `caption` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for:
      - Agency owners to manage their agencies
      - Public to view agency details
*/

-- Create agencies table
CREATE TABLE IF NOT EXISTS agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) NOT NULL,
  name text NOT NULL,
  location text NOT NULL,
  description text,
  trust_score numeric DEFAULT 0,
  contact_phone text,
  contact_email text,
  website text,
  business_hours text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create agency services table
CREATE TABLE IF NOT EXISTS agency_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES agencies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create agency photos table
CREATE TABLE IF NOT EXISTS agency_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES agencies(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_photos ENABLE ROW LEVEL SECURITY;

-- Policies for agencies
CREATE POLICY "Public can view agencies"
  ON agencies
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own agencies"
  ON agencies
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Policies for agency services
CREATE POLICY "Public can view agency services"
  ON agency_services
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their agency services"
  ON agency_services
  USING (agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid()))
  WITH CHECK (agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid()));

-- Policies for agency photos
CREATE POLICY "Public can view agency photos"
  ON agency_photos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their agency photos"
  ON agency_photos
  USING (agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid()))
  WITH CHECK (agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid()));