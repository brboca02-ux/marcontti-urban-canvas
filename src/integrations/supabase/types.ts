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
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          meta: Json | null
          model_slug: string | null
          page: string | null
          source: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          meta?: Json | null
          model_slug?: string | null
          page?: string | null
          source?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          meta?: Json | null
          model_slug?: string | null
          page?: string | null
          source?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      instagram_posts: {
        Row: {
          caption: string
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          media_type: string
          post_url: string
          sort_order: number
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          caption?: string
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          media_type?: string
          post_url?: string
          sort_order?: number
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          caption?: string
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          media_type?: string
          post_url?: string
          sort_order?: number
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          birth_date: string | null
          cpf: string | null
          created_at: string
          doc_address_url: string | null
          doc_income_url: string | null
          doc_photo_url: string | null
          email: string | null
          entry: string | null
          id: string
          income: string | null
          landing_page: string | null
          lgpd_consent: boolean
          lgpd_consent_at: string | null
          message: string | null
          model: string | null
          name: string
          origin_page: string | null
          payment_type: string | null
          phone: string
          referrer: string | null
          rg: string | null
          source: string
          term: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          doc_address_url?: string | null
          doc_income_url?: string | null
          doc_photo_url?: string | null
          email?: string | null
          entry?: string | null
          id?: string
          income?: string | null
          landing_page?: string | null
          lgpd_consent?: boolean
          lgpd_consent_at?: string | null
          message?: string | null
          model?: string | null
          name: string
          origin_page?: string | null
          payment_type?: string | null
          phone: string
          referrer?: string | null
          rg?: string | null
          source?: string
          term?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          doc_address_url?: string | null
          doc_income_url?: string | null
          doc_photo_url?: string | null
          email?: string | null
          entry?: string | null
          id?: string
          income?: string | null
          landing_page?: string | null
          lgpd_consent?: boolean
          lgpd_consent_at?: string | null
          message?: string | null
          model?: string | null
          name?: string
          origin_page?: string | null
          payment_type?: string | null
          phone?: string
          referrer?: string | null
          rg?: string | null
          source?: string
          term?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      models: {
        Row: {
          brand: string
          colors: Json
          condition: Database["public"]["Enums"]["model_condition"]
          created_at: string
          description: string
          features: Json
          gallery: Json
          id: string
          installment_months: number
          installment_note: string
          installment_value: number
          is_active: boolean
          name: string
          power: string
          price: string
          price_number: number
          range_km: string
          short_description: string
          slug: string
          sort_order: number
          specs: Json
          speed: string
          tag: string
          updated_at: string
        }
        Insert: {
          brand?: string
          colors?: Json
          condition?: Database["public"]["Enums"]["model_condition"]
          created_at?: string
          description?: string
          features?: Json
          gallery?: Json
          id?: string
          installment_months?: number
          installment_note?: string
          installment_value?: number
          is_active?: boolean
          name: string
          power?: string
          price?: string
          price_number?: number
          range_km?: string
          short_description?: string
          slug: string
          sort_order?: number
          specs?: Json
          speed?: string
          tag?: string
          updated_at?: string
        }
        Update: {
          brand?: string
          colors?: Json
          condition?: Database["public"]["Enums"]["model_condition"]
          created_at?: string
          description?: string
          features?: Json
          gallery?: Json
          id?: string
          installment_months?: number
          installment_note?: string
          installment_value?: number
          is_active?: boolean
          name?: string
          power?: string
          price?: string
          price_number?: number
          range_km?: string
          short_description?: string
          slug?: string
          sort_order?: number
          specs?: Json
          speed?: string
          tag?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
      app_role: "admin" | "user"
      model_condition: "zero_km" | "semi_nova"
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
      app_role: ["admin", "user"],
      model_condition: ["zero_km", "semi_nova"],
    },
  },
} as const
