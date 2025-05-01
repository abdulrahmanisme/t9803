-- Create the university_courses table
CREATE TABLE IF NOT EXISTS public.university_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_name TEXT NOT NULL,
    university_name TEXT NOT NULL,
    location TEXT NOT NULL,
    tuition_fee TEXT NOT NULL,
    duration TEXT NOT NULL,
    degree_type TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for common search fields
CREATE INDEX IF NOT EXISTS idx_university_courses_course_name ON public.university_courses (course_name);
CREATE INDEX IF NOT EXISTS idx_university_courses_university_name ON public.university_courses (university_name);
CREATE INDEX IF NOT EXISTS idx_university_courses_degree_type ON public.university_courses (degree_type);

-- Create a view for course listings
CREATE OR REPLACE VIEW public.course_listings AS
SELECT 
    id,
    course_name,
    university_name,
    location,
    tuition_fee,
    duration,
    degree_type,
    description
FROM 
    public.university_courses
ORDER BY 
    created_at DESC;

-- Enable RLS (Row Level Security)
ALTER TABLE public.university_courses ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to select courses
CREATE POLICY select_courses ON public.university_courses
    FOR SELECT
    USING (true);

-- Create policy for admin and superadmin to insert, update, delete
CREATE POLICY manage_courses ON public.university_courses
    FOR ALL
    USING (
        auth.role() = 'authenticated' AND (
            auth.jwt() ->> 'role' = 'admin' OR
            auth.jwt() ->> 'role' = 'superadmin'
        )
    );

-- Grant permissions
GRANT SELECT ON public.university_courses TO anon, authenticated;
GRANT ALL ON public.university_courses TO service_role;
GRANT SELECT ON public.course_listings TO anon, authenticated; 