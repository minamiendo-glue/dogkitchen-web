// 記事の型定義
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  recipes?: ArticleRecipe[];
}

// 特集の型定義
export interface Feature {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  recipes?: FeatureRecipe[];
  sections?: FeatureSectionData[];
}

// 特集小項目のデータ型（データベースから取得）
export interface FeatureSectionData {
  id: string;
  title: string;
  description?: string;
  display_order: number;
  recipe_ids: string[];
}

// 記事とレシピの紐づけ
export interface ArticleRecipe {
  id: string;
  article_id: string;
  recipe_id: string;
  display_order: number;
  created_at: string;
  recipe?: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image_url?: string;
  };
}

// 特集とレシピの紐づけ
export interface FeatureRecipe {
  id: string;
  feature_id: string;
  recipe_id: string;
  display_order: number;
  created_at: string;
  recipe?: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image_url?: string;
  };
}

// 記事作成・編集用の型
export interface CreateArticleData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  status: 'draft' | 'published';
  recipe_ids?: string[];
}

// 特集の小項目
export interface FeatureSection {
  id?: string;
  title: string;
  description?: string;
  recipe_ids: string[];
}

// 特集作成・編集用の型
export interface CreateFeatureData {
  title: string;
  slug: string;
  excerpt?: string;
  featured_image_url?: string;
  status: 'draft' | 'published';
  sections?: FeatureSection[];
  recipe_ids?: string[];
}

// 記事一覧用の型
export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image_url?: string;
  published_at?: string;
  created_at: string;
  recipe_count?: number;
}

