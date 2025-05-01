import React from 'react';
import { Upload } from 'lucide-react';

interface HeaderProps {
  filter: 'all' | 'pending' | 'approved' | 'rejected';
  onFilterChange: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void;
  onUploadClick: () => void;
}

export function Header({ filter, onFilterChange, onUploadClick }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
      <div className="flex gap-4">
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as typeof filter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Agencies</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Upload className="h-5 w-5" />
          Bulk Upload
        </button>
      </div>
    </div>
  );
}