import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { PencilIcon, TrashIcon, PlusIcon, Upload, X, Image as ImageIcon, MoveHorizontal, LayoutIcon, PlusCircleIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { getBlogTabs, updateBlogPostTab, createBlogTab, deleteBlogTab } from '../../../lib/api';

interface BlogTab {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image_url: string;
  category: string;
  created_at: string;
  tab_id: string | null;
  blog_tabs: {
    name: string;
  } | null;
}

export function BlogManagement() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [tabs, setTabs] = useState<BlogTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showTabModal, setShowTabModal] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
  const [currentTab, setCurrentTab] = useState<Partial<BlogTab> | null>(null);
  const [activeTabFilter, setActiveTabFilter] = useState<string | null>(null);

  useEffect(() => {
    loadBlogPosts();
    loadTabs();
  }, []);

  const loadTabs = async () => {
    try {
      const tabsData = await getBlogTabs();
      setTabs(tabsData);
    } catch (error) {
      console.error('Error loading tabs:', error);
      toast.error('Failed to load tabs');
    }
  };

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_tabs(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = () => {
    setCurrentPost({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      image_url: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddEditModal(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setCurrentPost(post);
    setShowAddEditModal(true);
  };

  const handleMovePost = (post: BlogPost) => {
    setCurrentPost(post);
    setShowMoveModal(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Blog post deleted successfully');
      loadBlogPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost) return;

    try {
      const isEditing = !!currentPost.id;
      
      const postData = {
        title: currentPost.title || '',
        content: currentPost.content || '',
        excerpt: currentPost.excerpt || '',
        author: currentPost.author || '',
        image_url: currentPost.image_url || '',
        category: currentPost.category || '',
        tab_id: currentPost.tab_id || null
      };

      if (isEditing) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', currentPost.id);

        if (error) throw error;
        toast.success('Blog post updated successfully');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        toast.success('Blog post added successfully');
      }

      setShowAddEditModal(false);
      loadBlogPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Failed to save blog post');
    }
  };

  const handleMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost || !currentPost.id) return;

    try {
      await updateBlogPostTab(currentPost.id, currentPost.tab_id);
      toast.success('Blog post moved successfully');
      setShowMoveModal(false);
      loadBlogPosts();
    } catch (error) {
      console.error('Error moving blog post:', error);
      toast.error('Failed to move blog post');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('public').getPublicUrl(filePath);
      
      if (currentPost) {
        setCurrentPost({
          ...currentPost,
          image_url: data.publicUrl
        });
      }
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
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

  const handleAddTab = () => {
    setCurrentTab({ 
      name: '', 
      slug: '', 
      description: '', 
      display_order: tabs.length + 1 
    });
    setShowTabModal(true);
  };

  const handleDeleteTab = async (tabId: string, tabName: string) => {
    if (!window.confirm(`Are you sure you want to delete the tab "${tabName}"? Posts in this tab will be moved to "Uncategorized".`)) {
      return;
    }

    try {
      await deleteBlogTab(tabId);
      toast.success('Tab deleted successfully');
      loadTabs();
      // Refresh posts as their tab association may have changed
      loadBlogPosts();
      
      // Reset active tab filter if the deleted tab was selected
      if (activeTabFilter === tabId) {
        setActiveTabFilter(null);
      }
    } catch (error) {
      console.error('Error deleting tab:', error);
      toast.error('Failed to delete tab');
    }
  };

  const handleTabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTab || !currentTab.name) return;

    try {
      const tabData = {
        name: currentTab.name,
        slug: currentTab.slug || generateSlug(currentTab.name),
        description: currentTab.description || '',
        display_order: currentTab.display_order || tabs.length + 1
      };

      await createBlogTab(tabData);
      toast.success('Tab created successfully');
      setShowTabModal(false);
      loadTabs();
    } catch (error) {
      console.error('Error creating tab:', error);
      toast.error('Failed to create tab');
    }
  };

  const filteredPosts = activeTabFilter 
    ? blogPosts.filter(post => post.tab_id === activeTabFilter)
    : blogPosts;

  const switchToTabsManagement = () => {
    // Direct DOM manipulation as a more reliable alternative to custom events
    const tabButton = document.querySelector('button[data-tab-id="blogTabs"]');
    if (tabButton) {
      (tabButton as HTMLButtonElement).click();
    } else {
      toast.error("Couldn't find the Blog Tabs navigation. Please use the sidebar to navigate.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <div className="flex gap-2">
          <button 
            onClick={switchToTabsManagement}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md flex items-center gap-2"
            title="Advanced Tab Management"
          >
            <LayoutIcon size={16} />
            Advanced Tab Management
          </button>
          <button 
            onClick={handleAddPost}
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <PlusIcon size={16} />
            Add New Post
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Filter by Tab</h2>
          <button
            onClick={handleAddTab}
            className="text-primary flex items-center gap-1 text-sm"
          >
            <PlusCircleIcon size={16} />
            Create New Tab
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            className={`px-3 py-1 rounded-full ${activeTabFilter === null ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTabFilter(null)}
          >
            All Posts
          </button>
          {tabs.map(tab => (
            <div key={tab.id} className="flex items-center gap-1">
              <button
                className={`px-3 py-1 rounded-full ${activeTabFilter === tab.id ? 'bg-primary text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTabFilter(tab.id)}
              >
                {tab.name}
              </button>
              <button
                onClick={() => handleDeleteTab(tab.id, tab.name)}
                className="text-red-500 hover:text-red-700"
                title={`Delete "${tab.name}" tab`}
              >
                <TrashIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Tab</th>
                <th className="py-3 px-4 text-left">Author</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{post.title}</td>
                  <td className="py-3 px-4">{post.blog_tabs?.name || 'Uncategorized'}</td>
                  <td className="py-3 px-4">{post.author}</td>
                  <td className="py-3 px-4">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-1 bg-blue-100 text-blue-600 rounded"
                    >
                      <PencilIcon size={16} />
                    </button>
                      <button
                      onClick={() => handleMovePost(post)}
                      className="p-1 bg-green-100 text-green-600 rounded"
                      >
                      <MoveHorizontal size={16} />
                      </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1 bg-red-100 text-red-600 rounded"
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

      {/* Add/Edit Post Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentPost?.id ? 'Edit Blog Post' : 'Add New Blog Post'}
              </h2>
              <button onClick={() => setShowAddEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={currentPost?.title || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Tab</label>
                <select
                  value={currentPost?.tab_id || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, tab_id: e.target.value || null })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- No Tab (Display in All) --</option>
                  {tabs.map(tab => (
                    <option key={tab.id} value={tab.id}>
                      {tab.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Assign this post to a specific tab. 
                  <button 
                    type="button" 
                    className="text-blue-500 underline ml-1"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAddEditModal(false);
                      switchToTabsManagement();
                    }}
                  >
                    Manage tabs
                  </button>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={currentPost?.date || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, date: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input
                  type="text"
                  value={currentPost?.author || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={currentPost?.category || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea
                  value={currentPost?.excerpt || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                  className="w-full p-2 border rounded h-20"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={currentPost?.content || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                  className="w-full p-2 border rounded h-40"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Featured Image</label>
                {currentPost?.image_url && (
                  <div className="mb-2 relative">
                    <img
                      src={currentPost.image_url}
                      alt="Featured"
                      className="w-full max-h-40 object-cover rounded mb-2"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-md flex items-center gap-2">
                    <ImageIcon size={16} />
                    <span>Upload Image</span>
                <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {currentPost?.image_url && (
                    <button
                      type="button"
                      onClick={() => setCurrentPost({...currentPost, image_url: ''})}
                      className="text-red-500 bg-red-50 p-2 rounded-md"
                    >
                      <TrashIcon size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
              <button
                type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  {currentPost?.id ? 'Update' : 'Create'} Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Move Post Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Move Post to Different Tab</h2>
              <button onClick={() => setShowMoveModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleMoveSubmit}>
              <div className="mb-4">
                <p className="text-sm mb-1">Moving: <strong>{currentPost?.title}</strong></p>
                <p className="text-sm text-gray-500 mb-4">
                  Current Tab: <strong>{currentPost?.blog_tabs?.name || 'Uncategorized'}</strong>
                </p>
                
                <label className="block text-sm font-medium mb-1">Select New Tab</label>
                <select
                  value={currentPost?.tab_id || ''}
                  onChange={(e) => setCurrentPost({...currentPost, tab_id: e.target.value || null})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Uncategorized</option>
                  {tabs.map(tab => (
                    <option key={tab.id} value={tab.id}>
                      {tab.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMoveModal(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  Move Post
              </button>
            </div>
          </form>
        </div>
      </div>
      )}

      {/* Add Tab Modal */}
      {showTabModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Tab</h2>
              <button onClick={() => setShowTabModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleTabSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tab Name</label>
                <input
                  type="text"
                  value={currentTab?.name || ''}
                  onChange={(e) => setCurrentTab({
                    ...currentTab,
                    name: e.target.value,
                    slug: generateSlug(e.target.value)
                  })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Study Abroad, Scholarships"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tab Description (Optional)</label>
                <textarea
                  value={currentTab?.description || ''}
                  onChange={(e) => setCurrentTab({...currentTab, description: e.target.value})}
                  className="w-full p-2 border rounded h-20"
                  placeholder="Brief description of what content goes in this tab"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTabModal(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  Create Tab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}