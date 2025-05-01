import { useState, useEffect } from 'react';
import { supabase, retryableQuery, handleSupabaseError } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { PostgrestError, PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';

interface Agency {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  rating: number;
  trust_score: number;
  price: number;
  specializations: string[];
  is_verified: boolean;
  contact_phone: string;
  contact_email: string;
  website: string;
  business_hours: string;
  brochure_url?: string;
  photos?: Array<{
    id: string;
    url: string;
    caption: string;
    is_cover: boolean;
  }>;
  services?: Array<{
    name: string;
    description: string;
  }>;
}

type AgencyResponse = Agency & {
  agency_services: Array<{
    name: string;
    description: string;
  }>;
};

type AgencyPhoto = {
  id: string;
  url: string;
  caption: string;
  is_cover: boolean;
  agency_id: string;
  created_at: string;
};

export function useAgency(slug: string | undefined) {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAgency() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        // First fetch agency data
        const agencyResponse = await retryableQuery<PostgrestSingleResponse<AgencyResponse>>(
          async () => {
            const response = await supabase
              .from('agencies')
              .select(`
                *,
                agency_services (
                  name,
                  description
                )
              `)
              .eq('slug', slug)
              .single();
            return response;
          }
        );

        if (agencyResponse.error) {
          if (agencyResponse.error.code === 'PGRST116') {
            throw new Error('Agency not found');
          }
          throw agencyResponse.error;
        }

        // Then fetch photos, ordering by cover photo first, then creation date
        const photosResponse = await retryableQuery<PostgrestResponse<AgencyPhoto[]>>(
          async () => {
            const response = await supabase
              .from('agency_photos')
              .select('*')
              .eq('agency_id', agencyResponse.data.id)
              .order('is_cover', { ascending: false }) // Cover photos first
              .order('created_at', { ascending: true });
            return response;
          }
        );

        if (photosResponse.error) throw photosResponse.error;

        if (mounted && agencyResponse.data) {
          const photos = Array.isArray(photosResponse.data) ? photosResponse.data : [];
          const mappedPhotos = photos.map((photo: AgencyPhoto) => ({
            id: photo.id,
            url: photo.url,
            caption: photo.caption,
            is_cover: photo.is_cover
          }));

          setAgency({
            id: agencyResponse.data.id,
            name: agencyResponse.data.name,
            slug: agencyResponse.data.slug || '',
            location: agencyResponse.data.location,
            description: agencyResponse.data.description,
            rating: agencyResponse.data.rating || 0,
            trust_score: agencyResponse.data.trust_score || 0,
            price: agencyResponse.data.price || 0,
            specializations: agencyResponse.data.specializations || [],
            is_verified: agencyResponse.data.is_verified || false,
            contact_phone: agencyResponse.data.contact_phone || '',
            contact_email: agencyResponse.data.contact_email || '',
            website: agencyResponse.data.website || '',
            business_hours: agencyResponse.data.business_hours || '',
            brochure_url: agencyResponse.data.brochure_url || undefined,
            photos: mappedPhotos,
            services: agencyResponse.data.agency_services || []
          });
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching agency:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch agency'));
          if (err instanceof Error && err.message !== 'Agency not found') {
            const errorMessage = handleSupabaseError(err);
            toast.error(errorMessage);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAgency();

    return () => {
      mounted = false;
    };
  }, [slug]);

  return { agency, loading, error };
}