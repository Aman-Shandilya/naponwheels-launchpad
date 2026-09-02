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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      auth_events: {
        Row: {
          created_at: string
          email: string | null
          event_type: string
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_type: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          event_type?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          berth_type: string | null
          booking_date: string
          bus_id: string
          check_in: string
          check_out: string
          created_at: string
          customer_id: string
          customer_name: string | null
          customer_phone: string | null
          id: string
          notes: string | null
          status: string
          total_price: number
          updated_at: string
        }
        Insert: {
          berth_type?: string | null
          booking_date: string
          bus_id: string
          check_in?: string
          check_out?: string
          created_at?: string
          customer_id: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          status?: string
          total_price?: number
          updated_at?: string
        }
        Update: {
          berth_type?: string | null
          booking_date?: string
          bus_id?: string
          check_in?: string
          check_out?: string
          created_at?: string
          customer_id?: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          status?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["id"]
          },
        ]
      }
      bus_documents: {
        Row: {
          bus_id: string
          created_at: string
          document_type: string
          file_name: string | null
          file_path: string
          id: string
        }
        Insert: {
          bus_id: string
          created_at?: string
          document_type: string
          file_name?: string | null
          file_path: string
          id?: string
        }
        Update: {
          bus_id?: string
          created_at?: string
          document_type?: string
          file_name?: string | null
          file_path?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bus_documents_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["id"]
          },
        ]
      }
      buses: {
        Row: {
          address: string
          amenities: Json | null
          available_days: Json | null
          bus_name: string
          bus_type: string
          business_type: string
          city: string
          created_at: string
          discount_enabled: boolean | null
          id: string
          is_active: boolean | null
          landmark: string | null
          night_package_price: number | null
          operator_name: string | null
          owner_id: string
          parking_location: string | null
          price_per_hour: number
          recurring_availability: boolean | null
          registration_number: string
          secure_parking: boolean | null
          status: string
          time_slot_end: string | null
          time_slot_start: string | null
          total_berths: number
          updated_at: string
          weekend_price: number | null
        }
        Insert: {
          address?: string
          amenities?: Json | null
          available_days?: Json | null
          bus_name: string
          bus_type?: string
          business_type?: string
          city?: string
          created_at?: string
          discount_enabled?: boolean | null
          id?: string
          is_active?: boolean | null
          landmark?: string | null
          night_package_price?: number | null
          operator_name?: string | null
          owner_id: string
          parking_location?: string | null
          price_per_hour?: number
          recurring_availability?: boolean | null
          registration_number: string
          secure_parking?: boolean | null
          status?: string
          time_slot_end?: string | null
          time_slot_start?: string | null
          total_berths?: number
          updated_at?: string
          weekend_price?: number | null
        }
        Update: {
          address?: string
          amenities?: Json | null
          available_days?: Json | null
          bus_name?: string
          bus_type?: string
          business_type?: string
          city?: string
          created_at?: string
          discount_enabled?: boolean | null
          id?: string
          is_active?: boolean | null
          landmark?: string | null
          night_package_price?: number | null
          operator_name?: string | null
          owner_id?: string
          parking_location?: string | null
          price_per_hour?: number
          recurring_availability?: boolean | null
          registration_number?: string
          secure_parking?: boolean | null
          status?: string
          time_slot_end?: string | null
          time_slot_start?: string | null
          total_berths?: number
          updated_at?: string
          weekend_price?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
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
      app_role: "customer" | "bus_owner" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["customer", "bus_owner", "admin"],
    },
  },
} as const
