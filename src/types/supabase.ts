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
      accommodations: {
        Row: {
          address: string
          booking_url: string | null
          check_in: string
          check_out: string
          confirmation_code: string | null
          currency: string
          id: string
          name: string
          price_per_night: number
          trip_id: string
        }
        Insert: {
          address: string
          booking_url?: string | null
          check_in: string
          check_out: string
          confirmation_code?: string | null
          currency: string
          id?: string
          name: string
          price_per_night: number
          trip_id: string
        }
        Update: {
          address?: string
          booking_url?: string | null
          check_in?: string
          check_out?: string
          confirmation_code?: string | null
          currency?: string
          id?: string
          name?: string
          price_per_night?: number
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accommodations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          currency: string
          date: string
          description: string
          id: string
          paid_by: string | null
          trip_id: string
        }
        Insert: {
          amount: number
          category: string
          currency: string
          date: string
          description: string
          id?: string
          paid_by?: string | null
          trip_id: string
        }
        Update: {
          amount?: number
          category?: string
          currency?: string
          date?: string
          description?: string
          id?: string
          paid_by?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "travelers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      flights: {
        Row: {
          airline: string
          arrival_at: string
          booking_url: string | null
          currency: string
          departure_at: string
          flight_number: string
          from_iata: string
          id: string
          is_return: boolean
          price: number
          to_iata: string
          traveler_id: string | null
          trip_id: string
        }
        Insert: {
          airline: string
          arrival_at: string
          booking_url?: string | null
          currency: string
          departure_at: string
          flight_number: string
          from_iata: string
          id?: string
          is_return?: boolean
          price: number
          to_iata: string
          traveler_id?: string | null
          trip_id: string
        }
        Update: {
          airline?: string
          arrival_at?: string
          booking_url?: string | null
          currency?: string
          departure_at?: string
          flight_number?: string
          from_iata?: string
          id?: string
          is_return?: boolean
          price?: number
          to_iata?: string
          traveler_id?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flights_traveler_id_fkey"
            columns: ["traveler_id"]
            isOneToOne: false
            referencedRelation: "travelers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flights_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_days: {
        Row: {
          date: string
          id: string
          title: string | null
          trip_id: string
        }
        Insert: {
          date: string
          id?: string
          title?: string | null
          trip_id: string
        }
        Update: {
          date?: string
          id?: string
          title?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_days_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_items: {
        Row: {
          category: string
          cost: number | null
          day_id: string
          description: string | null
          id: string
          location: string | null
          time: string | null
          title: string
        }
        Insert: {
          category: string
          cost?: number | null
          day_id: string
          description?: string | null
          id?: string
          location?: string | null
          time?: string | null
          title: string
        }
        Update: {
          category?: string
          cost?: number | null
          day_id?: string
          description?: string | null
          id?: string
          location?: string | null
          time?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_items_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "itinerary_days"
            referencedColumns: ["id"]
          },
        ]
      }
      travelers: {
        Row: {
          email: string | null
          id: string
          is_owner: boolean
          name: string
          trip_id: string
        }
        Insert: {
          email?: string | null
          id?: string
          is_owner?: boolean
          name: string
          trip_id: string
        }
        Update: {
          email?: string | null
          id?: string
          is_owner?: boolean
          name?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "travelers_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          cover_image_url: string | null
          created_at: string
          currency: string
          destination: string
          end_date: string
          id: string
          start_date: string
          title: string
          user_id: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          destination: string
          end_date: string
          id?: string
          start_date: string
          title: string
          user_id: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          destination?: string
          end_date?: string
          id?: string
          start_date?: string
          title?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
