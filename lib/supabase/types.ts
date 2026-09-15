// lib/supabase/types.ts
// TypeScript types matching the Supabase schema exactly.
// Keep this in sync with supabase/schema.sql

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
      categories: {
        Relationships: [];
        Row: {
          id: string;
          name: string;
          slug: string;
          space: string | null;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          space?: string | null;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          space?: string | null;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      products: {
        Relationships: [{ foreignKeyName: 'products_category_id_fkey'; columns: ['category_id']; isOneToOne: false; referencedRelation: 'categories'; referencedColumns: ['id'] }];
        Row: {
          id: string;
          sku: string | null;
          name: string;
          slug: string;
          category_id: string | null;
          space: string | null;
          description: string | null;
          short_description: string | null;
          materials: string[];
          finish: string | null;
          width_mm: string | null;
          depth_mm: string | null;
          height_mm: string | null;
          customizable: boolean;
          featured: boolean;
          is_active: boolean;
          price_display: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sku?: string | null;
          name: string;
          slug: string;
          category_id?: string | null;
          space?: string | null;
          description?: string | null;
          short_description?: string | null;
          materials?: string[];
          finish?: string | null;
          width_mm?: string | null;
          depth_mm?: string | null;
          height_mm?: string | null;
          customizable?: boolean;
          featured?: boolean;
          is_active?: boolean;
          price_display?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sku?: string | null;
          name?: string;
          slug?: string;
          category_id?: string | null;
          space?: string | null;
          description?: string | null;
          short_description?: string | null;
          materials?: string[];
          finish?: string | null;
          width_mm?: string | null;
          depth_mm?: string | null;
          height_mm?: string | null;
          customizable?: boolean;
          featured?: boolean;
          is_active?: boolean;
          price_display?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
      product_images: {
        Relationships: [{ foreignKeyName: 'product_images_product_id_fkey'; columns: ['product_id']; isOneToOne: false; referencedRelation: 'products'; referencedColumns: ['id'] }];
        Row: {
          id: string;
          product_id: string;
          cloudinary_public_id: string;
          secure_url: string | null;
          sort_order: number;
          is_primary: boolean;
          alt_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          cloudinary_public_id: string;
          secure_url?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          alt_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          cloudinary_public_id?: string;
          secure_url?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          alt_text?: string | null;
        };
      };
      user_roles: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          role: 'admin' | 'viewer';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: 'admin' | 'viewer';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'admin' | 'viewer';
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}

// ─── Convenience row types ────────────────────────────────────
export type Category     = Database['public']['Tables']['categories']['Row'];
export type Product      = Database['public']['Tables']['products']['Row'];
export type ProductImage = Database['public']['Tables']['product_images']['Row'];
export type UserRole     = Database['public']['Tables']['user_roles']['Row'];

// ─── Product with joined images (used in most UI queries) ─────
export type ProductWithImages = Product & {
  product_images: ProductImage[];
  categories: Pick<Category, 'name' | 'slug'> | null;
};
