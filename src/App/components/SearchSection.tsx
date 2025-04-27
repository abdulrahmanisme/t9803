import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  X,
  Filter,
  MapPin,
  Star,
  DollarSign,
  Shield,
  Check,
  GraduationCap,
  Globe,
  Hash,
} from 'lucide-react';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  filters: FilterOptions;
}

interface SearchSuggestion {
  type: string;
  value: string;
  icon: React.ReactNode;
}

export interface FilterOptions {
  location: string;
  minRating: number;
  maxPrice: string;
  specializations: string[];
  verifiedOnly: boolean;
}

export function SearchSection({
  onSearch,
  onFilterChange,
  searchInputRef,
  filters,
}: SearchSectionProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    SearchSuggestion[]
  >([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const searchInputRefLocal = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(e.target as Node)
    ) {
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Define searchable items
  const searchSuggestions: SearchSuggestion[] = [
    // Countries
    {
      type: 'country',
      value: 'United States',
      icon: <Globe className="h-4 w-4" />,
    },
    {
      type: 'country',
      value: 'United Kingdom',
      icon: <Globe className="h-4 w-4" />,
    },
    { type: 'country', value: 'Canada', icon: <Globe className="h-4 w-4" /> },
    {
      type: 'country',
      value: 'Australia',
      icon: <Globe className="h-4 w-4" />,
    },
    { type: 'country', value: 'Germany', icon: <Globe className="h-4 w-4" /> },
    { type: 'country', value: 'France', icon: <Globe className="h-4 w-4" /> },
    { type: 'country', value: 'Japan', icon: <Globe className="h-4 w-4" /> },
    { type: 'country', value: 'India', icon: <Globe className="h-4 w-4" /> },

    // Locations
    {
      type: 'location',
      value: 'New York, USA',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'London, UK',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Toronto, Canada',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Sydney, Australia',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Berlin, Germany',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Paris, France',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Tokyo, Japan',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Bangalore, India',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Hyderabad, India',
      icon: <MapPin className="h-4 w-4" />,
    },
    // Hyderabad Areas
    {
      type: 'location',
      value: 'Malakpet',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Mehdipatnam',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Tolichowki',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Banjara Hills',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Jubilee Hills',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'HITEC City',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Gachibowli',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Secunderabad',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Kukatpally',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Ameerpet',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Dilsukhnagar',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Begumpet',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Madhapur',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Kondapur',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Santosh Nagar',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Masab Tank',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Uppal',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'LB Nagar',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Miyapur',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Manikonda',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      type: 'location',
      value: 'Attapur',
      icon: <MapPin className="h-4 w-4" />,
    },

    // Courses
    {
      type: 'course',
      value: 'Computer Science',
      icon: <Hash className="h-4 w-4" />,
    },
    {
      type: 'course',
      value: 'Machine Learning',
      icon: <Hash className="h-4 w-4" />,
    },
    {
      type: 'course',
      value: 'Medical',
      icon: <Hash className="h-4 w-4" />,
    },
    {
      type: 'course',
      value: 'Business Administration',
      icon: <Hash className="h-4 w-4" />,
    },
    {
      type: 'course',
      value: 'Engineering',
      icon: <Hash className="h-4 w-4" />,
    },
    { type: 'course', value: 'Medicine', icon: <Hash className="h-4 w-4" /> },
    { type: 'course', value: 'Law', icon: <Hash className="h-4 w-4" /> },
    { type: 'course', value: 'Psychology', icon: <Hash className="h-4 w-4" /> },
    {
      type: 'course',
      value: 'Data Science',
      icon: <Hash className="h-4 w-4" />,
    },

    // Specializations
    {
      type: 'specialization',
      value: 'Ivy League Admissions',
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      type: 'specialization',
      value: 'Medical School Admissions',
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      type: 'specialization',
      value: 'Law School Admissions',
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      type: 'specialization',
      value: 'MBA Admissions',
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      type: 'specialization',
      value: 'Undergraduate Admissions',
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      type: 'specialization',
      value: 'Graduate Program Admissions',
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      type: 'specialization',
      value: 'International Student Admissions',
      icon: <GraduationCap className="h-4 w-4" />,
    },
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = searchSuggestions.filter(
        (suggestion) =>
          suggestion.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (suggestion.type === 'location' &&
            suggestion.value
              .split(',')[0]
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const groupedSuggestions = filteredSuggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(searchQuery.trim());
    if (showFilters) {
      setShowFilters(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.value);
    onSearch(suggestion.value);
    setShowSuggestions(false);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    onFilterChange(updatedFilters);
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e as any);
    }
  };

  const getSuggestionIconBackground = (type: string) => {
    switch (type) {
      case 'country':
        return 'bg-blue-100';
      case 'location':
        return 'bg-red-100';
      case 'course':
        return 'bg-green-100';
      case 'specialization':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 py-10 px-6 md:py-16 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 whitespace-nowrap">
            Admissions.app: Your Trusted Study Abroad Platform
          </h1>
          <p className="text-blue-100/90 text-base md:text-lg mb-8 leading-relaxed max-w-3xl">
            Welcome to Hyderabad's premier study abroad platform, connecting ambitious students with top-rated overseas education consultants. Our network of 250+ verified international education advisors specializes in USA university admissions, UK university applications, Canada study visas, and Australian education pathways. Expert guidance available for engineering, MBA, medical, and other courses worldwide. Get personalized assistance with university selection, visa processing, scholarship applications, and admission essay editing. From HITEC City to Banjara Hills, find local study abroad consultants who understand your goals. Start your international education journey today with Admissions.app - your gateway to academic success abroad!
          </p>

          <div className="relative">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={searchInputRef || searchInputRefLocal}
                  type="text"
                  placeholder="Search by country, course, or specialization..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                    onSearch(e.target.value);
                  }}
                  className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 border-0 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 shadow-lg"
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!suggestionsRef.current?.contains(document.activeElement)) {
                        setShowSuggestions(false);
                      }
                    }, 200);
                  }}
                  onKeyDown={handleKeyDown}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                      onSearch('');
                    }}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-200 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleSearchSubmit}
                className="md:w-auto px-6 py-4 bg-white rounded-xl text-blue-800 font-medium hover:bg-blue-50 transition-colors shadow-lg"
              >
                Search
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:w-auto px-6 py-4 rounded-xl font-medium transition-colors shadow-lg flex items-center justify-center gap-2 border-2 border-white/30 hover:bg-white/10 text-white"
              >
                {showFilters ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Filter className="h-5 w-5" />
                )}
                {showFilters ? 'Close' : 'Filter'}
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions &&
              searchQuery &&
              filteredSuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-blue-100 overflow-hidden z-10"
                >
                  <div className="p-2">
                    <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suggestions
                    </h3>
                    <div className="divide-y divide-gray-100">
                      {filteredSuggestions.map((suggestion, index) => (
                        <button
                          key={`${suggestion.type}-${suggestion.value}`}
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-blue-50 ${
                            index === activeSuggestionIndex ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          onMouseEnter={() => setActiveSuggestionIndex(index)}
                        >
                          <div
                            className={`p-2 rounded-lg ${getSuggestionIconBackground(
                              suggestion.type
                            )}`}
                          >
                            {suggestion.icon}
                          </div>
                          <div>
                            <span className="block font-medium text-gray-900">
                              {suggestion.value}
                            </span>
                            <span className="block text-xs text-gray-500 capitalize">
                              {suggestion.type}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </div>

          {showFilters && (
            <div className="mt-6 bg-white rounded-xl p-0 shadow-xl border border-blue-50 overflow-hidden transition-all duration-300 transform">
              {/* Filter Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Filter Options</h3>
                  <button
                    onClick={() => {
                      const resetFilters = {
                        location: '',
                        minRating: 0,
                        maxPrice: '',
                        verifiedOnly: false,
                        specializations: [],
                      };

                      onFilterChange(resetFilters);
                    }}
                    className="px-4 py-1 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-full transition-colors"
                  >
                    Reset All
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-1">
                  Refine your consultant search
                </p>
              </div>

              {/* Filter Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Location Filter */}
                    <div className="bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow transition-shadow duration-300">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <div className="bg-red-100 p-2 rounded-lg">
                            <MapPin className="h-4 w-4 text-red-500" />
                          </div>
                          Location
                        </span>
                        <input
                          type="text"
                          value={filters.location}
                          onChange={(e) =>
                            handleFilterChange({ location: e.target.value })
                          }
                          className="mt-2 block w-full pl-3 pr-10 py-3 text-base border-0 bg-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </label>
                    </div>

                    {/* Rating Filter */}
                    <div className="bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow transition-shadow duration-300">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <div className="bg-yellow-100 p-2 rounded-lg">
                            <Star className="h-4 w-4 text-yellow-500" />
                          </div>
                          Minimum Rating
                        </span>
                        <div className="mt-2 flex items-center space-x-2">
                          {[0, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() =>
                                handleFilterChange({ minRating: rating })
                              }
                              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                                filters.minRating === rating
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'
                              }`}
                            >
                              {rating === 0 ? 'Any' : `${rating}+`}
                            </button>
                          ))}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Price Range Filter */}
                    <div className="bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow transition-shadow duration-300">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <DollarSign className="h-4 w-4 text-green-500" />
                          </div>
                          Price Range
                        </span>
                        <input
                          type="text"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            handleFilterChange({ maxPrice: e.target.value })
                          }
                          className="mt-2 block w-full pl-3 pr-10 py-3 text-base border-0 bg-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </label>
                    </div>

                    {/* Verified Only Filter */}
                    <div className="bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow transition-shadow duration-300">
                      <label className="flex cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className="pt-0.5">
                            <div
                              className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${
                                filters.verifiedOnly
                                  ? 'bg-blue-600'
                                  : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                                  filters.verifiedOnly ? 'translate-x-4' : ''
                                }`}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <Shield className="h-4 w-4 text-blue-600" />
                              </div>
                              Verified Consultants Only
                            </span>
                            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors">
                              Show only consultants that have been verified by
                              our team
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={filters.verifiedOnly}
                          onChange={(e) =>
                            handleFilterChange({
                              verifiedOnly: e.target.checked,
                            })
                          }
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-800 hover:to-blue-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <Check className="h-5 w-5" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
