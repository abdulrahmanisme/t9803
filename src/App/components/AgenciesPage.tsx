import React, { useState } from 'react';
import { AgencyListings } from './AgencyListings';
import { SearchSection } from './SearchSection';
import { FilterOptions } from './SearchSection';

export function AgenciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  console.log('AgenciesPage rendered', { searchQuery, filters });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Education Consultancies</h1>
          <p className="mt-1 text-sm text-gray-500">
            Find and compare education consultancies to help you with your study abroad journey
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchSection 
          onSearch={(query) => {
            console.log('Search query changed:', query);
            setSearchQuery(query);
          }}
          onFilterChange={(newFilters) => {
            console.log('Filters changed:', newFilters);
            setFilters(newFilters);
          }}
        />
      </div>

      {/* Agency Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AgencyListings 
          searchQuery={searchQuery}
          filters={filters}
        />
      </div>
    </div>
  );
} 