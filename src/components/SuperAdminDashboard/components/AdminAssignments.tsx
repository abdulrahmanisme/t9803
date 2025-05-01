import React, { useState } from 'react';
import { User, Building2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface AdminAssignment {
  admin_id: string;
  agency_ids: string[];
  admin_email: string;
}

interface Agency {
  id: string;
  name: string;
  owner_id: string | null;
}

interface AdminAssignmentsProps {
  agencies: Agency[];
  admins: { id: string; email: string }[];
  onAssignmentChange: () => void;
}

export function AdminAssignments({ agencies, admins, onAssignmentChange }: AdminAssignmentsProps) {
  const [selectedAdmin, setSelectedAdmin] = useState<string>('');
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedAdmin || selectedAgencies.length === 0) {
      toast.error('Please select an admin and at least one agency');
      return;
    }

    setLoading(true);
    try {
      // Update agency ownership
      const { error } = await supabase
        .from('agencies')
        .update({ owner_id: selectedAdmin })
        .in('id', selectedAgencies);

      if (error) throw error;

      toast.success('Agencies assigned successfully');
      setSelectedAdmin('');
      setSelectedAgencies([]);
      onAssignmentChange();
    } catch (error) {
      console.error('Error assigning agencies:', error);
      toast.error('Failed to assign agencies');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllAgencies = () => {
    if (selectedAgencies.length === agencies.length) {
      setSelectedAgencies([]);
    } else {
      setSelectedAgencies(agencies.map(agency => agency.id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Assign Agencies to Admins</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Admin
          </label>
          <select
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Choose an admin...</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Agencies
            </label>
            <button
              type="button"
              onClick={handleSelectAllAgencies}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {selectedAgencies.length === agencies.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
            {agencies.map((agency) => (
              <label
                key={agency.id}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedAgencies.includes(agency.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAgencies([...selectedAgencies, agency.id]);
                    } else {
                      setSelectedAgencies(selectedAgencies.filter(id => id !== agency.id));
                    }
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500 mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">{agency.name}</div>
                  <div className="text-sm text-gray-500">
                    {agency.owner_id ? 'Assigned' : 'Unassigned'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleAssign}
          disabled={loading || !selectedAdmin || selectedAgencies.length === 0}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Assigning...
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Assign Agencies
            </>
          )}
        </button>
      </div>
    </div>
  );
}