import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Star, Send } from 'lucide-react';
import { Review, ReviewResponse } from '../types';

interface ReviewsListProps {
  reviews: Review[];
  responses: Record<string, ReviewResponse>;
  loading: boolean;
  onReviewAction: (reviewId: string, status: 'approved' | 'rejected') => void;
  onResponseSubmit: (reviewId: string, content: string) => void;
}

export function ReviewsList({
  reviews,
  responses,
  loading,
  onReviewAction,
  onResponseSubmit
}: ReviewsListProps) {
  const [newResponses, setNewResponses] = useState<Record<string, string>>({});

  const handleResponseSubmit = (reviewId: string) => {
    const content = newResponses[reviewId];
    if (!content) return;

    onResponseSubmit(reviewId, content);
    setNewResponses(prev => {
      const updated = { ...prev };
      delete updated[reviewId];
      return updated;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h2>
      
      {loading ? (
        <div className="text-center py-4">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No reviews yet</div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{review.user_email}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onReviewAction(review.id, 'approved')}
                        className="text-green-600 hover:text-green-800"
                        title="Approve"
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onReviewAction(review.id, 'rejected')}
                        className="text-red-600 hover:text-red-800"
                        title="Reject"
                      >
                        <ThumbsDown className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    review.status === 'approved' ? 'bg-green-100 text-green-800' :
                    review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {review.status}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{review.content}</p>

              {responses[review.id] ? (
                <div className="ml-8 mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Your Response</span>
                  </div>
                  <p className="text-gray-700">{responses[review.id].content}</p>
                </div>
              ) : (
                <div className="ml-8 mt-4">
                  <div className="flex gap-4">
                    <textarea
                      value={newResponses[review.id] || ''}
                      onChange={(e) => setNewResponses(prev => ({
                        ...prev,
                        [review.id]: e.target.value
                      }))}
                      placeholder="Write your response..."
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                    />
                    <button
                      onClick={() => handleResponseSubmit(review.id)}
                      disabled={!newResponses[review.id]}
                      className="self-start bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}