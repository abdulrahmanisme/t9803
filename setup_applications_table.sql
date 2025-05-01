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