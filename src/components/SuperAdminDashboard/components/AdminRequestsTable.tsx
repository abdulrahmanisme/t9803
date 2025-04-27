import React from 'react';
import { ThumbsUp, ThumbsDown, Building2 } from 'lucide-react';

interface AdminRequest {
  id: string;
  email: string;
  agency_name: string;
  agency_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface AdminRequestsTableProps {
  requests: AdminRequest[];
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

export function AdminRequestsTable({ requests, onApprove, onReject }: AdminRequestsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Admin Account Requests</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Custom URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="text-sm font-medium text-gray-900">
                      {request.agency_name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {request.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {request.agency_url}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {request.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onApprove(request.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Approve"
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onReject(request.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Reject"
                      >
                        <ThumbsDown className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}