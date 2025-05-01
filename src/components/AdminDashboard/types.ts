import { User } from '@supabase/supabase-js';

export interface Agency {
  id: string;
  name: string;
  location: string;
  description: string;
  contact_phone: string;
  contact_email: string;
  website: string;
  business_hours: string;
  status: 'pending' | 'approved' | 'rejected';
  verification_code?: string;
  is_verified?: boolean;
  trust_score?: number;
  image_url?: string;
  brochure_url?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  is_cover?: boolean;
}

export interface Review {
  id: string;
  user_id: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user_email?: string;
}

export interface ReviewResponse {
  id: string;
  review_id: string;
  content: string;
  created_at: string;
}

export interface TrustScoreMetrics {
  averageRating: number;
  totalReviews: number;
  verifiedServices: number;
  isVerified: boolean;
}