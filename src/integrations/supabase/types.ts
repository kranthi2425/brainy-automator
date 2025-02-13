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
      access_history: {
        Row: {
          action: string
          case_id: string | null
          created_at: string | null
          id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          case_id?: string | null
          created_at?: string | null
          id?: string
          timestamp: string
          user_id?: string | null
        }
        Update: {
          action?: string
          case_id?: string | null
          created_at?: string | null
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_history_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          call_type: string
          callee_id: string
          caller_id: string
          case_id: string | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          geographic_location: string | null
          id: string
          metadata: Json | null
          platform: Database["public"]["Enums"]["platform_type"]
          start_time: string
          status: Database["public"]["Enums"]["call_status"]
          updated_at: string | null
        }
        Insert: {
          call_type: string
          callee_id: string
          caller_id: string
          case_id?: string | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          geographic_location?: string | null
          id?: string
          metadata?: Json | null
          platform: Database["public"]["Enums"]["platform_type"]
          start_time?: string
          status?: Database["public"]["Enums"]["call_status"]
          updated_at?: string | null
        }
        Update: {
          call_type?: string
          callee_id?: string
          caller_id?: string
          case_id?: string | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          geographic_location?: string | null
          id?: string
          metadata?: Json | null
          platform?: Database["public"]["Enums"]["platform_type"]
          start_time?: string
          status?: Database["public"]["Enums"]["call_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          case_number: string
          created_at: string | null
          id: string
          investigator_id: string
          last_modified: string | null
          report_type: string
          status: string
          summary: string | null
        }
        Insert: {
          case_number: string
          created_at?: string | null
          id?: string
          investigator_id: string
          last_modified?: string | null
          report_type: string
          status: string
          summary?: string | null
        }
        Update: {
          case_number?: string
          created_at?: string | null
          id?: string
          investigator_id?: string
          last_modified?: string | null
          report_type?: string
          status?: string
          summary?: string | null
        }
        Relationships: []
      }
      chain_of_custody: {
        Row: {
          action: string
          created_at: string | null
          evidence_id: string | null
          handler_id: string | null
          id: string
          location: string
          timestamp: string
        }
        Insert: {
          action: string
          created_at?: string | null
          evidence_id?: string | null
          handler_id?: string | null
          id?: string
          location: string
          timestamp: string
        }
        Update: {
          action?: string
          created_at?: string | null
          evidence_id?: string | null
          handler_id?: string | null
          id?: string
          location?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "chain_of_custody_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence_items"
            referencedColumns: ["id"]
          },
        ]
      }
      crime_scene_details: {
        Row: {
          case_id: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          location: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          location: string
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          location?: string
        }
        Relationships: [
          {
            foreignKeyName: "crime_scene_details_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          case_id: string | null
          created_at: string | null
          device_id: string
          device_type: string
          id: string
          manufacturer: string | null
          model: string | null
          os_version: string | null
          serial_number: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          device_id: string
          device_type: string
          id?: string
          manufacturer?: string | null
          model?: string | null
          os_version?: string | null
          serial_number?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          device_id?: string
          device_type?: string
          id?: string
          manufacturer?: string | null
          model?: string | null
          os_version?: string | null
          serial_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_locations: {
        Row: {
          case_id: string | null
          created_at: string | null
          id: string
          location: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          location: string
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          location?: string
        }
        Relationships: [
          {
            foreignKeyName: "digital_locations_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_items: {
        Row: {
          case_id: string | null
          collection_date: string
          created_at: string | null
          evidence_type: string
          hash: string
          id: string
          location: string
        }
        Insert: {
          case_id?: string | null
          collection_date: string
          created_at?: string | null
          evidence_type: string
          hash: string
          id?: string
          location: string
        }
        Update: {
          case_id?: string | null
          collection_date?: string
          created_at?: string | null
          evidence_type?: string
          hash?: string
          id?: string
          location?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_items_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_links: {
        Row: {
          case_id: string | null
          connection: string
          created_at: string | null
          evidence_id: string | null
          id: string
          suspect_id: string
        }
        Insert: {
          case_id?: string | null
          connection: string
          created_at?: string | null
          evidence_id?: string | null
          id?: string
          suspect_id: string
        }
        Update: {
          case_id?: string | null
          connection?: string
          created_at?: string | null
          evidence_id?: string | null
          id?: string
          suspect_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_links_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_links_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence_items"
            referencedColumns: ["id"]
          },
        ]
      }
      network_info: {
        Row: {
          case_id: string | null
          created_at: string | null
          id: string
          ip_address: string
          mac_address: string
          network_type: string
          provider: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          ip_address: string
          mac_address: string
          network_type: string
          provider?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string
          mac_address?: string
          network_type?: string
          provider?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "network_info_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          case_id: string | null
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          location: string | null
          relevance: string | null
          timestamp: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          location?: string | null
          relevance?: string | null
          timestamp: string
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          location?: string | null
          relevance?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      call_analytics: {
        Row: {
          avg_duration_seconds: number | null
          call_count: number | null
          call_type: string | null
          geographic_location: string | null
          platform: Database["public"]["Enums"]["platform_type"] | null
          status: Database["public"]["Enums"]["call_status"] | null
          time_bucket: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      call_status:
        | "initiated"
        | "ringing"
        | "in_progress"
        | "completed"
        | "failed"
        | "missed"
      platform_type: "voip" | "pstn" | "sip" | "mobile" | "desktop" | "iot"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
