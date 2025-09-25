import { createClient } from '@supabase/supabase-js';

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 環境変数の検証（開発環境では警告のみ、本番環境ではエラー）
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Supabase environment variables are not set properly. Please check your .env.local file and ensure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  } else {
    console.warn('Supabase environment variables are not set. Please check your .env.local file.');
  }
}

// サーバーサイドでのみサービスロールキーを検証
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server-side operations');
}

// シングルトンパターンでクライアントインスタンスを管理
let supabaseInstance: any = null;
let supabaseAdminInstance: any = null;

// クライアントサイド用（ブラウザ）
export const supabase = (() => {
  if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
    if (!supabaseInstance) {
      supabaseInstance = createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true
          }
        }
      );
    }
    return supabaseInstance;
  }
  return null;
})();

// サーバーサイド用（管理権限）- サーバーサイドでのみ使用
export const supabaseAdmin = (() => {
  if (typeof window === 'undefined' && supabaseUrl && supabaseServiceKey && !supabaseAdminInstance) {
    supabaseAdminInstance = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }
  return supabaseAdminInstance;
})();

// 型定義
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          updated_at?: string;
        };
      };
      dog_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          weight: number;
          activity_level: 'low' | 'medium' | 'high';
          health_conditions: string[];
          life_stage: 'puppy' | 'adult' | 'senior';
          breed: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          weight: number;
          activity_level: 'low' | 'medium' | 'high';
          health_conditions?: string[];
          life_stage: 'puppy' | 'adult' | 'senior';
          breed: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          weight?: number;
          activity_level?: 'low' | 'medium' | 'high';
          health_conditions?: string[];
          life_stage?: 'puppy' | 'adult' | 'senior';
          breed?: string;
          updated_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          cooking_time: number;
          servings: string;
          life_stage: 'puppy' | 'junior' | 'adult' | 'senior' | 'elderly';
          protein_type: 'horse_mackerel_sardine' | 'kangaroo' | 'salmon' | 'lamb' | 'beef' | 'wild_boar' | 'pork' | 'horse' | 'chicken' | 'deer';
          meal_scene: 'snack' | 'shared' | 'daily';
          difficulty: string;
          health_conditions: string[];
          ingredients: Array<{
            name: string;
            amount: string;
          }>;
          instructions: Array<{
            step: number;
            text: string;
          }>;
          status: 'draft' | 'published';
          thumbnail_url: string | null;
          main_video_id: string | null;
          main_video_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          cooking_time: number;
          servings: string;
          life_stage: 'puppy' | 'junior' | 'adult' | 'senior' | 'elderly';
          protein_type: 'horse_mackerel_sardine' | 'kangaroo' | 'salmon' | 'lamb' | 'beef' | 'wild_boar' | 'pork' | 'horse' | 'chicken' | 'deer';
          meal_scene: 'snack' | 'shared' | 'daily';
          difficulty: string;
          health_conditions?: string[];
          ingredients: Array<{
            name: string;
            amount: string;
          }>;
          instructions: Array<{
            step: number;
            text: string;
          }>;
          status?: 'draft' | 'published';
          thumbnail_url?: string | null;
          main_video_id?: string | null;
          main_video_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          cooking_time?: number;
          servings?: string;
          life_stage?: 'puppy' | 'junior' | 'adult' | 'senior' | 'elderly';
          protein_type?: 'horse_mackerel_sardine' | 'kangaroo' | 'salmon' | 'lamb' | 'beef' | 'wild_boar' | 'pork' | 'horse' | 'chicken' | 'deer';
          meal_scene?: 'snack' | 'shared' | 'daily';
          difficulty?: string;
          health_conditions?: string[];
          ingredients?: Array<{
            name: string;
            amount: string;
          }>;
          instructions?: Array<{
            step: number;
            text: string;
          }>;
          status?: 'draft' | 'published';
          thumbnail_url?: string | null;
          main_video_id?: string | null;
          main_video_url?: string | null;
          updated_at?: string;
        };
      };
      favorite_recipes: {
        Row: {
          id: string;
          user_id: string;
          recipe_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipe_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          recipe_id?: string;
        };
      };
    };
  };
}

// 型付きクライアント（既存のインスタンスを使用）
export const typedSupabase = supabase as any;
export const typedSupabaseAdmin = supabaseAdmin as any;
