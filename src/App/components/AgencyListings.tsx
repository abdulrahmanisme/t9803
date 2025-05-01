import React, { useState, useEffect } from 'react';
import { AgencyCard } from './AgencyCard';
import { FilterOptions } from './SearchSection';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface AgencyListingsProps {
  searchQuery: string;
  filters: FilterOptions;
  itemsPerPage?: number;
}

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
  specializations: string[];
  is_verified: boolean;
  photos?: Array<{
    id: string;
    url: string;
    caption: string;
    is_cover: boolean;
  }>;
}

export function AgencyListings({ searchQuery, filters, itemsPerPage = 12 }: AgencyListingsProps) {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    try {
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

    // Price filter
    if (filters.maxPrice && filters.maxPrice !== '') {
      const maxPrice = parseInt(filters.maxPrice);
      if (!isNaN(maxPrice) && agency.price > maxPrice) {
        return false;
      }
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

    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Sort agencies alphabetically, with numeric names at the end
  const sortedAgencies = [...filteredAgencies].sort((a, b) => {
    // Check if name starts with a number
    const aStartsWithNumber = /^\d/.test(a.name);
    const bStartsWithNumber = /^\d/.test(b.name);
    
    // If one starts with a number and the other doesn't, prioritize alphabetic names
    if (aStartsWithNumber && !bStartsWithNumber) return 1;
    if (!aStartsWithNumber && bStartsWithNumber) return -1;
    
    // Otherwise, sort alphabetically
    return a.name.localeCompare(b.name);
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
  }, [searchQuery, filters]);

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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {filteredAgencies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No consultants found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentAgencies.map((agency) => (
              <AgencyCard
                key={agency.id}
                name={agency.name}
                location={agency.location}
                description={agency.description}
                rating={agency.rating}
                imageUrl={getAgencyImage(agency)}
                trustScore={agency.trust_score}
                price={agency.price}
                specializations={agency.specializations}
                isVerified={agency.is_verified}
                slug={agency.slug}
              />
            ))}
          </div>

          {/* Only show pagination if itemsPerPage is not 3 */}
          {itemsPerPage !== 3 && (
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
        </>
      )}
    </div>
  );
}
