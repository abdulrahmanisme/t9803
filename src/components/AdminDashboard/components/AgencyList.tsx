import React, { useState, useEffect } from 'react';
import { Agency } from '../types';
import { VerificationStatus } from './VerificationStatus';
import { Search } from 'lucide-react';

interface AgencyListProps {
  agencies: Agency[];
  selectedAgency: Agency | null;
  onSelectAgency: (agency: Agency) => void;
}

export function AgencyList({ agencies, selectedAgency, onSelectAgency }: AgencyListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAgencies, setFilteredAgencies] = useState(agencies);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Sort agencies alphabetically with numeric names at the end
      const sortedAgencies = [...agencies].sort((a, b) => {
        // Check if name starts with a number
        const aStartsWithNumber = /^\d/.test(a.name);
        const bStartsWithNumber = /^\d/.test(b.name);
        
        // If one starts with a number and the other doesn't, prioritize alphabetic names
        if (aStartsWithNumber && !bStartsWithNumber) return 1;
        if (!aStartsWithNumber && bStartsWithNumber) return -1;
        
        // Otherwise, sort alphabetically
        return a.name.localeCompare(b.name);
      });
      
      setFilteredAgencies(sortedAgencies);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = agencies.filter(agency => 
      agency.name.toLowerCase().includes(query) ||
      agency.location.toLowerCase().includes(query)
    );
    
    // Sort the filtered results as well
    const sortedFiltered = [...filtered].sort((a, b) => {
      // Check if name starts with a number
      const aStartsWithNumber = /^\d/.test(a.name);
      const bStartsWithNumber = /^\d/.test(b.name);
      
      // If one starts with a number and the other doesn't, prioritize alphabetic names
      if (aStartsWithNumber && !bStartsWithNumber) return 1;
      if (!aStartsWithNumber && bStartsWithNumber) return -1;
      
      // Otherwise, sort alphabetically
      return a.name.localeCompare(b.name);
    });
    
    setFilteredAgencies(sortedFiltered);
  }, [searchQuery, agencies]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="font-semibold text-gray-900 mb-4">Your Agencies</h2>
      
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search agencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredAgencies.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No agencies found</p>
        ) : (
          filteredAgencies.map((agency) => (
            <div key={agency.id} className="space-y-2">
              <button
                onClick={() => onSelectAgency(agency)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedAgency?.id === agency.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                {agency.name}
              </button>
              <div className="mt-2 px-4">
                <VerificationStatus agency={agency} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}