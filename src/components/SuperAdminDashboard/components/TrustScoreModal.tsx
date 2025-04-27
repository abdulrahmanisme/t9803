import React, { useState } from 'react';
import { X, Shield, Star, AlertTriangle } from 'lucide-react';

interface TrustScoreModalProps {
  agency: {
    id: string;
    name: string;
    trust_score: number;
    rating: number;
    total_reviews: number;
  };
  onClose: () => void;
  onUpdate: (id: string, score: number) => Promise<void>;
}

export function TrustScoreModal({ agency, onClose, onUpdate }: TrustScoreModalProps) {
  const [score, setScore] = useState(agency.trust_score);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(agency.id, score);
      onClose();
    } catch (error) {
      console.error('Error updating trust score:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Adjust Trust Score</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="font-medium text-gray-900">{agency.name}</h3>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                {agency.rating.toFixed(1)} ({agency.total_reviews} reviews)
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trust Score (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Shield className={`h-4 w-4 ${
                score >= 80 ? 'text-green-500' :
                score >= 60 ? 'text-yellow-500' :
                'text-red-500'
              }`} />
              <span className={
                score >= 80 ? 'text-green-700' :
                score >= 60 ? 'text-yellow-700' :
                'text-red-700'
              }>
                {score >= 80 ? 'High Trust' :
                 score >= 60 ? 'Moderate Trust' :
                 'Low Trust'}
              </span>
            </div>
          </div>

          {Math.abs(agency.trust_score - score) > 20 && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Large Score Change</h4>
                  <p className="mt-1 text-sm text-yellow-700">
                    You're about to change the trust score by more than 20 points. This can significantly impact the agency's visibility and ranking.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : 'Update Score'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}