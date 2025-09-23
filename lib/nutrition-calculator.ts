// 栄養価計算ライブラリ
// 材料名から栄養価を取得し、分量に基づいて計算する
// 愛犬のプロフィールに基づく個別栄養計算機能を含む

export interface NutritionData {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
}

export interface IngredientNutrition {
  name: string;
  amount: string;
  nutrition: NutritionData;
}

// 愛犬のプロフィール情報
export interface DogProfile {
  id?: string;
  name: string;
  weight: number; // kg
  lifeStage: 'puppy' | 'adult' | 'senior';
  activityLevel: 'low' | 'medium' | 'high';
  healthConditions?: string[];
  breed?: string;
}

// 愛犬の必要栄養素
export interface DogNutritionRequirements {
  dailyCalories: number;
  dailyProtein: number; // g
  dailyFat: number; // g
  dailyCarbs: number; // g
  perMealCalories: number;
  perMealProtein: number; // g
  perMealFat: number; // g
  perMealCarbs: number; // g
}

// 調整されたレシピ材料
export interface AdjustedIngredient {
  name: string;
  originalAmount: string;
  adjustedAmount: string;
  nutrition: NutritionData;
}

// USDA Food Database APIを使用した栄養価取得
async function fetchNutritionFromUSDA(foodName: string): Promise<NutritionData | null> {
  try {
    // USDA Food Database APIのエンドポイント
    const apiKey = process.env.USDA_API_KEY;
    if (!apiKey) {
      console.warn('USDA_API_KEY is not set, using fallback nutrition data');
      return getFallbackNutrition(foodName);
    }

    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(foodName)}&api_key=${apiKey}&pageSize=1`
    );

    if (!response.ok) {
      console.warn(`USDA API request failed for ${foodName}: ${response.status}`);
      return getFallbackNutrition(foodName);
    }

    const data = await response.json();
    
    if (!data.foods || data.foods.length === 0) {
      console.warn(`No nutrition data found for ${foodName}`);
      return getFallbackNutrition(foodName);
    }

    const food = data.foods[0];
    const nutrients = food.foodNutrients || [];

    // 栄養素を取得（100gあたりの値）
    const getNutrientValue = (nutrientId: number): number => {
      const nutrient = nutrients.find((n: any) => n.nutrientId === nutrientId);
      return nutrient ? (nutrient.value || 0) : 0;
    };

    return {
      calories: getNutrientValue(1008), // Energy (kcal)
      protein: getNutrientValue(1003),  // Protein
      fat: getNutrientValue(1004),      // Total lipid (fat)
      carbs: getNutrientValue(1005),    // Carbohydrate, by difference
      fiber: getNutrientValue(1079)     // Fiber, total dietary
    };
  } catch (error) {
    console.error(`Error fetching nutrition for ${foodName}:`, error);
    return getFallbackNutrition(foodName);
  }
}

// フォールバック用の栄養価データ（日本の一般的な食材）
function getFallbackNutrition(foodName: string): NutritionData {
  const fallbackData: Record<string, NutritionData> = {
    // 肉類
    '鶏むね肉': { calories: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0 },
    '鶏もも肉': { calories: 200, protein: 18, fat: 14, carbs: 0, fiber: 0 },
    '鶏砂肝': { calories: 100, protein: 20, fat: 2, carbs: 0, fiber: 0 },
    '牛肉': { calories: 250, protein: 26, fat: 15, carbs: 0, fiber: 0 },
    '豚肉': { calories: 242, protein: 22, fat: 16, carbs: 0, fiber: 0 },
    'サーモン': { calories: 208, protein: 25, fat: 12, carbs: 0, fiber: 0 },
    'トビウオ': { calories: 120, protein: 25, fat: 2, carbs: 0, fiber: 0 },
    
    // 野菜類
    'にんじん': { calories: 37, protein: 0.9, fat: 0.2, carbs: 8.8, fiber: 2.8 },
    '玉ねぎ': { calories: 37, protein: 1.0, fat: 0.1, carbs: 8.8, fiber: 1.6 },
    'じゃがいも': { calories: 76, protein: 2.0, fat: 0.1, carbs: 17.6, fiber: 1.3 },
    'キャベツ': { calories: 23, protein: 1.3, fat: 0.2, carbs: 5.2, fiber: 1.8 },
    'ブロッコリー': { calories: 33, protein: 4.3, fat: 0.4, carbs: 5.2, fiber: 4.4 },
    'ほうれん草': { calories: 20, protein: 2.2, fat: 0.3, carbs: 2.0, fiber: 2.8 },
    
    // 穀物類
    '米': { calories: 356, protein: 6.1, fat: 0.9, carbs: 77.1, fiber: 0.5 },
    '白米': { calories: 356, protein: 6.1, fat: 0.9, carbs: 77.1, fiber: 0.5 },
    '玄米': { calories: 350, protein: 6.8, fat: 2.7, carbs: 70.6, fiber: 3.0 },
    'オートミール': { calories: 389, protein: 16.9, fat: 6.9, carbs: 66.3, fiber: 10.6 },
    
    // その他
    '卵': { calories: 155, protein: 13, fat: 11, carbs: 1.1, fiber: 0 },
    '牛乳': { calories: 42, protein: 3.3, fat: 1.0, carbs: 4.8, fiber: 0 },
    'ヨーグルト': { calories: 59, protein: 3.6, fat: 0.1, carbs: 4.7, fiber: 0 },
  };

  // 部分一致で検索
  const normalizedName = foodName.toLowerCase().trim();
  for (const [key, value] of Object.entries(fallbackData)) {
    if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
      return value;
    }
  }

  // デフォルト値（一般的な食材の平均値）
  return {
    calories: 100,
    protein: 5,
    fat: 3,
    carbs: 15,
    fiber: 2
  };
}

// 分量文字列を数値に変換する関数
function parseAmount(amount: string): number {
  if (!amount) return 0;
  
  // 分数の処理（例：1/2 → 0.5）
  const fractionMatch = amount.match(/(\d+)\/(\d+)/);
  if (fractionMatch) {
    const numerator = parseFloat(fractionMatch[1]);
    const denominator = parseFloat(fractionMatch[2]);
    return numerator / denominator;
  }
  
  // 通常の数字を抽出
  const match = amount.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  
  return parseFloat(match[1]);
}

// 単位をgに変換する関数
function convertToGrams(amount: number, unit: string): number {
  const unitMap: Record<string, number> = {
    'g': 1,
    'kg': 1000,
    'ml': 1, // 液体は概算で1ml = 1g
    'l': 1000,
    'cc': 1,
    '個': 50, // 一般的な食材の平均重量
    '枚': 20,
    '本': 30,
    '尾': 100, // 魚1尾の平均重量
    '束': 100,
    'パック': 200,
    '缶': 150,
    '大さじ': 15,
    '小さじ': 5,
    'カップ': 200,
    '合': 150
  };

  const normalizedUnit = unit.toLowerCase().trim();
  const multiplier = unitMap[normalizedUnit] || 1;
  
  return amount * multiplier;
}

// 材料の栄養価を計算する関数
export async function calculateIngredientNutrition(
  name: string, 
  amount: string
): Promise<IngredientNutrition> {
  // 分量を解析
  const amountValue = parseAmount(amount);
  const unit = amount.replace(/\d+(?:\.\d+)?/, '').trim();
  const grams = convertToGrams(amountValue, unit);

  // 栄養価を取得（100gあたり）
  const nutritionPer100g = await fetchNutritionFromUSDA(name);
  
  if (!nutritionPer100g) {
    throw new Error(`栄養価データを取得できませんでした: ${name}`);
  }

  // 実際の分量に基づいて計算
  const nutrition: NutritionData = {
    calories: Math.round((nutritionPer100g.calories * grams) / 100),
    protein: Math.round((nutritionPer100g.protein * grams) / 100 * 10) / 10,
    fat: Math.round((nutritionPer100g.fat * grams) / 100 * 10) / 10,
    carbs: Math.round((nutritionPer100g.carbs * grams) / 100 * 10) / 10,
    fiber: Math.round((nutritionPer100g.fiber * grams) / 100 * 10) / 10
  };

  return {
    name,
    amount,
    nutrition
  };
}

// レシピ全体の栄養価を計算する関数
export async function calculateRecipeNutrition(
  ingredients: Array<{ name: string; amount: string }>
): Promise<NutritionData> {
  console.log('Starting nutrition calculation for ingredients:', ingredients);
  
  const totalNutrition: NutritionData = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0
  };

  if (!ingredients || ingredients.length === 0) {
    console.log('No ingredients provided, returning zero nutrition');
    return totalNutrition;
  }

  for (const ingredient of ingredients) {
    try {
      console.log(`Calculating nutrition for: ${ingredient.name} (${ingredient.amount})`);
      
      // 材料名と分量が存在するかチェック
      if (!ingredient.name || !ingredient.amount) {
        console.warn(`Skipping ingredient with missing data:`, ingredient);
        continue;
      }

      const ingredientNutrition = await calculateIngredientNutrition(
        ingredient.name, 
        ingredient.amount
      );
      
      console.log(`Nutrition for ${ingredient.name}:`, ingredientNutrition.nutrition);
      
      totalNutrition.calories += ingredientNutrition.nutrition.calories;
      totalNutrition.protein += ingredientNutrition.nutrition.protein;
      totalNutrition.fat += ingredientNutrition.nutrition.fat;
      totalNutrition.carbs += ingredientNutrition.nutrition.carbs;
      totalNutrition.fiber += ingredientNutrition.nutrition.fiber;
    } catch (error) {
      console.error(`Error calculating nutrition for ${ingredient.name}:`, error);
      console.error('Ingredient data:', ingredient);
      // エラーが発生した材料はスキップして続行
    }
  }

  console.log('Total calculated nutrition:', totalNutrition);

  // 小数点以下を適切に丸める
  const result = {
    calories: Math.round(totalNutrition.calories),
    protein: Math.round(totalNutrition.protein * 10) / 10,
    fat: Math.round(totalNutrition.fat * 10) / 10,
    carbs: Math.round(totalNutrition.carbs * 10) / 10,
    fiber: Math.round(totalNutrition.fiber * 10) / 10
  };

  console.log('Final nutrition result:', result);
  return result;
}

// 愛犬の必要栄養素を計算する関数
export function calculateDogNutritionRequirements(dogProfile: DogProfile): DogNutritionRequirements {
  const { weight, lifeStage, activityLevel } = dogProfile;
  
  // 基礎代謝率（RER: Resting Energy Requirement）を計算
  // RER = 70 × (体重kg)^0.75
  const rer = 70 * Math.pow(weight, 0.75);
  
  // ライフステージ係数
  const lifeStageMultipliers = {
    puppy: 2.0,  // 子犬は成長期のため高い
    adult: 1.0,  // 成犬は標準
    senior: 0.8  // シニアは活動量が少ない
  };
  
  // 活動量係数
  const activityMultipliers = {
    low: 1.0,    // 室内犬、運動不足
    medium: 1.2, // 適度な運動
    high: 1.4    // 活発な運動
  };
  
  // 1日の必要カロリーを計算
  const dailyCalories = Math.round(rer * lifeStageMultipliers[lifeStage] * activityMultipliers[activityLevel]);
  
  // 栄養素の比率（体重1kgあたり）
  const proteinPerKg = {
    puppy: 4.0,  // 子犬は高タンパク質
    adult: 2.5,  // 成犬は標準
    senior: 2.0  // シニアは控えめ
  };
  
  const fatPerKg = {
    puppy: 2.0,
    adult: 1.5,
    senior: 1.2
  };
  
  const carbsPerKg = {
    puppy: 3.0,
    adult: 2.0,
    senior: 1.5
  };
  
  // 1日の必要栄養素（g）
  const dailyProtein = Math.round(weight * proteinPerKg[lifeStage] * 10) / 10;
  const dailyFat = Math.round(weight * fatPerKg[lifeStage] * 10) / 10;
  const dailyCarbs = Math.round(weight * carbsPerKg[lifeStage] * 10) / 10;
  
  // 1食分の栄養素（1日2食と仮定）
  const perMealCalories = Math.round(dailyCalories / 2);
  const perMealProtein = Math.round(dailyProtein / 2 * 10) / 10;
  const perMealFat = Math.round(dailyFat / 2 * 10) / 10;
  const perMealCarbs = Math.round(dailyCarbs / 2 * 10) / 10;
  
  return {
    dailyCalories,
    dailyProtein,
    dailyFat,
    dailyCarbs,
    perMealCalories,
    perMealProtein,
    perMealFat,
    perMealCarbs
  };
}

// レシピの分量を愛犬の必要栄養素に合わせて調整する関数
export async function adjustRecipeForDog(
  ingredients: Array<{ name: string; amount: string }>,
  dogProfile: DogProfile
): Promise<{
  adjustedIngredients: AdjustedIngredient[];
  totalNutrition: NutritionData;
  requirements: DogNutritionRequirements;
  adjustmentRatio: number;
}> {
  console.log('Adjusting recipe for dog:', dogProfile.name);
  
  // 愛犬の必要栄養素を計算
  const requirements = calculateDogNutritionRequirements(dogProfile);
  console.log('Dog nutrition requirements:', requirements);
  
  // 元のレシピの栄養価を計算
  const originalNutrition = await calculateRecipeNutrition(ingredients);
  console.log('Original recipe nutrition:', originalNutrition);
  
  // 調整比率を計算（カロリー基準）
  const adjustmentRatio = requirements.perMealCalories / originalNutrition.calories;
  console.log('Adjustment ratio:', adjustmentRatio);
  
  // 各材料の分量を調整
  const adjustedIngredients: AdjustedIngredient[] = [];
  
  for (const ingredient of ingredients) {
    try {
      // 元の材料の栄養価を計算
      const originalIngredientNutrition = await calculateIngredientNutrition(
        ingredient.name,
        ingredient.amount
      );
      
      // 調整された分量を計算
      const originalAmountValue = parseAmount(ingredient.amount);
      const unit = ingredient.amount.replace(/\d+(?:\.\d+)?/, '').trim();
      const adjustedAmountValue = originalAmountValue * adjustmentRatio;
      
      // 調整された分量の文字列を作成
      let adjustedAmount: string;
      if (adjustedAmountValue < 1) {
        adjustedAmount = `${Math.round(adjustedAmountValue * 100) / 100}${unit}`;
      } else if (adjustedAmountValue < 10) {
        adjustedAmount = `${Math.round(adjustedAmountValue * 10) / 10}${unit}`;
      } else {
        adjustedAmount = `${Math.round(adjustedAmountValue)}${unit}`;
      }
      
      // 調整された栄養価を計算
      const adjustedNutrition: NutritionData = {
        calories: Math.round(originalIngredientNutrition.nutrition.calories * adjustmentRatio),
        protein: Math.round(originalIngredientNutrition.nutrition.protein * adjustmentRatio * 10) / 10,
        fat: Math.round(originalIngredientNutrition.nutrition.fat * adjustmentRatio * 10) / 10,
        carbs: Math.round(originalIngredientNutrition.nutrition.carbs * adjustmentRatio * 10) / 10,
        fiber: Math.round(originalIngredientNutrition.nutrition.fiber * adjustmentRatio * 10) / 10
      };
      
      adjustedIngredients.push({
        name: ingredient.name,
        originalAmount: ingredient.amount,
        adjustedAmount,
        nutrition: adjustedNutrition
      });
      
    } catch (error) {
      console.error(`Error adjusting ingredient ${ingredient.name}:`, error);
      // エラーが発生した材料は元の分量のまま
      adjustedIngredients.push({
        name: ingredient.name,
        originalAmount: ingredient.amount,
        adjustedAmount: ingredient.amount,
        nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
      });
    }
  }
  
  // 調整後の総栄養価を計算
  const totalNutrition: NutritionData = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0
  };
  
  for (const ingredient of adjustedIngredients) {
    totalNutrition.calories += ingredient.nutrition.calories;
    totalNutrition.protein += ingredient.nutrition.protein;
    totalNutrition.fat += ingredient.nutrition.fat;
    totalNutrition.carbs += ingredient.nutrition.carbs;
    totalNutrition.fiber += ingredient.nutrition.fiber;
  }
  
  // 小数点以下を適切に丸める
  totalNutrition.calories = Math.round(totalNutrition.calories);
  totalNutrition.protein = Math.round(totalNutrition.protein * 10) / 10;
  totalNutrition.fat = Math.round(totalNutrition.fat * 10) / 10;
  totalNutrition.carbs = Math.round(totalNutrition.carbs * 10) / 10;
  totalNutrition.fiber = Math.round(totalNutrition.fiber * 10) / 10;
  
  console.log('Adjusted recipe nutrition:', totalNutrition);
  
  return {
    adjustedIngredients,
    totalNutrition,
    requirements,
    adjustmentRatio
  };
}
