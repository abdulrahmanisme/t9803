import React, { useState, useMemo, useEffect } from 'react';
import { Plus, FileText, Clock, CheckCircle, AlertTriangle, X, Trash2, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { ApplicationData, getApplications, addApplication, updateApplication, deleteApplication } from '../../lib/applicationTracker';
import toast from 'react-hot-toast';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (application: Omit<ApplicationData, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
  editingApplication: ApplicationData | null;
}

const AddApplicationModal: React.FC<AddApplicationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  editingApplication 
}) => {
  const [university, setUniversity] = useState(editingApplication?.university || '');
  const [program, setProgram] = useState(editingApplication?.program || '');
  const [country, setCountry] = useState(editingApplication?.country || '');
  const [intake, setIntake] = useState(editingApplication?.intake || '');
  const [deadline, setDeadline] = useState(editingApplication?.deadline || '');
  const [status, setStatus] = useState<ApplicationData['status']>(
    editingApplication?.status || 'Preparing Documents'
  );

  // Reset form when modal closes or editing application changes
  React.useEffect(() => {
    if (isOpen && editingApplication) {
      setUniversity(editingApplication.university);
      setProgram(editingApplication.program);
      setCountry(editingApplication.country);
      setIntake(editingApplication.intake);
      setDeadline(editingApplication.deadline);
      setStatus(editingApplication.status);
    } else if (isOpen && !editingApplication) {
      // Reset form for new application
      setUniversity('');
      setProgram('');
      setCountry('');
      setIntake('');
      setDeadline('');
      setStatus('Preparing Documents');
    }
  }, [isOpen, editingApplication]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      university,
      program,
      country,
      intake,
      deadline,
      status
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {editingApplication ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button 
            className="text-gray-400 hover:text-gray-500 focus:outline-none" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Program</label>
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Intake</label>
              <input
                type="text"
                value={intake}
                onChange={(e) => setIntake(e.target.value)}
                placeholder="e.g. Fall 2024"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. Dec 15, 2023"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationData['status'])}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              >
                <option value="Preparing Documents">Preparing Documents</option>
                <option value="Under Review">Under Review</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none"
            >
              {editingApplication ? 'Update Application' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  applicationName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicationName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
          <button 
            className="text-gray-400 hover:text-gray-500 focus:outline-none" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600">
            Are you sure you want to delete your application to <span className="font-semibold">{applicationName}</span>? This action cannot be undone.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export function TrackPage() {
  console.log("TrackPage component is rendering!");

  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load applications from database or localStorage
  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        const fetchedApplications = await getApplications();
        setApplications(fetchedApplications);
        setError(null);
      } catch (err) {
        console.error('Error loading applications:', err);
        setError('Failed to load your applications. Please try again.');
        // Fallback to localStorage
        const localApps = localStorage.getItem('applications');
        if (localApps) {
          try {
            setApplications(JSON.parse(localApps));
          } catch (parseError) {
            console.error('Error parsing local applications:', parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<ApplicationData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('deadline');
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<ApplicationData | null>(null);

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.university.toLowerCase().includes(query) ||
        app.program.toLowerCase().includes(query) ||
        app.country.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Sort applications
    switch (sortBy) {
      case 'university':
        filtered.sort((a, b) => a.university.localeCompare(b.university));
        break;
      case 'deadline':
        filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'status':
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'country':
        filtered.sort((a, b) => a.country.localeCompare(b.country));
        break;
      default:
        break;
    }

    return filtered;
  }, [applications, searchQuery, statusFilter, sortBy]);

  // Calculate summary statistics
  const totalApplications = applications.length;
  const inProgressApplications = applications.filter(
    app => app.status === 'Under Review' || app.status === 'Preparing Documents'
  ).length;
  const acceptedApplications = applications.filter(
    app => app.status === 'Accepted'
  ).length;
  
  // Calculate upcoming deadlines (within next 30 days)
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const upcomingDeadlines = applications.filter(app => {
    const deadlineDate = new Date(app.deadline);
    return deadlineDate >= today && deadlineDate <= thirtyDaysFromNow;
  }).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Under Review':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Under Review
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      case 'Preparing Documents':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Preparing Documents
          </span>
        );
      default:
        return null;
    }
  };

  const handleOpenAddModal = () => {
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (application: ApplicationData) => {
    setEditingApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApplication(null);
  };

  const handleSaveApplication = async (applicationData: Omit<ApplicationData, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      if (editingApplication) {
        // Update existing application
        const updatedApp = await updateApplication(editingApplication.id as number, applicationData);
        if (updatedApp) {
          setApplications(applications.map(app => 
            app.id === editingApplication.id ? updatedApp : app
          ));
          toast.success('Application updated successfully!');
        }
      } else {
        // Add new application
        const newApp = await addApplication(applicationData);
        if (newApp) {
          setApplications([newApp, ...applications]);
          toast.success('Application added successfully!');
        }
      }
    } catch (error) {
      console.error('Error saving application:', error);
      toast.error('Failed to save application. Please try again.');
    }
  };

  const handleOpenDeleteModal = (application: ApplicationData) => {
    setApplicationToDelete(application);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setApplicationToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (applicationToDelete) {
      try {
        const deleted = await deleteApplication(applicationToDelete.id as number);
        if (deleted) {
          setApplications(applications.filter(app => app.id !== applicationToDelete.id));
          toast.success('Application deleted successfully!');
        }
        handleCloseDeleteModal();
      } catch (error) {
        console.error('Error deleting application:', error);
        toast.error('Failed to delete application. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Application Tracker</h1>
          <p className="text-lg text-gray-600">
            Keep track of all your university applications in one place.
          </p>
        </div>
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none"
          onClick={handleOpenAddModal}
        >
          <Plus className="h-5 w-5 mr-1" />
          Add Application
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Applications */}
        <div className="border rounded-lg p-6 bg-white shadow-sm flex justify-between items-center">
          <div>
            <p className="text-lg font-medium text-gray-500">Total Applications</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{totalApplications}</p>
            <p className="text-sm text-gray-500">Across all intakes</p>
          </div>
          <div className="h-12 w-12 text-blue-600">
            <FileText className="h-full w-full" />
          </div>
        </div>

        {/* In Progress */}
        <div className="border rounded-lg p-6 bg-white shadow-sm flex justify-between items-center">
          <div>
            <p className="text-lg font-medium text-gray-500">In Progress</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{inProgressApplications}</p>
            <p className="text-sm text-gray-500">Awaiting decision</p>
          </div>
          <div className="h-12 w-12 text-amber-500">
            <Clock className="h-full w-full" />
          </div>
        </div>

        {/* Accepted */}
        <div className="border rounded-lg p-6 bg-white shadow-sm flex justify-between items-center">
          <div>
            <p className="text-lg font-medium text-gray-500">Accepted</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{acceptedApplications}</p>
            <p className="text-sm text-gray-500">Offers received</p>
          </div>
          <div className="h-12 w-12 text-green-600">
            <CheckCircle className="h-full w-full" />
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="border rounded-lg p-6 bg-white shadow-sm flex justify-between items-center">
          <div>
            <p className="text-lg font-medium text-gray-500">Upcoming Deadlines</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{upcomingDeadlines}</p>
            <p className="text-sm text-gray-500">Within next 30 days</p>
          </div>
          <div className="h-12 w-12 text-red-600">
            <AlertTriangle className="h-full w-full" />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search university, program, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 border rounded-md shadow-sm mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="Preparing Documents">Preparing Documents</option>
                <option value="Under Review">Under Review</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="deadline">Deadline (earliest first)</option>
                <option value="university">University (A-Z)</option>
                <option value="status">Status</option>
                <option value="country">Country (A-Z)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Applications Table */}
      <div className="border rounded-lg overflow-hidden mb-8 bg-white">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Your Applications</h2>
          <span className="text-sm text-gray-500">{filteredApplications.length} applications</span>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-16">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="ml-2 text-gray-600">Loading your applications...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none"
            >
              Refresh Page
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredApplications.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      University
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Intake
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{application.university}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.program}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.country}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.intake}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.deadline}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-4">
                          <button 
                            className="text-primary hover:text-primary/80 font-medium focus:outline-none"
                            onClick={() => handleOpenEditModal(application)}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 font-medium focus:outline-none flex items-center"
                            onClick={() => handleOpenDeleteModal(application)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No applications found matching your filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Application Modal */}
      <AddApplicationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveApplication}
        editingApplication={editingApplication}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        applicationName={applicationToDelete?.university || ''}
      />
    </div>
  );
} 