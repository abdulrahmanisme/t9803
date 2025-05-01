import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Agency, Service, Review, ReviewResponse, TrustScoreMetrics as TrustScoreMetricsType, Photo } from './types';
import { AgencyList } from './components/AgencyList';
import { AgencyDetails } from './components/AgencyDetails';
import { ServicesList } from './components/ServicesList';
import { PhotosList } from './components/PhotosList';
import { TrustScoreMetrics } from './components/TrustScoreMetrics';
import { ReviewsList } from './components/ReviewsList';
import { CreateAgencyModal } from './components/CreateAgencyModal';
import { retryableQuery, handleSupabaseError } from '../../lib/supabase';
import { LayoutGrid, Users, BookOpen, Filter, Plus, Shield, Settings, Search, Building2, Star, Image, MessageSquare } from 'lucide-react';

type SupabaseQueryResult<T> = Promise<{
  data: T[] | null;
  error: any;
}>;

export function AdminDashboard() {
  const { user } = useAuth();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [responses, setResponses] = useState<Record<string, ReviewResponse>>({});
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [trustScoreMetrics, setTrustScoreMetrics] = useState<TrustScoreMetricsType>({
    averageRating: 0,
    totalReviews: 0,
    verifiedServices: 0,
    isVerified: false
  });

  useEffect(() => {
    if (user) {
      loadAgencies();
    }
  }, [user]);

  useEffect(() => {
    if (selectedAgency) {
      loadServices();
      loadPhotos();
      loadReviews();
      loadResponses();
      calculateTrustScore();
    }
  }, [selectedAgency]);

  const loadAgencies = async () => {
    try {
      const result = await retryableQuery(() => 
        supabase
          .from('agencies')
          .select('*')
          .eq('owner_id', user?.id)
      ) as { data: Agency[] | null; error: any };
      
      if (result.error) throw result.error;
      setAgencies(result.data || []);
    } catch (error) {
      console.error('Failed to load agencies:', error);
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    if (!selectedAgency) return;
    
    try {
      const result = await retryableQuery(() =>
        supabase
          .from('agency_services')
          .select('*')
          .eq('agency_id', selectedAgency.id)
      ) as { data: Service[] | null; error: any };
      
      if (result.error) throw result.error;
      setServices(result.data || []);
    } catch (error) {
      console.error('Failed to load services:', error);
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
    }
  };

  const loadPhotos = async () => {
    if (!selectedAgency) return;
    
    try {
      const result = await retryableQuery(() =>
        supabase
          .from('agency_photos')
          .select('*')
          .eq('agency_id', selectedAgency.id)
      ) as { data: Photo[] | null; error: any };
      
      if (result.error) throw result.error;
      setPhotos(result.data || []);
    } catch (error) {
      console.error('Failed to load photos:', error);
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
    }
  };

  const loadReviews = async () => {
    if (!selectedAgency) return;
    
    try {
      const result = await retryableQuery(() =>
        supabase
          .from('reviews')
          .select('*, profiles(email)')
          .eq('agency_id', selectedAgency.id)
          .order('created_at', { ascending: false })
      ) as { data: (Review & { profiles?: { email: string } })[] | null; error: any };
      
      if (result.error) throw result.error;
      
      setReviews((result.data || []).map(review => ({
        ...review,
        user_email: review.profiles?.email
      })));
    } catch (error) {
      console.error('Failed to load reviews:', error);
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadResponses = async () => {
    if (!selectedAgency) return;
    
    try {
      const result = await retryableQuery(() =>
        supabase
          .from('review_responses')
          .select('*')
          .in('review_id', reviews.map(r => r.id))
      ) as { data: ReviewResponse[] | null; error: any };
      
      if (result.error) throw result.error;
      
      const responseMap = (result.data || []).reduce<Record<string, ReviewResponse>>((acc, response) => {
        acc[response.review_id] = response;
        return acc;
      }, {});
      
      setResponses(responseMap);
    } catch (error) {
      console.error('Failed to load responses:', error);
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
    }
  };

  const calculateTrustScore = async () => {
    if (!selectedAgency) return;

    try {
      const approvedReviews = reviews.filter(r => r.status === 'approved');
      const averageRating = approvedReviews.length > 0
        ? approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length
        : 0;

      const verifiedServices = services.length;

      setTrustScoreMetrics({
        averageRating,
        totalReviews: approvedReviews.length,
        verifiedServices,
        isVerified: selectedAgency.is_verified || false
      });

      const ratingScore = (averageRating / 5) * 50;
      const servicesScore = Math.min(verifiedServices * 5, 30);
      const verificationScore = selectedAgency.is_verified ? 20 : 0;

      const totalScore = Math.round(ratingScore + servicesScore + verificationScore);

      const { error } = await supabase
        .from('agencies')
        .update({ trust_score: totalScore })
        .eq('id', selectedAgency.id);

      if (error) throw error;

      setSelectedAgency(prev => prev ? { ...prev, trust_score: totalScore } : null);
    } catch (error) {
      console.error('Failed to calculate trust score:', error);
    }
  };

  const handleAddPhoto = async (photo: Omit<Photo, 'id'>) => {
    if (!selectedAgency) return;

    try {
      const { error } = await supabase
        .from('agency_photos')
        .insert([{ ...photo, agency_id: selectedAgency.id }]);

      if (error) throw error;
      loadPhotos();
      toast.success('Photo added successfully');
    } catch (error) {
      toast.error('Failed to add photo');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('agency_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;
      loadPhotos();
      toast.success('Photo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAgency) return;

    // Validate file type
    if (!file.type.startsWith('application/pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('agency-brochures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('agency-brochures')
        .getPublicUrl(filePath);

      // Update agency with brochure URL
      const { error: updateError } = await supabase
        .from('agencies')
        .update({ brochure_url: publicUrl })
        .eq('id', selectedAgency.id);

      if (updateError) throw updateError;

      // Update local state
      setSelectedAgency({ ...selectedAgency, brochure_url: publicUrl });
      toast.success('Brochure uploaded successfully');
    } catch (error) {
      console.error('Error uploading brochure:', error);
      toast.error('Failed to upload brochure');
    }
  };

  const handleDeleteBrochure = async () => {
    if (!selectedAgency?.brochure_url) return;

    try {
      // Extract file name from URL
      const fileName = selectedAgency.brochure_url.split('/').pop();
      if (!fileName) throw new Error('Invalid file name');

      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from('agency-brochures')
        .remove([fileName]);

      if (deleteError) throw deleteError;

      // Update agency to remove brochure URL
      const { error: updateError } = await supabase
        .from('agencies')
        .update({ brochure_url: null })
        .eq('id', selectedAgency.id);

      if (updateError) throw updateError;

      // Update local state
      setSelectedAgency({ ...selectedAgency, brochure_url: undefined });
      toast.success('Brochure deleted successfully');
    } catch (error) {
      console.error('Error deleting brochure:', error);
      toast.error('Failed to delete brochure');
    }
  };

  const handleSetCoverPhoto = async (photoId: string) => {
    if (!selectedAgency) return;

    try {
      // First, remove cover status from all photos
      await supabase
        .from('agency_photos')
        .update({ is_cover: false })
        .eq('agency_id', selectedAgency.id);

      // Then set the new cover photo
      const { error } = await supabase
        .from('agency_photos')
        .update({ is_cover: true })
        .eq('id', photoId);

      if (error) throw error;
      loadPhotos();
      toast.success('Cover photo updated');
    } catch (error) {
      toast.error('Failed to update cover photo');
    }
  };

  const handleAgencyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgency) return;

    try {
      const { error } = await supabase
        .from('agencies')
        .update(selectedAgency)
        .eq('id', selectedAgency.id);

      if (error) throw error;
      toast.success('Agency updated successfully');
      loadAgencies();
    } catch (error) {
      toast.error('Failed to update agency');
    }
  };

  const handleAddService = async (service: Omit<Service, 'id'>) => {
    if (!selectedAgency) return;

    try {
      const { error } = await supabase
        .from('agency_services')
        .insert([{ ...service, agency_id: selectedAgency.id }]);

      if (error) throw error;
      loadServices();
      toast.success('Service added successfully');
    } catch (error) {
      toast.error('Failed to add service');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('agency_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      loadServices();
      toast.success('Service deleted successfully');
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const handleReviewAction = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', reviewId);

      if (error) throw error;
      loadReviews();
      toast.success(`Review ${status}`);
    } catch (error) {
      toast.error('Failed to update review status');
    }
  };

  const handleResponseSubmit = async (reviewId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('review_responses')
        .insert([{ review_id: reviewId, content }]);

      if (error) throw error;
      loadResponses();
      toast.success('Response submitted');
    } catch (error) {
      toast.error('Failed to submit response');
    }
  };

  const handleCreateAgency = async (agency: Partial<Agency>) => {
    try {
      const { error } = await supabase
        .from('agencies')
        .insert([{ ...agency, owner_id: user?.id }]);

      if (error) throw error;
      loadAgencies();
      setShowCreateModal(false);
      toast.success('Agency created successfully');
    } catch (error) {
      toast.error('Failed to create agency');
    }
  };

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">Access Denied</p>
          <p className="text-gray-600 mb-4">Please sign in to access the admin dashboard.</p>
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
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-blue-800 hover:bg-blue-50 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Agency
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {agencies.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Agencies Yet</h2>
            <p className="text-gray-600 mb-6">Get started by creating your first agency.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg hover:from-blue-700 hover:to-blue-500 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Agency
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-4 sm:p-6">
                  <AgencyList
                    agencies={agencies}
                    selectedAgency={selectedAgency}
                    onSelectAgency={setSelectedAgency}
                  />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            {selectedAgency && (
              <div className="lg:col-span-3 space-y-6">
                {/* Agency Details Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      Agency Details
                    </h2>
                  </div>
                  <div className="p-6">
                    <AgencyDetails
                      agency={selectedAgency}
                      onUpdate={setSelectedAgency}
                      onSubmit={handleAgencyUpdate}
                    />
                  </div>
                </div>

                {/* Trust Score Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Star className="h-5 w-5 text-blue-600" />
                      Trust Score & Metrics
                    </h2>
                  </div>
                  <div className="p-6">
                    <TrustScoreMetrics
                      metrics={trustScoreMetrics}
                      trustScore={selectedAgency.trust_score || 0}
                    />
                  </div>
                </div>

                {/* Photos Section */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Image className="h-5 w-5 text-blue-600" />
                      Photos
                    </h2>
                  </div>
                  <div className="p-6">
                    <PhotosList
                      photos={photos}
                      onAddPhoto={handleAddPhoto}
                      onDeletePhoto={handleDeletePhoto}
                      onSetCover={handleSetCoverPhoto}
                    />
                  </div>
                </div>

                {/* Services Section */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                      Services
                    </h2>
                  </div>
                  <div className="p-6">
                    <ServicesList
                      services={services}
                      onAddService={handleAddService}
                      onDeleteService={handleDeleteService}
                    />
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      Reviews
                    </h2>
                  </div>
                  <div className="p-6">
                    <ReviewsList
                      reviews={reviews}
                      responses={responses}
                      loading={reviewsLoading}
                      onReviewAction={handleReviewAction}
                      onResponseSubmit={handleResponseSubmit}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <CreateAgencyModal
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreateAgency}
            />
          </div>
        </div>
      )}
    </div>
  );
}