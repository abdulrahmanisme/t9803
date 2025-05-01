import { supabase } from './supabase';

export async function getGuides() {
  try {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching guides:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getGuides:', error);
    return [];
  }
}

export async function getGuideBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching guide by slug:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getGuideBySlug:', error);
    return null;
  }
}

export async function getBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, blog_tabs(name)')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    return [];
  }
}

export async function getBlogPostById(id: string) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, blog_tabs(name)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching blog post by id:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getBlogPostById:', error);
    return null;
  }
}

// Blog tabs management
export async function getBlogTabs() {
  try {
    const { data, error } = await supabase
      .from('blog_tabs')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching blog tabs:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getBlogTabs:', error);
    return [];
  }
}

export async function createBlogTab(tabData: { name: string; slug: string; description?: string; display_order: number }) {
  try {
    const { data, error } = await supabase
      .from('blog_tabs')
      .insert([tabData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating blog tab:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createBlogTab:', error);
    return null;
  }
}

export async function updateBlogTab(id: string, tabData: { name?: string; slug?: string; description?: string; display_order?: number }) {
  try {
    const { data, error } = await supabase
      .from('blog_tabs')
      .update(tabData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating blog tab:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateBlogTab:', error);
    return null;
  }
}

export async function deleteBlogTab(id: string) {
  try {
    const { error } = await supabase
      .from('blog_tabs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting blog tab:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteBlogTab:', error);
    return false;
  }
}

export async function updateBlogPostTab(postId: string, tabId: string | null) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ tab_id: tabId })
      .eq('id', postId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating blog post tab:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateBlogPostTab:', error);
    return null;
  }
}

// University Courses API

export async function getCourses() {
  try {
    const { data, error } = await supabase
      .from('university_courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

export async function getCourseById(id: string) {
  try {
    const { data, error } = await supabase
      .from('university_courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    throw error;
  }
}

export async function getCoursesByDegree(degreeType: string) {
  try {
    const { data, error } = await supabase
      .from('university_courses')
      .select('*')
      .eq('degree_type', degreeType)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching courses by degree type:', error);
    throw error;
  }
}

export async function getCoursesByUniversity(universityName: string) {
  try {
    const { data, error } = await supabase
      .from('university_courses')
      .select('*')
      .ilike('university_name', `%${universityName}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching courses by university:', error);
    throw error;
  }
}

export async function createCourse(courseData: {
  course_name: string;
  university_name: string;
  location: string;
  tuition_fee: string;
  duration: string;
  degree_type: string;
  description: string;
}) {
  try {
    const { data, error } = await supabase
      .from('university_courses')
      .insert([courseData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
}

export async function updateCourse(id: string, courseData: Partial<{
  course_name: string;
  university_name: string;
  location: string;
  tuition_fee: string;
  duration: string;
  degree_type: string;
  description: string;
}>) {
  try {
    const { data, error } = await supabase
      .from('university_courses')
      .update(courseData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
}

export async function deleteCourse(id: string) {
  try {
    const { error } = await supabase
      .from('university_courses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
} 