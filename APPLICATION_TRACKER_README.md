# Application Tracker Setup

This document contains instructions for setting up the Application Tracker feature with Supabase database integration.

## Overview

The Application Tracker allows users to:
- Add university applications
- Track application status
- Filter and search applications
- View summary statistics (total applications, accepted, in-progress, etc.)

## Database Setup

### 1. Run SQL Script in Supabase

The `setup_applications_table.sql` script creates the necessary database table and security policies.

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the content of `setup_applications_table.sql`
4. Run the script

```sql
-- Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    university TEXT NOT NULL,
    program TEXT NOT NULL,
    country TEXT NOT NULL,
    intake TEXT NOT NULL,
    deadline TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Under Review', 'Accepted', 'Rejected', 'Preparing Documents')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own applications
CREATE POLICY "Users can view their own applications"
    ON public.applications
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own applications
CREATE POLICY "Users can insert their own applications"
    ON public.applications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own applications
CREATE POLICY "Users can update their own applications"
    ON public.applications
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own applications
CREATE POLICY "Users can delete their own applications"
    ON public.applications
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add special policy for development user
CREATE POLICY "Development user can access all applications"
    ON public.applications
    USING (user_id = 'development-user-id');

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON public.applications (user_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON public.applications (status);

-- Insert sample data for testing (optional)
INSERT INTO public.applications (user_id, university, program, country, intake, deadline, status)
VALUES
    ('development-user-id', 'Stanford University', 'MS Computer Science', 'USA', 'Fall 2024', 'Dec 15, 2023', 'Under Review'),
    ('development-user-id', 'University of Toronto', 'MS Data Science', 'Canada', 'Fall 2024', 'Jan 15, 2024', 'Accepted'),
    ('development-user-id', 'University of Melbourne', 'MBA', 'Australia', 'Spring 2024', 'Oct 30, 2023', 'Accepted'),
    ('development-user-id', 'Imperial College London', 'MSc Artificial Intelligence', 'UK', 'Fall 2024', 'Feb 28, 2024', 'Preparing Documents'),
    ('development-user-id', 'ETH Zurich', 'MSc Robotics', 'Switzerland', 'Fall 2024', 'Dec 15, 2023', 'Rejected')
ON CONFLICT DO NOTHING;
```

### 2. Check Environment Variables

Ensure your application has the correct Supabase environment variables set up:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 3. Local Development Mode

For local development without authentication:
- The system uses a `development-user-id` placeholder when no authenticated user is present
- Local storage is used as a fallback when database operations fail

## Usage

### Accessing the Application Tracker

The Application Tracker is available at:
- http://localhost:3000/application-tracker
- http://localhost:3000/track (alternative URL)

### Key Files

- `src/App/pages/TrackPage.tsx` - Main component for Application Tracker
- `src/lib/applicationTracker.ts` - Services for database operations
- `src/lib/supabase.ts` - Supabase client configuration

## Additional Notes

- The Application Tracker falls back to localStorage when Supabase operations fail
- Demo data is provided for testing purposes when the database isn't available
- All changes are synced both to the database and localStorage for redundancy

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Verify Supabase environment variables are correct
3. Ensure the applications table is properly set up in Supabase
4. Check network requests to see if API calls are succeeding

For database permission errors, ensure that row-level security policies are properly set up. 