// lib/utils/recipe-filter.ts
import type { Recipe, RecipeFilters } from '@/types/recipe';

export function filterRecipes(recipes: Recipe[], filters: RecipeFilters): Recipe[] {
  return recipes.filter(recipe => {
    // 検索クエリ
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = recipe.title.toLowerCase().includes(query);
      const matchesDescription = recipe.description.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) return false;
    }

    // ライフステージ
    if (filters.lifeStage && filters.lifeStage.length > 0) {
      if (!filters.lifeStage.includes(recipe.lifeStage)) return false;
    }

    // 体の悩み
    if (filters.healthConditions && filters.healthConditions.length > 0) {
      const hasMatchingCondition = recipe.healthConditions.some(condition =>
        filters.healthConditions!.includes(condition)
      );
      if (!hasMatchingCondition) return false;
    }

    // 食事シーン
    if (filters.mealScene && filters.mealScene.length > 0) {
      if (!filters.mealScene.includes(recipe.mealScene)) return false;
    }

    // 難易度
    if (filters.difficulty && filters.difficulty.length > 0) {
      if (!filters.difficulty.includes(recipe.difficulty)) return false;
    }

    // タンパク質
    if (filters.proteinType && filters.proteinType.length > 0) {
      if (!filters.proteinType.includes(recipe.proteinType)) return false;
    }

    // 調理時間
    if (filters.cookingTimeMax) {
      if (recipe.cookingTimeMinutes > filters.cookingTimeMax) return false;
    }

    return true;
  });
}

export function getActiveFilterCount(filters: RecipeFilters): number {
  let count = 0;
  
  if (filters.searchQuery) count++;
  if (filters.lifeStage && filters.lifeStage.length > 0) count++;
  if (filters.healthConditions && filters.healthConditions.length > 0) count++;
  if (filters.mealScene && filters.mealScene.length > 0) count++;
  if (filters.proteinType && filters.proteinType.length > 0) count++;
  if (filters.cookingTimeMax) count++;
  
  return count;
}


