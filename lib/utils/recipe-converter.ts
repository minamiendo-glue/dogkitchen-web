// 共通のレシピデータ変換関数

// Supabaseのレシピ型定義
export interface SupabaseRecipe {
  id: string;
  title: string;
  description: string;
  cooking_time: number;
  servings: string;
  life_stage: string;
  protein_type: string;
  meal_scene: string;
  difficulty: string;
  health_conditions?: string[];
  thumbnail_url?: string;
  main_video_id?: string;
  main_video_url?: string;
  ingredients?: any[];
  instructions?: any[];
  nutrition_info?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    calculated_at: string;
  };
}

// 変換後のレシピ型
export interface ConvertedRecipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  cookingTimeMinutes: number;
  lifeStage: string;
  healthConditions: string[];
  proteinType: string;
  mealScene: string;
  videoUrl: string;
  thumbnailUrl: string;
  servings: string;
  difficulty: string;
  ingredients: any[];
  instructions: any[];
  nutritionInfo: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    calculated_at: string | null;
  };
  createdAt: Date;
}

// Supabaseのデータを共通のRecipe型に変換する関数
export function convertSupabaseToRecipe(supabaseRecipe: SupabaseRecipe): ConvertedRecipe {
  return {
    id: supabaseRecipe.id,
    title: supabaseRecipe.title,
    slug: supabaseRecipe.id, // IDをslugとして使用（日本語タイトルのため）
    description: supabaseRecipe.description,
    cookingTimeMinutes: supabaseRecipe.cooking_time,
    lifeStage: supabaseRecipe.life_stage,
    healthConditions: supabaseRecipe.health_conditions || [],
    proteinType: supabaseRecipe.protein_type,
    mealScene: supabaseRecipe.meal_scene,
    videoUrl: supabaseRecipe.main_video_url || '',
    thumbnailUrl: supabaseRecipe.thumbnail_url || '',
    servings: supabaseRecipe.servings,
    difficulty: supabaseRecipe.difficulty,
    ingredients: supabaseRecipe.ingredients || [],
    instructions: supabaseRecipe.instructions || [],
    nutritionInfo: supabaseRecipe.nutrition_info || {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      fiber: 0,
      calculated_at: null
    },
    createdAt: new Date()
  };
}
