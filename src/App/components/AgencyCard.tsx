import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Star, ChevronRight } from 'lucide-react';

interface AgencyCardProps {
  name: string;
  location: string;
  description: string;
  rating: number;
  imageUrl: string;
  trustScore: number;
  price: number;
  specializations: string[];
  isVerified: boolean;
  slug: string;
}

export function AgencyCard({
  name,
  location,
  description,
  rating,
  imageUrl,
  trustScore,
  price,
  specializations,
  isVerified,
  slug
}: AgencyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]">
      <div className="h-48 relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        {isVerified && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 bg-opacity-90 text-white px-2 py-1 rounded-full text-sm font-medium shadow-lg">
            <Shield className="h-4 w-4" />
            <span>Verified</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          <div className="flex items-center bg-indigo-50 px-2 py-1 rounded-full">
            <Shield className="h-4 w-4 text-indigo-600 mr-1" />
            <span className="text-sm font-medium text-indigo-600">{trustScore}% trusted</span>
          </div>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center text-yellow-500 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : ''}`}
            />
          ))}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>
        <Link 
          to={`/agency/${slug}`}
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Learn More
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}