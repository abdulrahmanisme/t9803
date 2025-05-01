import React, { useState, useRef } from 'react';
import { Plus, Trash2, Upload, Star, StarOff } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Photo } from '../types';
import toast from 'react-hot-toast';

interface PhotosListProps {
  photos: Photo[];
  onAddPhoto: (photo: Omit<Photo, 'id'>) => void;
  onDeletePhoto: (id: string) => void;
  onSetCover: (id: string) => void;
}

export function PhotosList({ photos, onAddPhoto, onDeletePhoto, onSetCover }: PhotosListProps) {
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('agency-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('agency-photos')
        .getPublicUrl(filePath);

      // Add photo to database
      onAddPhoto({
        url: publicUrl,
        caption: caption || file.name,
        is_cover: photos.length === 0 // Make first photo the cover by default
      });

      setCaption('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    try {
      // Extract filename from URL
      const url = new URL(photo.url);
      const filePath = url.pathname.split('/').pop();

      if (filePath) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('agency-photos')
          .remove([filePath]);

        if (storageError) throw storageError;
      }

      // Delete from database
      onDeletePhoto(photo.id);
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Agency Photos</h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo (Max 5MB)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption (optional)
            </label>
            <input
              type="text"
              placeholder="Photo description"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            />
          </div>
        </div>
        {uploading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            Uploading photo...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2">
                <button
                  onClick={() => onSetCover(photo.id)}
                  className={`${
                    photo.is_cover ? 'bg-yellow-500' : 'bg-indigo-600'
                  } text-white p-2 rounded-full hover:bg-opacity-80`}
                  title={photo.is_cover ? 'Cover Photo' : 'Set as Cover'}
                >
                  {photo.is_cover ? (
                    <Star className="h-5 w-5" />
                  ) : (
                    <StarOff className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => handleDeletePhoto(photo)}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  title="Delete Photo"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm rounded-b-lg">
                {photo.caption}
              </div>
            )}
            {photo.is_cover && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                Cover Photo
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}