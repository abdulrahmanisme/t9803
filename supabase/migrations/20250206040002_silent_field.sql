/*
  # Add Review Management System

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `agency_id` (uuid, references agencies)
      - `user_id` (uuid, references profiles)
      - `rating` (integer, 1-5)
      - `content` (text)
      - `status` (text: pending, approved, rejected)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `review_responses`
      - `id` (uuid, primary key)
      - `review_id` (uuid, references reviews)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for review creation and viewing
    - Add policies for review responses
*/

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES agencies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create review responses table
CREATE TABLE IF NOT EXISTS review_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Public can view approved reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agency owners can manage reviews for their agencies"
  ON reviews
  USING (agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid()));

-- Policies for review responses
CREATE POLICY "Public can view review responses"
  ON review_responses
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Agency owners can manage responses for their reviews"
  ON review_responses
  USING (review_id IN (
    SELECT id FROM reviews WHERE agency_id IN (
      SELECT id FROM agencies WHERE owner_id = auth.uid()
    )
  ))
  WITH CHECK (review_id IN (
    SELECT id FROM reviews WHERE agency_id IN (
      SELECT id FROM agencies WHERE owner_id = auth.uid()
    )
  ));