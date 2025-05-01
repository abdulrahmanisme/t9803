import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAgency } from '../hooks/useAgency';
import { Shield, MapPin, Star, Phone, Mail, Globe, Clock, Download, MessageSquare, X } from 'lucide-react';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewsList } from '../components/ReviewsList';
import { PhotoGalleryModal } from '../components/PhotoGalleryModal';
import { useAuth } from '../../components/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import Cal, { getCalApi } from "@calcom/embed-react";
import { SEO } from '../components/SEO';

interface Review {
  id: string;
  rating: number;
  content: string;
  created_at: string;
  user: {
    full_name: string | null;
    email: string;
  } | null;
  response?: {
    content: string;
    created_at: string;
  } | null;
}

export function AgencyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { agency, loading, error } = useAgency(slug);
  const { user } = useAuth();
  const [showGallery, setShowGallery] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (agency) {
      loadReviews();
    }
  }, [agency]);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: {
          branding: { brandColor: "#1e40af" }
        },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  const loadReviews = async () => {
    if (!agency) return;
    
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
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process the data to match the Review interface
      const formattedReviews: Review[] = (data || []).map((review: any) => ({
        id: review.id,
        rating: review.rating,
        content: review.content,
        created_at: review.created_at,
        user: review.user?.[0] || null,
        response: review.response?.[0] || null
      }));
      
      setReviews(formattedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  // Get the main image URL for the agency
  const getMainImageUrl = (agency: any): string => {
    const coverPhoto = agency.photos?.find((photo: any) => photo.is_cover);
    if (coverPhoto) return coverPhoto.url;
    if (agency.photos?.[0]) return agency.photos[0].url;
    return agency.image_url || 'https://via.placeholder.com/800x400?text=No+Image';
  };

  // Generate schema for the agency page
  const generateAgencySchema = (agency: any) => {
    const imageUrl = getMainImageUrl(agency);
    
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `https://admissions.app/agency/${agency.slug}`,
      name: agency.name,
      image: imageUrl,
      description: agency.description,
      url: `https://admissions.app/agency/${agency.slug}`,
      telephone: agency.contact_phone,
      email: agency.contact_email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: agency.location
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: agency.latitude || undefined,
        longitude: agency.longitude || undefined
      },
      priceRange: agency.price ? `₹${agency.price}` : undefined,
      openingHours: agency.business_hours || undefined,
      isVerified: agency.is_verified || false,
      aggregateRating: agency.rating ? {
        '@type': 'AggregateRating',
        ratingValue: agency.rating,
        reviewCount: reviews.length,
        bestRating: '5',
        worstRating: '1'
      } : undefined,
      review: reviews.map((review: any) => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: '5',
          worstRating: '1'
        },
        author: {
          '@type': 'Person',
          name: review.user?.full_name || 'Anonymous'
        },
        reviewBody: review.content,
        datePublished: review.created_at
      })),
      makesOffer: agency.services ? agency.services.map((service: any) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description || undefined
        }
      })) : undefined
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agency Not Found</h2>
          <p className="text-gray-600">The agency you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const imageUrl = getMainImageUrl(agency);

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <SEO
        title={`${agency.name} | College Admissions Consultant`}
        description={agency.description.substring(0, 160)}
        canonicalUrl={`/agency/${agency.slug}`}
        ogImage={imageUrl}
        ogType="profile"
        keywords={[
          'college consultant', 
          'admissions consultant', 
          'education services', 
          agency.location, 
          ...agency.specializations || []
        ]}
        schema={generateAgencySchema(agency)}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section with improved gradient */}
          <div 
            className="relative h-[40vh] md:h-[50vh] flex items-end" 
            style={{ 
              backgroundImage: `url(${agency.photos?.[0]?.url || 'https://via.placeholder.com/800x400?text=No+Image'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Main Content */}
          <div className="p-4 sm:p-8">
            {/* Agency title and location moved here from hero section */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  {agency.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-yellow-50 text-gray-800 px-3 py-1.5 rounded-full shadow-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{agency.rating.toFixed(1)}</span>
                  </div>
                  {agency.is_verified && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-full shadow-sm">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* About Us section spanning all columns */}
            <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">About Us</h2>
              <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto text-base">
                {agency.description}
              </p>
            </div>

            {/* Services Section - Moved above contact info */}
            <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Our Services</h2>
              <div>
                {agency.services && agency.services.length > 0 ? (
                  <ul className="list-disc pl-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {agency.services.map((service, index) => (
                      <li key={index} className="text-gray-800">
                        <span className="font-semibold text-gray-900">{service.name}</span>
                        {service.description && (
                          <p className="text-gray-700 mt-2 text-base">{service.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="list-disc pl-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <li className="text-gray-800">
                      <span className="font-semibold text-gray-900">College Admission Counseling</span>
                      <p className="text-gray-700 mt-2 text-base">Expert guidance for college application process</p>
                    </li>
                    <li className="text-gray-800">
                      <span className="font-semibold text-gray-900">Essay Review & Editing</span>
                      <p className="text-gray-700 mt-2 text-base">Professional review and editing of application essays</p>
                    </li>
                    <li className="text-gray-800">
                      <span className="font-semibold text-gray-900">Entrance Exam Preparation</span>
                      <p className="text-gray-700 mt-2 text-base">Specialized coaching for entrance exams</p>
                    </li>
                    <li className="text-gray-800">
                      <span className="font-semibold text-gray-900">Interview Preparation</span>
                      <p className="text-gray-700 mt-2 text-base">Mock interviews and preparation for college interviews</p>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            {/* Contact Info Section */}
            <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2.5 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Phone</p>
                    <p className="text-gray-700">{agency.contact_phone || 'Not available'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2.5 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-gray-700">{agency.contact_email || 'Not available'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2.5 rounded-lg">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Website</p>
                    <p className="text-gray-700">
                      {agency.website ? (
                        <a 
                          href={agency.website.startsWith('http') ? agency.website : `https://${agency.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {agency.website}
                        </a>
                      ) : (
                        'Not available'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2.5 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Business Hours</p>
                    <p className="text-gray-700 whitespace-pre-line">{agency.business_hours || 'Not available'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2.5 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Location</p>
                    <p className="text-gray-700">{agency.location || 'Not available'}</p>
                  </div>
                </div>

                {agency.brochure_url && (
                  <div className="md:col-span-2 mt-4">
                    <a
                      href={agency.brochure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                    >
                      <Download className="h-4 w-4" />
                      Download Brochure
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Additional Info appears first, Desktop: Uses 3-column grid */}
            <div className="block lg:hidden mb-8">
              {/* Additional Info Box - Mobile View (Above Gallery) */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 space-y-8">
                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-100 pb-2">Trust Score</h3>
                  <div className="flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <Shield className="h-7 w-7 text-green-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{agency.trust_score}%</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-100 pb-2">Starting Price</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{agency.price.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <button
                    onClick={() => setShowBooking(true)}
                    className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-sm hover:shadow-md font-medium"
                  >
                    Schedule Consultation
                  </button>
                  <a
                    href={agency.brochure_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-[1.02] shadow-sm hover:shadow-md font-medium"
                    onClick={(e) => {
                      if (!agency.brochure_url) {
                        e.preventDefault();
                        toast.error('Brochure is currently unavailable for this agency.');
                      }
                    }}
                  >
                    Download Brochure
                  </a>
                </div>
              </div>
            </div>

            {/* Desktop Layout: Three-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Agency Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Photo Gallery */}
                {agency.photos && agency.photos.length > 0 && (
                  <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Photo Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {agency.photos.map((photo, index) => (
                        <button
                          key={photo.id}
                          className="relative overflow-hidden rounded-lg cursor-pointer aspect-square group"
                          onClick={() => {
                            setSelectedPhotoIndex(index);
                            setShowGallery(true);
                          }}
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption || `${agency.name} photo`}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">View</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Reviews Section */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 border-b border-gray-100 pb-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-0">Reviews</h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 sm:h-6 sm:w-6 ${i < Math.round(agency.rating) ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold">{agency.rating.toFixed(1)}</span>
                      <div className="hidden sm:flex items-center gap-2 text-gray-500">
                        <span>•</span>
                        <span>{reviews.length} reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <button
                      onClick={() => setIsAddingReview(true)}
                      className="w-full sm:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Add Review
                    </button>
                  </div>
                  
                  {isAddingReview && (
                    <div className="mb-8">
                      <ReviewForm agencyId={agency.id} onReviewSubmitted={() => {
                        setIsAddingReview(false);
                        loadReviews();
                      }} />
                    </div>
                  )}

                  {reviewsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : reviews.length > 0 ? (
                    <ReviewsList reviews={reviews} onReviewDeleted={loadReviews} />
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Additional Info (Hidden on Mobile) */}
              <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start">
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 space-y-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-100 pb-2">Trust Score</h3>
                    <div className="flex items-center gap-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <Shield className="h-7 w-7 text-green-600" />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">{agency.trust_score}%</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-100 pb-2">Starting Price</h3>
                    <p className="text-3xl font-bold text-blue-600">
                      ₹{agency.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <button
                      onClick={() => setShowBooking(true)}
                      className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-sm hover:shadow-md font-medium"
                    >
                      Schedule Consultation
                    </button>
                    <a
                      href={agency.brochure_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-[1.02] shadow-sm hover:shadow-md font-medium"
                      onClick={(e) => {
                        if (!agency.brochure_url) {
                          e.preventDefault();
                          toast.error('Brochure is currently unavailable for this agency.');
                        }
                      }}
                    >
                      Download Brochure
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
          <div className="h-full w-full flex flex-col">
            <div className="bg-white w-full flex-1 flex flex-col">
              <div className="flex-shrink-0 border-b border-gray-100 flex items-center justify-between p-4">
                <h3 className="text-lg font-semibold text-gray-900">Schedule a Consultation</h3>
                <button
                  onClick={() => setShowBooking(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close booking modal"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch">
                <Cal
                  calLink="forge/consultation"
                  style={{
                    width: "100%",
                    height: "100vh",
                    overflow: "auto"
                  }}
                  config={{
                    layout: "month_view",
                    hideEventTypeDetails: "false"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Gallery Modal */}
      {showGallery && agency.photos && (
        <PhotoGalleryModal
          photos={agency.photos}
          initialPhotoIndex={selectedPhotoIndex}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
}
