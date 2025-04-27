-- Add user@user.com as a regular user
INSERT INTO auth.users (
  email,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_confirmed_at,
  is_sso_user,
  deleted_at
)
SELECT 
  'user@user.com',
  '{"provider":"email"}',
  NOW(),
  NOW(),
  '',
  NOW(),
  FALSE,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'user@user.com'
);

-- Make sure the user has no admin privileges
UPDATE profiles 
SET is_super_admin = false,
    updated_at = NOW()
WHERE email = 'user@user.com';