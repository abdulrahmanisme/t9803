export interface Database {
  public: {
    Tables: {
      university_courses: {
        Row: {
          id: string;
          course_name: string;
          university_name: string;
          location: string;
          tuition_fee: string;
          duration: string;
          degree_type: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_name: string;
          university_name: string;
          location: string;
          tuition_fee: string;
          duration: string;
          degree_type: string;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_name?: string;
          university_name?: string;
          location?: string;
          tuition_fee?: string;
          duration?: string;
          degree_type?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      scholarships: {
        Row: {
          id: string;
          name: string;
          amount: string;
          foundation: string;
          eligibility: string;
          deadline: string;
          chance: string;
          competition: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          amount: string;
          foundation: string;
          eligibility: string;
          deadline: string;
          chance: string;
          competition: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          amount?: string;
          foundation?: string;
          eligibility?: string;
          deadline?: string;
          chance?: string;
          competition?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      course_listings: {
        Row: {
          id: string;
          course_name: string;
          university_name: string;
          location: string;
          tuition_fee: string;
          duration: string;
          degree_type: string;
          description: string;
        };
        Relationships: [];
      };
      scholarship_listings: {
        Row: {
          id: string;
          name: string;
          amount: string;
          foundation: string;
          eligibility: string;
          deadline: string;
          chance: string;
          competition: string;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
      };
    };
  };
} 