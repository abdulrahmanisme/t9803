import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption?: string;
}

interface PhotoGalleryModalProps {
  photos: Photo[];
  initialPhotoIndex: number;
  onClose: () => void;
}

export function PhotoGalleryModal({ photos, initialPhotoIndex, onClose }: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  // Function to determine if caption should be shown
  const shouldShowCaption = (caption?: string) => {
    if (!caption) return false;
    // Don't show caption if it looks like a filename (contains extension)
    return !caption.match(/\.[^/.]+$/);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Navigation buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 text-white hover:text-gray-300"
            >
              <ChevronLeft className="h-12 w-12" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 text-white hover:text-gray-300"
            >
              <ChevronRight className="h-12 w-12" />
            </button>
          </>
        )}

        {/* Photo container */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center"
        >
          <img
            src={photos[currentIndex].url}
            alt="Gallery photo"
            className="max-h-[85vh] max-w-full object-contain"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80';
            }}
          />
          
          {/* Only show caption if it's not a filename */}
          {shouldShowCaption(photos[currentIndex].caption) && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
              {photos[currentIndex].caption}
            </div>
          )}

          {/* Photo counter */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      </div>
    </div>
  );
}