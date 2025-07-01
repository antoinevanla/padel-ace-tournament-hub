export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      matches: {
        Row: {
          created_at: string | null
          id: string
          round_name: string | null
          scheduled_time: string | null
          score_details: Json | null
          status: string | null
          team1_player1_id: string | null
          team1_player2_id: string | null
          team1_sets_won: number | null
          team2_player1_id: string | null
          team2_player2_id: string | null
          team2_sets_won: number | null
          tournament_id: string | null
          winner_team: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          round_name?: string | null
          scheduled_time?: string | null
          score_details?: Json | null
          status?: string | null
          team1_player1_id?: string | null
          team1_player2_id?: string | null
          team1_sets_won?: number | null
          team2_player1_id?: string | null
          team2_player2_id?: string | null
          team2_sets_won?: number | null
          tournament_id?: string | null
          winner_team?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          round_name?: string | null
          scheduled_time?: string | null
          score_details?: Json | null
          status?: string | null
          team1_player1_id?: string | null
          team1_player2_id?: string | null
          team1_sets_won?: number | null
          team2_player1_id?: string | null
          team2_player2_id?: string | null
          team2_sets_won?: number | null
          tournament_id?: string | null
          winner_team?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      media_gallery: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          title: string
          tournament_id: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          title: string
          tournament_id?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          title?: string
          tournament_id?: string | null
          uploaded_by?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      tournament_registrations: {
        Row: {
          created_at: string | null
          id: string
          partner_id: string | null
          payment_status: string | null
          player_id: string | null
          tournament_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          partner_id?: string | null
          payment_status?: string | null
          player_id?: string | null
          tournament_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          partner_id?: string | null
          payment_status?: string | null
          player_id?: string | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_registrations_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          entry_fee: number | null
          id: string
          image_url: string | null
          location: string
          max_participants: number
          name: string
          organizer_id: string | null
          prize_pool: number | null
          registration_deadline: string | null
          start_date: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          entry_fee?: number | null
          id?: string
          image_url?: string | null
          location: string
          max_participants: number
          name: string
          organizer_id?: string | null
          prize_pool?: number | null
          registration_deadline?: string | null
          start_date: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          entry_fee?: number | null
          id?: string
          image_url?: string | null
          location?: string
          max_participants?: number
          name?: string
          organizer_id?: string | null
          prize_pool?: number | null
          registration_deadline?: string | null
          start_date?: string
          status?: string | null
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
      match_status: "scheduled" | "in_progress" | "completed" | "cancelled"
      tournament_status: "upcoming" | "active" | "completed" | "cancelled"
      user_role: "player" | "admin" | "organizer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      match_status: ["scheduled", "in_progress", "completed", "cancelled"],
      tournament_status: ["upcoming", "active", "completed", "cancelled"],
      user_role: ["player", "admin", "organizer"],
    },
  },
} as const
