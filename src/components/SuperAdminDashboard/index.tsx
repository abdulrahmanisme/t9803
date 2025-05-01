import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '../../lib/supabase';
import { retryableQuery } from '../../lib/supabase';
import { AgencyTable } from './components/AgencyTable';
import { BulkUploadModal } from './components/BulkUploadModal';
import { AdminAssignments } from './components/AdminAssignments';
import { AdminManagement } from './components/AdminManagement';
import { UserAdminManagement } from './components/UserAdminManagement';
import { BlogManagement } from './components/BlogManagement';
import { CourseManagement } from './components/CourseManagement';
import { ScholarshipManagement } from './components/ScholarshipManagement';
import { Header } from './components/Header';
import { AddAdminModal } from './components/AddAdminModal';
import { Agency, CSVAgency } from './types';
import toast from 'react-hot-toast';
import { LayoutGrid, Users, BookOpen, Filter, Plus, Shield, Settings, Search, GraduationCap, Award } from 'lucide-react';

export function SuperAdminDashboard() {
  const { user } = useAuth();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'agencies' | 'courses' | 'scholarships' | 'blog'>('agencies');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const [uploadStatus, setUploadStatus] = useState({
    total: 0,
    processed: 0,
    success: 0,
    failed: 0
  });

  useEffect(() => {
    if (user) {
      loadAgencies();
      loadAdmins();
    }
  }, [filter, user]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAgencies(agencies);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = agencies.filter(agency => 
      agency.name.toLowerCase().includes(query) ||
      agency.location?.toLowerCase().includes(query) ||
      agency.contact_email?.toLowerCase().includes(query)
    );
    setFilteredAgencies(filtered);
  }, [searchQuery, agencies]);

  const loadAdmins = async () => {
    try {
      const { data: profilesData, error: profilesError } = await retryableQuery(() =>
        supabase
          .from('profiles')
          .select(`
            id,
            email,
            created_at,
            is_admin
          `)
          .eq('is_admin', true)
          .eq('is_super_admin', false)
      ) as Promise<{ data: any[] | null; error: any; }>;

      if (profilesError) throw profilesError;

      const adminsWithCounts = await Promise.all(
        (profilesData || []).map(async (profile: any) => {
          const { count, error: countError } = await supabase
            .from('agencies')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', profile.id);

          if (countError) throw countError;

          return {
            ...profile,
            agencies_count: count || 0
          };
        })
      );

      setAdmins(adminsWithCounts);
    } catch (error) {
      console.error('Failed to load admins:', error);
      toast.error('Failed to load admins');
    }
  };

  const loadAgencies = async () => {
    try {
      let query = supabase
        .from<Agency>('agencies')
        .select(`
          *,
          owner:profiles!agencies_owner_id_fkey (
            id,
            email
          )
        `)
        .order('name', { ascending: true });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await retryableQuery(() => query) as Promise<{ data: Agency[] | null; error: any; }>;

      if (error) throw error;
      
      // Custom sorting function to put numbers and special characters at the end
      const sortedAgencies = (data || []).sort((a, b) => {
        // Function to check if a string starts with a letter
        const startsWithLetter = (str: string) => /^[A-Za-z]/.test(str);
        
        const aStartsWithLetter = startsWithLetter(a.name);
        const bStartsWithLetter = startsWithLetter(b.name);
        
        // If one starts with letter and other doesn't, prioritize the letter
        if (aStartsWithLetter && !bStartsWithLetter) return -1;
        if (!aStartsWithLetter && bStartsWithLetter) return 1;
        
        // If both start with letters or both don't, sort alphabetically
        return a.name.localeCompare(b.name);
      });

      setAgencies(sortedAgencies);
    } catch (error) {
      console.error('Failed to load agencies:', error);
      toast.error('Failed to load agencies');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (agencyId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('agencies')
        .update({ status })
        .eq('id', agencyId);

      if (error) throw error;
      loadAgencies();
      toast.success(`Agency ${status}`);
    } catch (error) {
      toast.error('Failed to update agency status');
    }
  };

  const handleVerificationChange = async (agencyId: string, is_verified: boolean) => {
    try {
      const { error } = await supabase
        .from('agencies')
        .update({ is_verified })
        .eq('id', agencyId);

      if (error) throw error;
      loadAgencies();
      toast.success(`Agency ${is_verified ? 'verified' : 'unverified'}`);
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  const handleTrustScoreChange = async (agencyId: string, trust_score: number) => {
    try {
      const { error } = await supabase
        .from('agencies')
        .update({ trust_score })
        .eq('id', agencyId);

      if (error) throw error;
      loadAgencies();
      toast.success('Trust score updated');
    } catch (error) {
      toast.error('Failed to update trust score');
    }
  };

  const handleDeleteAgency = async (agencyId: string) => {
    try {
      // Step 1: Delete all review responses for this agency's reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('id')
        .eq('agency_id', agencyId);

      if (reviews && reviews.length > 0) {
        const reviewIds = reviews.map(review => review.id);
        await supabase
          .from('review_responses')
          .delete()
          .in('review_id', reviewIds);
      }

      // Step 2: Delete all reviews
      await supabase
        .from('reviews')
        .delete()
        .eq('agency_id', agencyId);

      // Step 3: Delete all services
      await supabase
        .from('agency_services')
        .delete()
        .eq('agency_id', agencyId);

      // Step 4: Delete all photos
      await supabase
        .from('agency_photos')
        .delete()
        .eq('agency_id', agencyId);

      // Step 5: Delete the agency itself
      await supabase
        .from('agencies')
        .delete()
        .eq('id', agencyId);

      // Update local state and reload agencies
      setAgencies(prevAgencies => prevAgencies.filter(a => a.id !== agencyId));
      await loadAgencies();

      toast.success('Agency deleted successfully');
    } catch (error) {
      toast.error('Failed to delete agency. Please try again.');
    }
  };

  const handleBulkUpload = async (agencies: CSVAgency[]) => {
    setUploadStatus({
      total: agencies.length,
      processed: 0,
      success: 0,
      failed: 0
    });

    for (const agency of agencies) {
      try {
        const { error } = await supabase
          .from('agencies')
          .insert([{
            name: agency.name,
            location: agency.location,
            description: agency.description,
            contact_email: agency.contact_email,
            trust_score: agency.trust_score || 0,
            price: agency.price || 0,
            contact_phone: agency.contact_phone || '',
            website: agency.website || '',
            business_hours: agency.business_hours || '',
            owner_id: user?.id,
            status: 'pending'
          }]);

        if (error) {
          console.error('Failed to insert agency:', error);
          throw error;
        }

        setUploadStatus(prev => ({
          ...prev,
          processed: prev.processed + 1,
          success: prev.success + 1
        }));
      } catch (error) {
        console.error('Failed to insert agency:', error);
        setUploadStatus(prev => ({
          ...prev,
          processed: prev.processed + 1,
          failed: prev.failed + 1
        }));
      }
    }

    await loadAgencies();
    toast.success('CSV upload completed');
    setShowUploadModal(false);
  };

  // Calculate pagination values
  const totalPages = Math.ceil(filteredAgencies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAgencies = filteredAgencies.slice(startIndex, endIndex);

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Super Admin Dashboard</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="w-full sm:w-auto appearance-none pl-8 pr-10 py-2 border-0 rounded-lg focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  <option value="all" className="text-gray-900">All Agencies</option>
                  <option value="pending" className="text-gray-900">Pending</option>
                  <option value="approved" className="text-gray-900">Approved</option>
                  <option value="rejected" className="text-gray-900">Rejected</option>
                </select>
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
              </div>
              <button
                onClick={() => setShowAddAdminModal(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border-2 border-white/30 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-blue-800 hover:bg-blue-50 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Bulk Upload
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 -mb-px overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-8 min-w-max" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('agencies')}
                className={`${
                  activeTab === 'agencies'
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-100 hover:text-white hover:border-white/50'
                } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Agencies & Admins
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`${
                  activeTab === 'courses'
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-100 hover:text-white hover:border-white/50'
                } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Course Management
              </button>
              <button
                onClick={() => setActiveTab('scholarships')}
                className={`${
                  activeTab === 'scholarships'
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-100 hover:text-white hover:border-white/50'
                } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Scholarship Management
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`${
                  activeTab === 'blog'
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-100 hover:text-white hover:border-white/50'
                } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Blog Management
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          {activeTab === 'agencies' ? (
            <>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <LayoutGrid className="h-5 w-5 text-blue-600" />
                      Agency Management
                    </h2>
                    <div className="relative flex-1 sm:max-w-xs">
                      <input
                        type="text"
                        placeholder="Search agencies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <AgencyTable
                      agencies={currentAgencies}
                      onStatusChange={handleStatusChange}
                      onVerificationChange={handleVerificationChange}
                      onTrustScoreChange={handleTrustScoreChange}
                      onDelete={handleDeleteAgency}
                    />
                  </div>
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-white">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(endIndex, filteredAgencies.length)}
                          </span>{' '}
                          of <span className="font-medium">{filteredAgencies.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === i + 1
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Admin Management
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <AdminManagement
                    admins={admins}
                    onAdminDeleted={loadAdmins}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    Agency Assignments
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <AdminAssignments
                    agencies={agencies}
                    admins={admins}
                    onAssignmentChange={loadAgencies}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    User Management
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <UserAdminManagement />
                </div>
              </div>
            </>
          ) : activeTab === 'courses' ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Course Management
                </h2>
              </div>
              <div className="overflow-x-auto">
                <CourseManagement />
              </div>
            </div>
          ) : activeTab === 'scholarships' ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Scholarship Management
                </h2>
              </div>
              <div className="overflow-x-auto">
                <ScholarshipManagement />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Blog Management
                </h2>
              </div>
              <div className="overflow-x-auto">
                <BlogManagement />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <BulkUploadModal
              onClose={() => setShowUploadModal(false)}
              onUpload={handleBulkUpload}
              uploadStatus={uploadStatus}
            />
          </div>
        </div>
      )}

      {showAddAdminModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <AddAdminModal
              onClose={() => setShowAddAdminModal(false)}
              onAdminAdded={loadAdmins}
            />
          </div>
        </div>
      )}
    </div>
  );
}