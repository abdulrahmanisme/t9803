import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, MoveUpIcon, MoveDownIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getBlogTabs, 
  createBlogTab, 
  updateBlogTab, 
  deleteBlogTab 
} from '../../../lib/api';

interface BlogTab {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
}

export function TabsManagement() {
  const [tabs, setTabs] = useState<BlogTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState<Partial<BlogTab> | null>(null);

  useEffect(() => {
    loadTabs();
  }, []);

  const loadTabs = async () => {
    try {
      setLoading(true);
      const tabsData = await getBlogTabs();
      setTabs(tabsData);
    } catch (error) {
      console.error('Error loading tabs:', error);
      toast.error('Failed to load tabs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTab = () => {
    setCurrentTab({ name: '', slug: '', description: '', display_order: tabs.length + 1 });
    setShowModal(true);
  };

  const handleEditTab = (tab: BlogTab) => {
    setCurrentTab(tab);
    setShowModal(true);
  };

  const handleDeleteTab = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tab? This will unassign all posts from this tab.')) {
      return;
    }

    try {
      await deleteBlogTab(id);
      toast.success('Tab deleted successfully');
      loadTabs();
    } catch (error) {
      console.error('Error deleting tab:', error);
      toast.error('Failed to delete tab');
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '')    // Remove non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple dashes with single dash
      .replace(/^-+/, '')          // Trim dashes from start
      .replace(/-+$/, '');         // Trim dashes from end
  };

  const handleNameChange = (value: string) => {
    if (currentTab) {
      setCurrentTab({
        ...currentTab,
        name: value,
        slug: generateSlug(value)
      });
    }
  };

  const handleMoveUp = async (tabIndex: number) => {
    if (tabIndex <= 0) return;
    
    try {
      const newOrder = [...tabs];
      const tab1 = { ...newOrder[tabIndex], display_order: newOrder[tabIndex - 1].display_order };
      const tab2 = { ...newOrder[tabIndex - 1], display_order: newOrder[tabIndex].display_order };
      
      await updateBlogTab(tab1.id, { display_order: tab1.display_order });
      await updateBlogTab(tab2.id, { display_order: tab2.display_order });
      
      toast.success('Tab order updated');
      loadTabs();
    } catch (error) {
      console.error('Error updating tab order:', error);
      toast.error('Failed to update tab order');
    }
  };

  const handleMoveDown = async (tabIndex: number) => {
    if (tabIndex >= tabs.length - 1) return;
    
    try {
      const newOrder = [...tabs];
      const tab1 = { ...newOrder[tabIndex], display_order: newOrder[tabIndex + 1].display_order };
      const tab2 = { ...newOrder[tabIndex + 1], display_order: newOrder[tabIndex].display_order };
      
      await updateBlogTab(tab1.id, { display_order: tab1.display_order });
      await updateBlogTab(tab2.id, { display_order: tab2.display_order });
      
      toast.success('Tab order updated');
      loadTabs();
    } catch (error) {
      console.error('Error updating tab order:', error);
      toast.error('Failed to update tab order');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTab || !currentTab.name) return;

    try {
      const isEditing = !!currentTab.id;
      
      const tabData = {
        name: currentTab.name,
        slug: currentTab.slug || generateSlug(currentTab.name),
        description: currentTab.description || '',
        display_order: currentTab.display_order || tabs.length + 1
      };

      if (isEditing) {
        await updateBlogTab(currentTab.id as string, tabData);
        toast.success('Tab updated successfully');
      } else {
        await createBlogTab(tabData);
        toast.success('Tab created successfully');
      }

      setShowModal(false);
      loadTabs();
    } catch (error) {
      console.error('Error saving tab:', error);
      toast.error('Failed to save tab');
    }
  };

  const switchToBlogManagement = () => {
    // Direct DOM manipulation as a more reliable alternative to custom events
    const tabButton = document.querySelector('button[data-tab-id="blogs"]');
    if (tabButton) {
      (tabButton as HTMLButtonElement).click();
    } else {
      toast.error("Couldn't find the Blog Management navigation. Please use the sidebar to navigate.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Tabs Management</h1>
        <button 
          onClick={handleAddTab}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <PlusIcon size={16} />
          Add New Tab
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">About Blog Tabs</h3>
        <p className="text-blue-700">
          Blog tabs help organize your blog posts into categories. When you create tabs here, you can assign blog posts to these tabs in the Blog Management section.
          Tabs will appear in the Knowledge Hub page, allowing users to filter blog posts by category.
          <button 
            className="text-primary underline ml-1"
            onClick={switchToBlogManagement}
          >
            Go to Blog Management
          </button>
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Order</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Slug</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tabs.map((tab, index) => (
                <tr key={tab.id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{tab.display_order}</td>
                  <td className="py-3 px-4">{tab.name}</td>
                  <td className="py-3 px-4">{tab.slug}</td>
                  <td className="py-3 px-4">{tab.description}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleEditTab(tab)}
                      className="p-1 bg-blue-100 text-blue-600 rounded"
                      title="Edit tab"
                    >
                      <PencilIcon size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveUp(index)}
                      className="p-1 bg-gray-100 text-gray-600 rounded"
                      disabled={index === 0}
                      title="Move up"
                    >
                      <MoveUpIcon size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      className="p-1 bg-gray-100 text-gray-600 rounded"
                      disabled={index === tabs.length - 1}
                      title="Move down"
                    >
                      <MoveDownIcon size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTab(tab.id)}
                      className="p-1 bg-red-100 text-red-600 rounded"
                      title="Delete tab"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Tab Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentTab?.id ? 'Edit Tab' : 'Add New Tab'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={currentTab?.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={currentTab?.slug || ''}
                  onChange={(e) => setCurrentTab({...currentTab, slug: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Used in URLs. Auto-generated from name, but you can customize it.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={currentTab?.description || ''}
                  onChange={(e) => setCurrentTab({...currentTab, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  value={currentTab?.display_order || ''}
                  onChange={(e) => setCurrentTab({...currentTab, display_order: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                  min="1"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  {currentTab?.id ? 'Update' : 'Create'} Tab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 