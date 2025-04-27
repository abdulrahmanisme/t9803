import React, { useState } from 'react';
import { Trash2, AlertTriangle, Shield } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface Admin {
  id: string;
  email: string;
  created_at: string;
  agencies_count: number;
}

interface AdminManagementProps {
  admins: Admin[];
  onAdminDeleted: () => void;
}

export function AdminManagement({ admins, onAdminDeleted }: AdminManagementProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteAdmin = async (adminId: string) => {
    setLoading(true);
    try {
      // First, reassign agencies to null
      const { error: agencyError } = await supabase
        .from('agencies')
        .update({ owner_id: null })
        .eq('owner_id', adminId);

      if (agencyError) throw agencyError;

      // Then delete the admin account using the stored procedure
      const { error: deleteError } = await supabase.rpc('delete_admin_account', {
        admin_user_id: adminId,
        reason: 'Deleted by super admin'
      });

      if (deleteError) throw deleteError;

      toast.success('Admin account deleted successfully');
      onAdminDeleted();
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error('Failed to delete admin account');
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Manage Admins</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agencies
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-indigo-600 mr-3" />
                    <div className="text-sm font-medium text-gray-900">
                      {admin.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(admin.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                    {admin.agencies_count} agencies
                  </span>
                </td>
                <td className="px-6 py-4">
                  {deleteConfirm === admin.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        disabled={loading}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(admin.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Admin"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <div className="p-4 bg-red-50 border-t">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Warning</h4>
              <p className="mt-1 text-sm text-red-700">
                This action will permanently delete the admin account and unassign all their agencies.
                This cannot be undone.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}