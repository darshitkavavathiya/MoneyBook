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
      accounts: {
        Row: {
          created_at: string | null
          current_balance: number
          id: string
          name: string
          profile_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_balance?: number
          id?: string
          name: string
          profile_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_balance?: number
          id?: string
          name?: string
          profile_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "balance_summary_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "accounts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          created_at: string | null
          file_name: string | null
          file_path: string
          file_type: string | null
          id: string
          transaction_id: string
        }
        Insert: {
          created_at?: string | null
          file_name?: string | null
          file_path: string
          file_type?: string | null
          id?: string
          transaction_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string | null
          file_path?: string
          file_type?: string | null
          id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      borrow_lend: {
        Row: {
          amount: number
          created_at: string | null
          date: string | null
          id: string
          is_settled: boolean | null
          note: string | null
          person_name: string
          profile_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date?: string | null
          id?: string
          is_settled?: boolean | null
          note?: string | null
          person_name: string
          profile_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string | null
          id?: string
          is_settled?: boolean | null
          note?: string | null
          person_name?: string
          profile_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "borrow_lend_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "balance_summary_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "borrow_lend_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          limit_amount: number
          month: string
          profile_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          limit_amount: number
          month?: string
          profile_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          limit_amount?: number
          month?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "balance_summary_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "budgets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          name: string
          profile_id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          profile_id: string
          type: string
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          profile_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "balance_summary_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "categories_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_dashboard: {
        Row: {
          amount: number | null
          created_at: string | null
          date: string | null
          id: string
          note: string | null
          profile_id: string
          provider_name: string | null
          title: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          note?: string | null
          profile_id: string
          provider_name?: string | null
          title: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          note?: string | null
          profile_id?: string
          provider_name?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_dashboard_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "balance_summary_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "policy_dashboard_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      settlements: {
        Row: {
          amount: number
          created_at: string | null
          date: string | null
          from_profile_id: string
          id: string
          to_profile_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date?: string | null
          from_profile_id: string
          id?: string
          to_profile_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string | null
          from_profile_id?: string
          id?: string
          to_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlements_from_profile_id_fkey"
            columns: ["from_profile_id"]
            isOneToOne: false
            referencedRelation: "balance_summary_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "settlements_from_profile_id_fkey"
            columns: ["from_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlements_to_profile_id_fkey"
            columns: ["to_profile_id"]
            isOneToOne: false
            referencedRelation: "balance_summary_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "settlements_to_profile_id_fkey"
            columns: ["to_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_expenses: {
        Row: {
          amount: number
          created_at: string | null
          date: string | null
          id: string
          payer_profile_id: string
          split_type: string | null
          title: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date?: string | null
          id?: string
          payer_profile_id: string
          split_type?: string | null
          title: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string | null
          id?: string
          payer_profile_id?: string
          split_type?: string | null
          title?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_expenses_payer_profile_id_fkey"
            columns: ["payer_profile_id"]
            isOneToOne: false
            referencedRelation: "balance_summary_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "shared_expenses_payer_profile_id_fkey"
            columns: ["payer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_expenses_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_participants: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          profile_id: string
          shared_expense_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          profile_id: string
          shared_expense_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          profile_id?: string
          shared_expense_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "balance_summary_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "shared_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_participants_shared_expense_id_fkey"
            columns: ["shared_expense_id"]
            isOneToOne: false
            referencedRelation: "shared_expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          category_id: string | null
          created_at: string | null
          date: string
          id: string
          is_shared: boolean | null
          note: string | null
          profile_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          amount: number
          category_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          is_shared?: boolean | null
          note?: string | null
          profile_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          amount?: number
          category_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          is_shared?: boolean | null
          note?: string | null
          profile_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "balance_summary_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          pin_hash: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          pin_hash?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          pin_hash?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      balance_summary_view: {
        Row: {
          profile_id: string | null
          total_balance: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_profile_owner: { Args: { p_profile_id: string }; Returns: boolean }
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
