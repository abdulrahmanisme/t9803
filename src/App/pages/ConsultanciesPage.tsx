import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, Phone, Star, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Agency {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  rating: number;
  trust_score: number;
  image_url: string;
  price: number;
  is_verified: boolean;
  specializations: string[];
  photos?: Array<{
    id: string;
    url: string;
    caption: string;
    is_cover: boolean;
  }>;
}

export default function ConsultanciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedTrustScore, setSelectedTrustScore] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const itemsPerPage = 5;

  // Filter options
  const filters = {
    location: selectedLocation,
    minRating: 0,
    maxPrice: '',
    specializations: selectedSpecializations,
    verifiedOnly: verifiedOnly
  };

  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    try {
      setLoading(true);
      // First fetch basic agency data
      const { data: agenciesData, error: agenciesError } = await supabase
        .from('agencies')
        .select(`
          id,
          name,
          slug,
          location,
          description,
          rating,
          trust_score,
          image_url,
          price,
          is_verified,
          agency_services (
            name
          ),
          agency_photos (
            id,
            url,
            caption,
            is_cover
          )
        `)
        .eq('status', 'approved')
        .order('trust_score', { ascending: false });

      if (agenciesError) throw agenciesError;

      // Process the data with photos included in the initial query
      const processedAgencies = agenciesData.map(agency => ({
        ...agency,
        specializations: agency.agency_services?.map((s: any) => s.name) || [],
        photos: agency.agency_photos || []
      }));

      setAgencies(processedAgencies);
    } catch (error) {
      console.error('Error loading agencies:', error);
      toast.error('Failed to load agencies. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAgencies = agencies.filter(agency => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        agency.name.toLowerCase().includes(query) ||
        agency.location.toLowerCase().includes(query) ||
        agency.description.toLowerCase().includes(query) ||
        agency.specializations.some(s => s.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Location filter
    if (filters.location && filters.location !== '') {
      if (!agency.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
    }

    // Rating filter
    if (filters.minRating > 0 && agency.rating < filters.minRating) {
      return false;
    }

    // Specializations filter
    if (filters.specializations && filters.specializations.length > 0) {
      const hasSpecialization = filters.specializations.some(s => 
        agency.specializations.includes(s)
      );
      if (!hasSpecialization) return false;
    }

    // Verified filter
    if (filters.verifiedOnly && !agency.is_verified) {
      return false;
    }

    // Trust score filter
    if (selectedTrustScore) {
      const minScore = parseInt(selectedTrustScore);
      if (agency.trust_score < minScore) {
        return false;
      }
    }

    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Sort agencies alphabetically, with numeric names at the end
  const sortedAgencies = [...filteredAgencies].sort((a, b) => {
    // For trust score sorting (default)
    return b.trust_score - a.trust_score;
  });
  
  const currentAgencies = sortedAgencies.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocation, selectedSpecializations, selectedTrustScore, verifiedOnly]);

  // Helper function to get the display image for an agency
  const getAgencyImage = (agency: Agency): string => {
    // First try to find the cover photo
    const coverPhoto = agency.photos?.find(photo => photo.is_cover);
    if (coverPhoto) return coverPhoto.url;

    // Then try the first photo
    if (agency.photos?.[0]) return agency.photos[0].url;

    // Finally fall back to the default image_url or a placeholder
    return agency.image_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80';
  };

  // Add this helper function before the return statement
  const getVisiblePageNumbers = (currentPage: number, totalPages: number) => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const handleSpecializationToggle = (specialization: string) => {
    if (selectedSpecializations.includes(specialization)) {
      setSelectedSpecializations(selectedSpecializations.filter(s => s !== specialization));
    } else {
      setSelectedSpecializations([...selectedSpecializations, specialization]);
    }
  };

  const renderStars = (score: number) => {
    const normalizedRating = Math.min(5, Math.max(0, Math.round(score / 20))); // Convert to 0-5 scale
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={`star-${i}`} 
            className={`h-5 w-5 text-yellow-400 ${i < normalizedRating ? 'fill-yellow-400' : ''}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultancy Directory</h1>
        <p className="text-lg text-gray-600 mb-8">
          Find verified overseas education consultants to guide your study abroad journey.
        </p>
        
        {/* Search and Filter Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Filters</h2>

              {/* Location Filter */}
              <div className="mb-6">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select 
                  id="location" 
                  className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All locations</option>
                  {Array.from(new Set(agencies.map(a => a.location)))
                    .sort()
                    .map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))
                  }
                </select>
              </div>
              
              {/* Specialization Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <div className="space-y-2">
                  {['USA', 'UK', 'Canada', 'Australia', 'Europe'].map(spec => (
                    <div key={spec} className="flex items-center">
                      <input 
                        id={`spec-${spec}`} 
                        type="checkbox" 
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        checked={selectedSpecializations.includes(spec)}
                        onChange={() => handleSpecializationToggle(spec)}
                      />
                      <label htmlFor={`spec-${spec}`} className="ml-2 block text-sm text-gray-700">{spec}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Trust Score Filter */}
              <div className="mb-6">
                <label htmlFor="trust-score" className="block text-sm font-medium text-gray-700 mb-1">Trust Score</label>
                <select 
                  id="trust-score" 
                  className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={selectedTrustScore}
                  onChange={(e) => setSelectedTrustScore(e.target.value)}
                >
                  <option value="">All scores</option>
                  <option value="90">90+</option>
                  <option value="80">80+</option>
                  <option value="70">70+</option>
                  <option value="60">60+</option>
                  <option value="50">50+</option>
                </select>
              </div>
              
              {/* Verified Only */}
              <div className="mb-6">
                <div className="flex items-center">
                  <input 
                    id="verified-only" 
                    type="checkbox" 
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={verifiedOnly}
                    onChange={() => setVerifiedOnly(!verifiedOnly)}
                  />
                  <label htmlFor="verified-only" className="ml-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Verified Only</span>
                    <Shield className="h-4 w-4 text-blue-600" />
                  </label>
                </div>
              </div>
              
              <button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg"
                onClick={() => setCurrentPage(1)}
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {/* Search Bar */}
            <div className="flex mb-6">
              <input
                type="text"
                placeholder="Search consultants by name, location, or specialization..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-primary focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
                <button 
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-r-lg"
                onClick={() => setCurrentPage(1)}
                >
                Search
                </button>
              </div>
            
            {/* Results Info and Sort */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">Showing {filteredAgencies.length} consultants</p>
            </div>
            
            {/* Agency Listings */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredAgencies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No consultants found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentAgencies.map((agency) => (
                  <div key={agency.id} className="bg-blue-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4">
                      <div className="md:col-span-1 p-6 flex items-center justify-center">
                        <div className="bg-white rounded-full p-4">
                          <img 
                            src={getAgencyImage(agency)} 
                            alt={agency.name}
                            className="h-28 w-28 object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-3 p-6">
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-gray-900">{agency.name}</h3>
                                {agency.is_verified && (
                                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                    <Shield className="h-3 w-3" />
                                    <span>Verified</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center text-gray-600 mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{agency.location}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center mb-1">
                                {renderStars(agency.trust_score)}
                                <span className="ml-2 text-gray-600">({Math.floor(Math.random() * 100) + 20} reviews)</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="my-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Trust Score:</p>
                            <div className="flex items-center">
                              <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${agency.trust_score}%` }}
                                ></div>
                              </div>
                              <span className="ml-3 text-sm font-medium">{agency.trust_score}/100</span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Specialization</p>
                            <div className="flex flex-wrap gap-2">
                              {agency.specializations.map((spec, idx) => (
                                <span 
                                  key={idx} 
                                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {agency.description}
                          </p>
                          
                          <div className="flex gap-4 mt-auto">
                            <Link
                              to={`/agency/${agency.slug}`}
                              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg"
                            >
                              View Profile
                            </Link>
                            <button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg">
                              Contact Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!loading && filteredAgencies.length > 0 && totalPages > 1 && (
              <div className="flex flex-col items-center space-y-4 mt-8">
                <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 max-w-full px-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  
                  {getVisiblePageNumbers(currentPage, totalPages).map((pageNumber, index) => (
                    <React.Fragment key={index}>
                      {pageNumber === '...' ? (
                        <span className="px-2 py-1 text-gray-500">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(Number(pageNumber))}
                          className={`min-w-[2rem] sm:min-w-[2.5rem] px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base ${
                            currentPage === pageNumber
                              ? 'bg-indigo-600 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )}
                    </React.Fragment>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                <div className="text-center text-sm text-gray-500 px-4">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(endIndex, filteredAgencies.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredAgencies.length}</span> consultants
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 