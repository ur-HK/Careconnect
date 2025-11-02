export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_type: string
          caretaker_id: string
          caretaker_notified_at: string | null
          created_at: string
          customer_id: string
          end_date: string | null
          hours: number | null
          id: string
          notification_sent: boolean | null
          special_requirements: string | null
          start_date: string
          status: string | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          booking_type: string
          caretaker_id: string
          caretaker_notified_at?: string | null
          created_at?: string
          customer_id: string
          end_date?: string | null
          hours?: number | null
          id?: string
          notification_sent?: boolean | null
          special_requirements?: string | null
          start_date: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          booking_type?: string
          caretaker_id?: string
          caretaker_notified_at?: string | null
          created_at?: string
          customer_id?: string
          end_date?: string | null
          hours?: number | null
          id?: string
          notification_sent?: boolean | null
          special_requirements?: string | null
          start_date?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_caretaker_id_fkey"
            columns: ["caretaker_id"]
            isOneToOne: false
            referencedRelation: "caretaker_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      caretaker_profiles: {
        Row: {
          address: string | null
          availability: string | null
          average_rating: number | null
          bio: string | null
          certifications: string[] | null
          city: string | null
          created_at: string
          daily_rate: number | null
          experience_years: number | null
          full_name: string
          hourly_rate: number
          id: string
          is_verified: boolean | null
          languages_spoken: string[] | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          profile_image_url: string | null
          service_radius_km: number | null
          specializations: string[] | null
          state: string | null
          total_completed_jobs: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          verification_documents: Json | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          availability?: string | null
          average_rating?: number | null
          bio?: string | null
          certifications?: string[] | null
          city?: string | null
          created_at?: string
          daily_rate?: number | null
          experience_years?: number | null
          full_name: string
          hourly_rate: number
          id?: string
          is_verified?: boolean | null
          languages_spoken?: string[] | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          profile_image_url?: string | null
          service_radius_km?: number | null
          specializations?: string[] | null
          state?: string | null
          total_completed_jobs?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          verification_documents?: Json | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          availability?: string | null
          average_rating?: number | null
          bio?: string | null
          certifications?: string[] | null
          city?: string | null
          created_at?: string
          daily_rate?: number | null
          experience_years?: number | null
          full_name?: string
          hourly_rate?: number
          id?: string
          is_verified?: boolean | null
          languages_spoken?: string[] | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          profile_image_url?: string | null
          service_radius_km?: number | null
          specializations?: string[] | null
          state?: string | null
          total_completed_jobs?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          verification_documents?: Json | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "caretaker_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string
          caretaker_id: string
          created_at: string
          customer_id: string
          id: string
          rating: number
          review_text: string | null
        }
        Insert: {
          booking_id: string
          caretaker_id: string
          created_at?: string
          customer_id: string
          id?: string
          rating: number
          review_text?: string | null
        }
        Update: {
          booking_id?: string
          caretaker_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          rating?: number
          review_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "customer" | "caretaker"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["customer", "caretaker"],
    },
  },
} as const
