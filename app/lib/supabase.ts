import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      user_sessions: {
        Row: {
          id: string;
          email: string;
          token: string;
          validated: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          token: string;
          validated?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          token?: string;
          validated?: boolean;
          created_at?: string;
        };
      };
      form_submissions: {
        Row: {
          id: string;
          user_session_id: string;
          step_number: number;
          form_data: any;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_session_id: string;
          step_number: number;
          form_data: any;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_session_id?: string;
          step_number?: number;
          form_data?: any;
          updated_at?: string;
        };
      };
      generated_images: {
        Row: {
          id: string;
          user_session_id: string;
          image_url: string | null;
          image_type: string;
          status: 'pending' | 'generated' | 'error';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_session_id: string;
          image_url?: string | null;
          image_type: string;
          status?: 'pending' | 'generated' | 'error';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_session_id?: string;
          image_url?: string | null;
          image_type?: string;
          status?: 'pending' | 'generated' | 'error';
          created_at?: string;
        };
      };
    };
  };
}
