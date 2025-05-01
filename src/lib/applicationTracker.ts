import { supabase } from './supabase';

export interface ApplicationData {
  id?: number;
  user_id?: string;
  university: string;
  program: string;
  country: string;
  intake: string;
  deadline: string;
  status: 'Under Review' | 'Accepted' | 'Rejected' | 'Preparing Documents';
  created_at?: string;
  updated_at?: string;
}

// Get all applications for the current user
export async function getApplications(userId?: string): Promise<ApplicationData[]> {
  try {
    // If we're developing locally without auth, use a placeholder user_id
    const developmentUserId = userId || 'development-user-id';
    
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', developmentUserId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching applications:', error);
      // Return demo data if we can't fetch from Supabase
      return getDemoApplications();
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getApplications:', error);
    // Return demo data if we can't fetch from Supabase
    return getDemoApplications();
  }
}

// Add a new application
export async function addApplication(application: Omit<ApplicationData, 'id' | 'created_at' | 'updated_at' | 'user_id'>, userId?: string): Promise<ApplicationData | null> {
  try {
    // If we're developing locally without auth, use a placeholder user_id
    const developmentUserId = userId || 'development-user-id';
    
    const { data, error } = await supabase
      .from('applications')
      .insert([{ 
        ...application, 
        user_id: developmentUserId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.error('Error adding application:', error);
      // If Supabase insert fails, store in localStorage as fallback
      const localApplications = getLocalApplications();
      const newId = Math.max(...localApplications.map(app => app.id || 0), 0) + 1;
      const newApplication = { 
        ...application, 
        id: newId, 
        user_id: developmentUserId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      localApplications.push(newApplication);
      saveLocalApplications(localApplications);
      
      return newApplication;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error in addApplication:', error);
    // If Supabase operation fails, store in localStorage as fallback
    const localApplications = getLocalApplications();
    const newId = Math.max(...localApplications.map(app => app.id || 0), 0) + 1;
    const newApplication = { 
      ...application, 
      id: newId, 
      user_id: 'development-user-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    localApplications.push(newApplication);
    saveLocalApplications(localApplications);
    
    return newApplication;
  }
}

// Update an existing application
export async function updateApplication(id: number, application: Partial<ApplicationData>, userId?: string): Promise<ApplicationData | null> {
  try {
    // If we're developing locally without auth, use a placeholder user_id
    const developmentUserId = userId || 'development-user-id';
    
    const { data, error } = await supabase
      .from('applications')
      .update({ 
        ...application, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .eq('user_id', developmentUserId)
      .select();
    
    if (error) {
      console.error('Error updating application:', error);
      // If Supabase update fails, update in localStorage as fallback
      const localApplications = getLocalApplications();
      const updatedApplications = localApplications.map(app => 
        app.id === id ? { ...app, ...application, updated_at: new Date().toISOString() } : app
      );
      saveLocalApplications(updatedApplications);
      
      return updatedApplications.find(app => app.id === id) || null;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error in updateApplication:', error);
    // If Supabase operation fails, update in localStorage as fallback
    const localApplications = getLocalApplications();
    const updatedApplications = localApplications.map(app => 
      app.id === id ? { ...app, ...application, updated_at: new Date().toISOString() } : app
    );
    saveLocalApplications(updatedApplications);
    
    return updatedApplications.find(app => app.id === id) || null;
  }
}

// Delete an application
export async function deleteApplication(id: number, userId?: string): Promise<boolean> {
  try {
    // If we're developing locally without auth, use a placeholder user_id
    const developmentUserId = userId || 'development-user-id';
    
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('user_id', developmentUserId);
    
    if (error) {
      console.error('Error deleting application:', error);
      // If Supabase delete fails, delete from localStorage as fallback
      const localApplications = getLocalApplications();
      const updatedApplications = localApplications.filter(app => app.id !== id);
      saveLocalApplications(updatedApplications);
      
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteApplication:', error);
    // If Supabase operation fails, delete from localStorage as fallback
    const localApplications = getLocalApplications();
    const updatedApplications = localApplications.filter(app => app.id !== id);
    saveLocalApplications(updatedApplications);
    
    return true;
  }
}

// Local storage operations as fallback
function getLocalApplications(): ApplicationData[] {
  try {
    const applications = localStorage.getItem('applications');
    return applications ? JSON.parse(applications) : [];
  } catch (error) {
    console.error('Error getting applications from localStorage:', error);
    return [];
  }
}

function saveLocalApplications(applications: ApplicationData[]): void {
  try {
    localStorage.setItem('applications', JSON.stringify(applications));
  } catch (error) {
    console.error('Error saving applications to localStorage:', error);
  }
}

// Demo data for testing or when database is unavailable
function getDemoApplications(): ApplicationData[] {
  return [
    {
      id: 1,
      user_id: 'development-user-id',
      university: 'Stanford University',
      program: 'MS Computer Science',
      country: 'USA',
      intake: 'Fall 2024',
      deadline: 'Dec 15, 2023',
      status: 'Under Review',
      created_at: '2023-10-15T10:00:00Z',
      updated_at: '2023-10-15T10:00:00Z'
    },
    {
      id: 2,
      user_id: 'development-user-id',
      university: 'University of Toronto',
      program: 'MS Data Science',
      country: 'Canada',
      intake: 'Fall 2024',
      deadline: 'Jan 15, 2024',
      status: 'Accepted',
      created_at: '2023-10-10T11:30:00Z',
      updated_at: '2023-11-20T14:45:00Z'
    },
    {
      id: 3,
      user_id: 'development-user-id',
      university: 'University of Melbourne',
      program: 'MBA',
      country: 'Australia',
      intake: 'Spring 2024',
      deadline: 'Oct 30, 2023',
      status: 'Accepted',
      created_at: '2023-09-05T09:15:00Z',
      updated_at: '2023-11-10T16:30:00Z'
    },
    {
      id: 4,
      user_id: 'development-user-id',
      university: 'Imperial College London',
      program: 'MSc Artificial Intelligence',
      country: 'UK',
      intake: 'Fall 2024',
      deadline: 'Feb 28, 2024',
      status: 'Preparing Documents',
      created_at: '2023-11-01T15:00:00Z',
      updated_at: '2023-11-01T15:00:00Z'
    },
    {
      id: 5,
      user_id: 'development-user-id',
      university: 'ETH Zurich',
      program: 'MSc Robotics',
      country: 'Switzerland',
      intake: 'Fall 2024',
      deadline: 'Dec 15, 2023',
      status: 'Rejected',
      created_at: '2023-10-20T08:45:00Z',
      updated_at: '2023-11-25T17:20:00Z'
    }
  ];
} 