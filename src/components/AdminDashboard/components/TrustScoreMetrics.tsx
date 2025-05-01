import React from 'react';
import { Shield, Star } from 'lucide-react';
import { TrustScoreMetrics as TrustScoreMetricsType } from '../types';

interface TrustScoreMetricsProps {
  metrics: TrustScoreMetricsType;
  trustScore: number;
}

export function TrustScoreMetrics({ metrics, trustScore }: TrustScoreMetricsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Shield className="h-5 w-5 text-indigo-600" />
        Trust Score Metrics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Average Rating</div>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 mr-2">
              {metrics.averageRating.toFixed(1)}
            </span>
            <div className="flex text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(metrics.averageRating)
                      ? 'fill-current'
                      : ''
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {metrics.totalReviews} reviews
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Verified Services</div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics.verifiedServices}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {Math.min(metrics.verifiedServices * 5, 30)}% contribution
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Verification Status</div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics.isVerified ? (
              <span className="text-green-600">Verified</span>
            ) : (
              <span className="text-yellow-600">Pending</span>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {metrics.isVerified ? '20%' : '0%'} contribution
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Overall Trust Score</div>
          <div className="text-2xl font-bold text-gray-900">
            {trustScore}%
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Updated automatically
          </div>
        </div>
      </div>
    </div>
  );
}