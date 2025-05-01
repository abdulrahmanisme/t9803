export interface Guide {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  read_time: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  featured: boolean;
  author_name?: string;
  author_image?: string;
} 