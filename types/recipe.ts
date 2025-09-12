// types/recipe.ts
export type WPFeaturedMedia = {
  source_url?: string;
};

export type WPRecipe = {
  id: number;
  slug: string;
  title: { rendered: string };
  content?: { rendered: string };
  excerpt?: { rendered: string };
  _embedded?: {
    ['wp:featuredmedia']?: WPFeaturedMedia[];
  };
};
