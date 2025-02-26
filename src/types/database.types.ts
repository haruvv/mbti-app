export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          handle: string | null;
          handle_updated_at: string | null;
          custom_image_url: string | null;
          preferred_mbti: string | null;
          bio: string | null;
          bookmarked_types: string[] | null;
          social_links: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          handle?: string | null;
          handle_updated_at?: string | null;
          custom_image_url?: string | null;
          preferred_mbti?: string | null;
          bio?: string | null;
          bookmarked_types?: string[] | null;
          social_links?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string | null;
          handle?: string | null;
          handle_updated_at?: string | null;
          custom_image_url?: string | null;
          preferred_mbti?: string | null;
          bio?: string | null;
          bookmarked_types?: string[] | null;
          social_links?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      test_results: {
        Row: {
          id: string;
          user_id: string;
          mbti_type: string;
          answers: Json;
          taken_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mbti_type: string;
          answers?: Json;
          taken_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mbti_type?: string;
          answers?: Json;
          taken_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
    };
    Functions: {
      create_user_with_profile: {
        Args: {
          p_clerk_id: string;
          p_email: string;
          p_display_name: string;
        };
        Returns: Json;
      };
      update_user_handle: {
        Args: {
          p_user_id: string;
          p_new_handle: string;
        };
        Returns: Json;
      };
      update_user_profile: {
        Args: {
          p_user_id: string;
          p_display_name?: string;
          p_bio?: string;
          p_preferred_mbti?: string;
          p_custom_image_url?: string;
          p_bookmarked_types?: string[];
          p_social_links?: Json;
        };
        Returns: Json;
      };
      toggle_follow: {
        Args: {
          p_follower_id: string;
          p_following_id: string;
        };
        Returns: Json;
      };
      get_user_follows: {
        Args: {
          p_user_id: string;
          p_type: string;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: Json;
      };
      get_follow_counts: {
        Args: {
          p_user_id: string;
        };
        Returns: Json;
      };
      check_follow_status: {
        Args: {
          p_follower_id: string;
          p_following_id: string;
        };
        Returns: boolean;
      };
      check_handle_update_allowed: {
        Args: {
          p_user_id: string;
        };
        Returns: boolean;
      };
      find_compatible_users: {
        Args: {
          p_user_id: string;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: Json;
      };
    };
  };
}
