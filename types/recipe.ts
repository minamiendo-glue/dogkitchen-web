// types/recipe.ts

export type LifeStage = 
  | 'puppy'      // 子犬期
  | 'adult'      // 成犬期
  | 'senior';    // シニア期

export type HealthCondition = 
  | 'balanced'        // バランスGood
  | 'summer_heat'     // 熱中症対策
  | 'kidney_care'     // 腎臓ケア
  | 'diet'            // ダイエット
  | 'weak_stomach'    // お腹が弱い
  | 'liver_care'      // 肝臓ケア
  | 'weight_gain'     // 体重増加
  | 'joint_care'      // 関節ケア
  | 'cold'            // 冷え
  | 'heart_care'      // 心臓ケア
  | 'skin_care'       // 皮膚ケア
  | 'appetite';       // 嗜好性UP

export type MealScene = 
  | 'daily'      // 日常ごはん
  | 'snack'      // おやつ
  | 'special';   // 特別な日

export type ProteinType = 
  | 'beef'                   // 牛
  | 'pork'                   // 豚
  | 'chicken'                // 鶏
  | 'horse'                  // 馬
  | 'fish'                   // 魚
  | 'kangaroo';              // カンガルー

export type ProteinColor = 'red' | 'white';

export type Difficulty = 
  | 'easy'       // 簡単
  | 'medium'     // 普通
  | 'hard';      // 難しい

export type RecipeType = 
  | 'video_steps'    // ステップ動画形式
  | 'image_plating'; // 盛り付け画像形式

export interface PlatingImage {
  url: string;
  comment: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  cookingTimeMinutes: number;
  lifeStage: LifeStage;
  healthConditions: HealthCondition[];
  proteinType: ProteinType;
  mealScene: MealScene;
  difficulty: Difficulty;
  recipeType?: RecipeType;
  videoUrl: string;
  thumbnailUrl: string;
  nutritionInfo?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  ingredients?: Array<{
    name: string;
    amount: string;
  }>;
  instructions?: string[];
  platingImages?: PlatingImage[];
  servings?: string;
  calories?: string;
  nutrition?: {
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
  };
  createdAt: Date;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  proteinType: ProteinType;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
  fiberPer100g: number;
  moisturePer100g: number;
}

// フィルター用の型
export interface RecipeFilters {
  lifeStage?: LifeStage[];
  healthConditions?: HealthCondition[];
  mealScene?: MealScene[];
  proteinType?: ProteinType[];
  difficulty?: Difficulty[];
  cookingTimeMax?: number;
  searchQuery?: string;
}

// 表示用のラベル
export const LIFE_STAGE_LABELS: Record<LifeStage, string> = {
  puppy: '子犬期',
  adult: '成犬期',
  senior: 'シニア期'
};

export const HEALTH_CONDITION_LABELS: Record<HealthCondition, string> = {
  balanced: 'バランスGood',
  summer_heat: '熱中症対策',
  kidney_care: '腎臓ケア',
  diet: 'ダイエット',
  weak_stomach: 'お腹が弱い',
  liver_care: '肝臓ケア',
  weight_gain: '体重増加',
  joint_care: '関節ケア',
  cold: '冷え',
  heart_care: '心臓ケア',
  skin_care: '皮膚ケア',
  appetite: '嗜好性UP'
};

export const MEAL_SCENE_LABELS: Record<MealScene, string> = {
  daily: '日常ごはん',
  snack: 'おやつ',
  special: '特別な日'
};

export const PROTEIN_TYPE_LABELS: Record<ProteinType, string> = {
  beef: '牛',
  pork: '豚',
  chicken: '鶏',
  horse: '馬',
  fish: '魚',
  kangaroo: 'カンガルー'
};

export const PROTEIN_COLOR_MAP: Record<ProteinType, ProteinColor> = {
  beef: 'red',
  pork: 'red',
  chicken: 'white',
  horse: 'red',
  fish: 'white',
  kangaroo: 'red'
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '簡単',
  medium: '普通',
  hard: '難しい'
};