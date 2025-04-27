import React, { useState } from 'react';
import { AgencyListings } from '../components/AgencyListings';
import { FilterOptions } from '../components/SearchSection';
import { Shield, Search, Filter, ChevronDown } from 'lucide-react';

export default function ConsultanciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    location: '',
    minRating: 0,
    maxPrice: '',
    specializations: [],
    verifiedOnly: false
  });

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching with filters:', filters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Find Consultancies</h2>
        </div>
        
        {/* Search Bar and Filter Button */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Type and search for consultancies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Dropdown */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select 
                  id="location" 
                  className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                >
                  <option value="">All Locations</option>
                  <option value="Ameerpet">Ameerpet</option>
                  <option value="Banjara Hills">Banjara Hills</option>
                  <option value="Begumpet">Begumpet</option>
                  <option value="Charminar">Charminar</option>
                  <option value="Gachibowli">Gachibowli</option>
                  <option value="Himayatnagar">Himayatnagar</option>
                  <option value="Jubilee Hills">Jubilee Hills</option>
                  <option value="Kukatpally">Kukatpally</option>
                  <option value="Madhapur">Madhapur</option>
                  <option value="Malakpet">Malakpet</option>
                  <option value="Masab Tank">Masab Tank</option>
                  <option value="Mehdipatnam">Mehdipatnam</option>
                  <option value="Narayanguda">Narayanguda</option>
                  <option value="Panjagutta">Panjagutta</option>
                  <option value="Secunderabad">Secunderabad</option>
                  <option value="Somajiguda">Somajiguda</option>
                  <option value="Tolichowki">Tolichowki</option>
                  <option value="Uppal">Uppal</option>
                </select>
              </div>
              <div>
                <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
                <select 
                  id="minRating" 
                  className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={filters.minRating}
                  onChange={(e) => setFilters({...filters, minRating: Number(e.target.value)})}
                >
                  <option value="0">No Rating</option>
                  <option value="1">1+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 border border-transparent rounded-md shadow-sm focus:outline-none"
                  onClick={handleSearch}
                >
                  Search Consultancies
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <div 
                    className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${filters.verifiedOnly ? 'bg-primary' : 'bg-gray-300'}`}
                    onClick={() => setFilters({...filters, verifiedOnly: !filters.verifiedOnly})}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${filters.verifiedOnly ? 'translate-x-4' : ''}`}></div>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    Verified Consultants Only
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Show only consultants that have been verified by our team</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AgencyListings
        searchQuery={searchQuery}
        filters={filters}
      />
    </div>
  );
} 