import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Star, Phone, Mail, Globe, Clock } from 'lucide-react';
import { ReviewForm } from './ReviewForm';
import { ReviewsList } from './ReviewsList';
import { PhotoGalleryModal } from './PhotoGalleryModal';
import { useAuth } from '../../components/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Agency {
  id: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  image_url: string;
  trust_score: number;
  price: number;
  specializations: string[];
  is_verified: boolean;
  contact_phone: string;
  contact_email: string;
  website: string;
  business_hours: string;
  photos?: Array<{
    id: string;
    url: string;
    caption: string;
    is_cover: boolean;
  }>;
}

interface Review {
  id: string;
  rating: number;
  content: string;
  created_at: string;
  user: {
    full_name: string | null;
    email: string;
  };
  response?: {
    content: string;
    created_at: string;
  };
}

interface AgencyDetailsProps {
  agency: Agency;
}

export function AgencyDetails({ agency }: AgencyDetailsProps) {
  const { user } = useAuth();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const coverPhoto = agency.photos?.find(photo => photo.is_cover) || agency.photos?.[0];
  const galleryPhotos = agency.photos?.filter(photo => !photo.is_cover) || [];

  useEffect(() => {
    loadReviews();
  }, [agency.id]);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          content,
          created_at,
          user:profiles(full_name, email),
          response:review_responses(content, created_at)
        `)
        .eq('agency_id', agency.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    }
  };

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img 
            src={coverPhoto?.url || agency.image_url} 
            alt={agency.name} 
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => coverPhoto && handlePhotoClick(0)}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{agency.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                {agency.location}
              </div>
              {agency.is_verified && (
                <div className="flex items-center bg-green-500/20 px-3 py-1 rounded-full">
                  <Shield className="h-4 w-4 mr-1" />
                  Verified
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">About Us</h2>
              <p className="text-gray-600 mb-6">{agency.description}</p>

              {galleryPhotos.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Photo Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryPhotos.map((photo, index) => (
                      <div 
                        key={photo.id} 
                        className="relative aspect-video group cursor-pointer"
                        onClick={() => handlePhotoClick(index + 1)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || 'Agency photo'}
                          className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80';
                          }}
                        />
                        {photo.caption && !photo.caption.match(/\.[^/.]+$/) && (
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            {photo.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-xl font-semibold mb-3">Our Specializations</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {agency.specializations.map((specialization) => (
                  <span
                    key={specialization}
                    className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                  >
                    {specialization}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
              <div className="space-y-3 mb-6">
                {agency.contact_phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-5 w-5" />
                    <span>{agency.contact_phone}</span>
                  </div>
                )}
                {agency.contact_email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-5 w-5" />
                    <a 
                      href={`mailto:${agency.contact_email}`}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {agency.contact_email}
                    </a>
                  </div>
                )}
                {agency.website && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="h-5 w-5" />
                    <a 
                      href={agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                {agency.business_hours && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5" />
                    <span>{agency.business_hours}</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-3">Reviews and Ratings</h3>
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${i < Math.round(agency.rating) ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-lg font-semibold">{agency.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">{reviews.length} reviews</span>
                </div>
              </div>

              <div className="space-y-6">
                {user && (
                  <ReviewForm 
                    agencyId={agency.id} 
                    onReviewSubmitted={loadReviews}
                  />
                )}
                {reviews.length > 0 ? (
                  <ReviewsList 
                    reviews={reviews} 
                    onReviewDeleted={loadReviews}
                  />
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Trust Score</h3>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  <span className="text-2xl font-bold">{agency.trust_score}%</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Starting Price</h3>
                <p className="text-2xl font-bold text-indigo-600">
                  ₹{agency.price.toLocaleString()}
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Schedule Consultation
                </button>
                <button className="w-full bg-white border-2 border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                  Download Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPhotoIndex !== null && agency.photos && (
        <PhotoGalleryModal
          photos={[coverPhoto!, ...galleryPhotos]}
          initialPhotoIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </div>
  );
}