/*
  # Fix review policies

  1. Changes
    - Update RLS policies for reviews table to properly handle user submissions
    - Add proper policy for authenticated users to create reviews
    - Fix policy for viewing reviews

  2. Security
    - Maintain proper access control while allowing authenticated users to submit reviews
    - Ensure users can only create reviews with their own user_id
*/

-- First drop existing policies
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;

-- Create new, more permissive policies
CREATE POLICY "Users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    status = 'pending'
  );

CREATE POLICY "Anyone can view approved reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (
    status = 'approved' OR
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
  );

-- Add policy for users to view their own pending reviews
CREATE POLICY "Users can view their own reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());