export interface Agency {
  id: string;
  name: string;
  location: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  trust_score: number;
  is_verified: boolean;
  owner: {
    email: string;
  } | null;
  created_at: string;
}

export interface CSVAgency {
  name: string;
  location: string;
  description: string;
  contact_email: string;
  trust_score?: number;
  price?: number;
  contact_phone?: string;
  website?: string;
  business_hours?: string;
}

export interface UploadStatus {
  total: number;
  processed: number;
  success: number;
  failed: number;
}
