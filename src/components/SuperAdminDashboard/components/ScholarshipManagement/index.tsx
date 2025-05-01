import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Loader2, Pencil, Plus, Trash, Calendar } from 'lucide-react';

// Define Scholarship type based on the card in the image
interface Scholarship {
  id: string;
  name: string;
  amount: string;
  foundation: string;
  eligibility: string;
  deadline: string;
  chance: 'High Chance' | 'Medium Chance' | 'Low Chance';
  competition: 'High Competition' | 'Medium Competition' | 'Low Competition';
}

export function ScholarshipManagement() {
  // State management
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [formData, setFormData] = useState<Omit<Scholarship, 'id'>>({
    name: '',
    amount: '',
    foundation: '',
    eligibility: '',
    deadline: '',
    chance: 'Medium Chance',
    competition: 'Medium Competition'
  });

  // Load scholarships on component mount
  useEffect(() => {
    fetchScholarships();
  }, []);

  // Fetch scholarships from Supabase
  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScholarships(data || []);
    } catch (error: any) {
      alert('Error loading scholarships: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open dialog for creating new scholarship
  const openAddDialog = () => {
    setEditingScholarship(null);
    setFormData({
      name: '',
      amount: '',
      foundation: '',
      eligibility: '',
      deadline: '',
      chance: 'Medium Chance',
      competition: 'Medium Competition'
    });
    setShowDialog(true);
  };

  // Open dialog for editing existing scholarship
  const openEditDialog = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setFormData({
      name: scholarship.name,
      amount: scholarship.amount,
      foundation: scholarship.foundation,
      eligibility: scholarship.eligibility,
      deadline: scholarship.deadline,
      chance: scholarship.chance,
      competition: scholarship.competition
    });
    setShowDialog(true);
  };

  // Save scholarship (create or update)
  const saveScholarship = async () => {
    try {
      // Validate required fields
      const requiredFields = ['name', 'amount', 'foundation', 'eligibility', 'deadline'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          alert(`${field.replace('_', ' ')} is required`);
          return;
        }
      }

      if (editingScholarship) {
        // Update existing scholarship
        const { error } = await supabase
          .from('scholarships')
          .update(formData)
          .eq('id', editingScholarship.id);

        if (error) throw error;
        alert('Scholarship updated successfully');
      } else {
        // Create new scholarship
        const { error } = await supabase
          .from('scholarships')
          .insert(formData);

        if (error) throw error;
        alert('Scholarship added successfully');
      }

      setShowDialog(false);
      fetchScholarships();
    } catch (error: any) {
      alert('Error saving scholarship: ' + error.message);
    }
  };

  // Delete scholarship
  const deleteScholarship = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) return;

    try {
      const { error } = await supabase
        .from('scholarships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Scholarship deleted successfully');
      fetchScholarships();
    } catch (error: any) {
      alert('Error deleting scholarship: ' + error.message);
    }
  };

  // Function to get badge color class for chance
  const getChanceBadgeColor = (chance: string): string => {
    switch (chance) {
      case 'High Chance':
        return 'bg-green-100 text-green-800';
      case 'Medium Chance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low Chance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get text color for competition
  const getCompetitionColor = (competition: string): string => {
    switch (competition) {
      case 'High Competition':
        return 'text-red-600';
      case 'Medium Competition':
        return 'text-orange-600';
      case 'Low Competition':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scholarship Management</h2>
        <button onClick={openAddDialog} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <Plus size={16} /> Add New Scholarship
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : scholarships.length === 0 ? (
        <div className="text-center py-10 border rounded-md bg-slate-50">
          <p className="text-gray-500">No scholarships found. Add your first scholarship to get started.</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foundation</th>
                  <th scope="col" className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th scope="col" className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Eligibility</th>
                  <th scope="col" className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chance</th>
                  <th scope="col" className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competition</th>
                  <th scope="col" className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scholarships.map((scholarship) => (
                  <tr key={scholarship.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-900">{scholarship.name}</td>
                    <td className="px-3 sm:px-4 py-2 text-sm text-gray-500">{scholarship.foundation}</td>
                    <td className="px-3 sm:px-4 py-2 text-sm text-gray-500">{scholarship.amount}</td>
                    <td className="px-3 sm:px-4 py-2 text-sm text-gray-500">{scholarship.deadline}</td>
                    <td className="px-3 sm:px-4 py-2 text-sm text-gray-500 max-w-[150px] truncate hidden md:table-cell">{scholarship.eligibility}</td>
                    <td className="px-3 sm:px-4 py-2 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getChanceBadgeColor(scholarship.chance)}`}>
                        {scholarship.chance.replace(' Chance', '')}
                      </span>
                    </td>
                    <td className={`px-3 sm:px-4 py-2 text-sm ${getCompetitionColor(scholarship.competition)}`}>
                      {scholarship.competition.replace(' Competition', '')}
                    </td>
                    <td className="px-3 sm:px-4 py-2 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditDialog(scholarship)}
                          className="text-gray-500 hover:text-blue-600"
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteScholarship(scholarship.id)}
                          className="text-gray-500 hover:text-red-600"
                          aria-label="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Scholarship Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-sm w-4/5 p-4 text-sm shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-3 border-b pb-2">
              {editingScholarship ? 'Edit' : 'Add'} Scholarship
            </h3>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1.5">
                <label htmlFor="name" className="font-medium text-xs text-gray-700">Name*</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Scholarship name"
                  className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="foundation" className="font-medium text-xs text-gray-700">Organization*</label>
                <input
                  id="foundation"
                  name="foundation"
                  value={formData.foundation}
                  onChange={handleChange}
                  placeholder="Foundation name"
                  className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="amount" className="font-medium text-xs text-gray-700">Amount*</label>
                <input
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g., $10,000"
                  className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="deadline" className="font-medium text-xs text-gray-700">Deadline*</label>
                <div className="relative">
                  <input
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    placeholder="MM/DD/YYYY"
                    className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-8 transition-all"
                  />
                  <Calendar className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="eligibility" className="font-medium text-xs text-gray-700">Eligibility*</label>
                <textarea
                  id="eligibility"
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Eligibility requirements"
                  className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <label htmlFor="chance" className="font-medium text-xs text-gray-700">Chance</label>
                  <select
                    id="chance"
                    value={formData.chance}
                    onChange={(e) => handleSelectChange('chance', e.target.value)}
                    className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                  >
                    <option value="High Chance">High</option>
                    <option value="Medium Chance">Medium</option>
                    <option value="Low Chance">Low</option>
                  </select>
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="competition" className="font-medium text-xs text-gray-700">Competition</label>
                  <select
                    id="competition"
                    value={formData.competition}
                    onChange={(e) => handleSelectChange('competition', e.target.value)}
                    className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                  >
                    <option value="High Competition">High</option>
                    <option value="Medium Competition">Medium</option>
                    <option value="Low Competition">Low</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3 pt-2 border-t">
              <button 
                type="button" 
                onClick={() => setShowDialog(false)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={saveScholarship}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-medium transition-colors"
              >
                {editingScholarship ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 