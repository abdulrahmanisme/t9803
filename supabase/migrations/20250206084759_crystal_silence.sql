-- Drop policies in batches to avoid pool timeout
DO $$
BEGIN
  -- Batch 1: Basic policies
  EXECUTE 'DROP POLICY IF EXISTS "Users can read own profile" ON profiles';
  EXECUTE 'DROP POLICY IF EXISTS "Users can update own profile" ON profiles';
  EXECUTE 'DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles';

  -- Batch 2: Read/update policies
  EXECUTE 'DROP POLICY IF EXISTS "profiles_read_policy" ON profiles';
  EXECUTE 'DROP POLICY IF EXISTS "profiles_update_policy" ON profiles';
  EXECUTE 'DROP POLICY IF EXISTS "profiles_admin_policy" ON profiles';

  -- Batch 3: Access policies
  EXECUTE 'DROP POLICY IF EXISTS "Public read access to profiles" ON profiles';
  EXECUTE 'DROP POLICY IF EXISTS "profiles_public_read" ON profiles';
  EXECUTE 'DROP POLICY IF EXISTS "profiles_self_update" ON profiles';
  EXECUTE 'DROP POLICY IF EXISTS "profiles_superadmin_all" ON profiles';
END $$;

-- Create policies one at a time with error handling
DO $$
BEGIN
  -- Create read policy
  BEGIN
    CREATE POLICY "profiles_read_policy_v5"
      ON profiles
      FOR SELECT
      TO public
      USING (true);
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  -- Create update policy
  BEGIN
    CREATE POLICY "profiles_update_policy_v5"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (id = auth.uid())
      WITH CHECK (id = auth.uid());
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  -- Create admin policy
  BEGIN
    CREATE POLICY "profiles_admin_policy_v5"
      ON profiles
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.uid() = id
          AND email = 'superadmin@superadmin.com'
        )
      );
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;