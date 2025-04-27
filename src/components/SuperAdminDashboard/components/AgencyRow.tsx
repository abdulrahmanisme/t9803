import React, { useState } from 'react';
import { Building2, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Agency } from '../types';

interface AgencyRowProps {
  agency: Agency;
  onStatusChange: (agencyId: string, status: 'approved' | 'rejected') => Promise<void>;
  onVerificationChange: (agencyId: string, is_verified: boolean) => Promise<void>;
  onTrustScoreChange: (agencyId: string, trust_score: number) => Promise<void>;
  onDelete: (agencyId: string) => Promise<void>;
}

export function AgencyRow({
  agency,
  onStatusChange,
  onVerificationChange,
  onTrustScoreChange,
  onDelete
}: AgencyRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${agency.name}? This action cannot be undone.`)) {
      await onDelete(agency.id);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 sm:px-6 py-4">
        <div className="flex items-center">
          <Building2 width="24" height="24" className="text-gray-400 mr-3 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">{agency.name}</div>
            <div className="text-sm text-gray-500 truncate">{agency.location}</div>
          </div>
        </div>
      </td>
      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-500">
        {agency.owner?.email || 'No owner'}
      </td>
      <td className="px-4 sm:px-6 py-4">
        <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
          agency.status === 'approved' ? 'bg-green-100 text-green-800' :
          agency.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {agency.status === 'approved' && <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
          {agency.status === 'rejected' && <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
          {agency.status === 'pending' && <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
          <span className="hidden sm:inline">{agency.status}</span>
        </span>
      </td>
      <td className="hidden sm:table-cell px-4 sm:px-6 py-4">
        <button
          onClick={() => onVerificationChange(agency.id, !agency.is_verified)}
          className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
            agency.is_verified 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          }`}
        >
          {agency.is_verified ? (
            <>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Verified
            </>
          ) : (
            <>
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Unverified
            </>
          )}
        </button>
      </td>
      <td className="hidden sm:table-cell px-4 sm:px-6 py-4">
        <input
          type="number"
          min="0"
          max="100"
          value={agency.trust_score}
          onChange={(e) => onTrustScoreChange(agency.id, Number(e.target.value))}
          className="w-16 sm:w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </td>
      <td className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-1 sm:gap-2">
          {agency.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange(agency.id, 'approved')}
                className="p-1 text-green-600 hover:text-green-800"
                title="Approve"
              >
                <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => onStatusChange(agency.id, 'rejected')}
                className="p-1 text-red-600 hover:text-red-800"
                title="Reject"
              >
                <ThumbsDown className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="p-1 text-red-600 hover:text-red-800 ml-1 sm:ml-2"
            title="Delete Agency"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}