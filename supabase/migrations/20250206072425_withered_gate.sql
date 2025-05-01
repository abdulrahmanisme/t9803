-- Drop existing policies individually
DROP POLICY IF EXISTS "reviews_insert_policy" ON reviews;
DROP POLICY IF EXISTS "reviews_select_public_policy" ON reviews;
DROP POLICY IF EXISTS "reviews_select_own_policy" ON reviews;
DROP POLICY IF EXISTS "reviews_agency_owner_policy" ON reviews;
DROP POLICY IF EXISTS "reviews_update_own_policy" ON reviews;
DROP POLICY IF EXISTS "reviews_delete_own_policy" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view their own reviews" ON reviews;
DROP POLICY IF EXISTS "Agency owners can manage reviews for their agencies" ON reviews;

-- Create new policies with unique names
CREATE POLICY "reviews_insert_policy"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);  -- Allow any authenticated user to create reviews

CREATE POLICY "reviews_select_public_policy"
  ON reviews
  FOR SELECT
  TO public
  USING (
    status = 'approved' OR
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NOT NULL AND agency_id IN (
      SELECT id FROM agencies WHERE owner_id = auth.uid()
    ))
  );

CREATE POLICY "reviews_select_own_policy"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "reviews_agency_owner_policy"
  ON reviews
  FOR ALL
  TO authenticated
  USING (
    agency_id IN (
      SELECT id FROM agencies WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "reviews_update_own_policy"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reviews_delete_own_policy"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());