'use client';

import { useState, useEffect } from 'react';
import { Recipe, Difficulty } from '@/types/recipe';

interface RecipeSearchProps {
  onRecipesChange: (recipes: Recipe[]) => void;
  selectedRecipeIds: string[];
  onSelectionChange: (recipeIds: string[]) => void;
}

interface SearchFilters {
  lifeStage: string;
  healthCondition: string;
  proteinType: string;
  mealScene: string;
  difficulty: string;
  cookingTimeMin: number | '';
  cookingTimeMax: number | '';
  caloriesMin: number | '';
  caloriesMax: number | '';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  searchText: string;
}

const LIFE_STAGES = [
  { value: '', label: 'すべて' },
  { value: 'puppy', label: '子犬期' },
  { value: 'adult', label: '成犬期' },
  { value: 'senior', label: 'シニア期' }
];

const HEALTH_CONDITIONS = [
  { value: '', label: 'すべて' },
  { value: 'balanced', label: 'バランスGood' },
  { value: 'summer_heat', label: '熱中症対策' },
  { value: 'kidney_care', label: '腎臓ケア' },
  { value: 'diet', label: 'ダイエット' },
  { value: 'weak_stomach', label: 'お腹が弱い' },
  { value: 'liver_care', label: '肝臓ケア' },
  { value: 'weight_gain', label: '体重増加' },
  { value: 'joint_care', label: '関節ケア' },
  { value: 'cold', label: '冷え' },
  { value: 'heart_care', label: '心臓ケア' },
  { value: 'skin_care', label: '皮膚ケア' },
  { value: 'appetite', label: '嗜好性UP' }
];

const PROTEIN_TYPES = [
  { value: '', label: 'すべて' },
  { value: 'beef', label: '牛' },
  { value: 'pork', label: '豚' },
  { value: 'chicken', label: '鶏' },
  { value: 'horse', label: '馬' },
  { value: 'fish', label: '魚' },
  { value: 'kangaroo', label: 'カンガルー' }
];

const MEAL_SCENES = [
  { value: '', label: 'すべて' },
  { value: 'daily', label: '日常ごはん' },
  { value: 'snack', label: 'おやつ' },
  { value: 'special', label: '特別な日' }
];

const DIFFICULTIES = [
  { value: '', label: 'すべて' },
  { value: 'easy', label: '簡単' },
  { value: 'medium', label: '普通' },
  { value: 'hard', label: '難しい' }
];

const SORT_OPTIONS = [
  { value: 'created_at', label: '作成日' },
  { value: 'title', label: 'タイトル' },
  { value: 'cooking_time', label: '調理時間' },
  { value: 'calories', label: 'カロリー' }
];

export default function RecipeSearch({ onRecipesChange, selectedRecipeIds, onSelectionChange }: RecipeSearchProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    lifeStage: '',
    healthCondition: '',
    proteinType: '',
    mealScene: '',
    difficulty: '',
    cookingTimeMin: '',
    cookingTimeMax: '',
    caloriesMin: '',
    caloriesMax: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    searchText: ''
  });

  // レシピ一覧を取得
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error('レシピ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // フィルタリングとソート
  const applyFilters = () => {
    let filtered = [...recipes];

    // テキスト検索
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.description?.toLowerCase().includes(searchLower)
      );
    }

    // ライフステージ
    if (filters.lifeStage) {
      filtered = filtered.filter(recipe => recipe.lifeStage === filters.lifeStage);
    }

    // 健康状態
    if (filters.healthCondition) {
      filtered = filtered.filter(recipe => recipe.healthCondition === filters.healthCondition);
    }

    // タンパク質タイプ
    if (filters.proteinType) {
      filtered = filtered.filter(recipe => recipe.proteinType === filters.proteinType);
    }

    // 食事シーン
    if (filters.mealScene) {
      filtered = filtered.filter(recipe => recipe.mealScene === filters.mealScene);
    }

    // 難易度
    if (filters.difficulty) {
      filtered = filtered.filter(recipe => recipe.difficulty === filters.difficulty);
    }

    // 調理時間
    if (filters.cookingTimeMin !== '') {
      filtered = filtered.filter(recipe => recipe.cookingTimeMinutes >= Number(filters.cookingTimeMin));
    }
    if (filters.cookingTimeMax !== '') {
      filtered = filtered.filter(recipe => recipe.cookingTimeMinutes <= Number(filters.cookingTimeMax));
    }

    // カロリー
    if (filters.caloriesMin !== '') {
      filtered = filtered.filter(recipe => recipe.calories >= Number(filters.caloriesMin));
    }
    if (filters.caloriesMax !== '') {
      filtered = filtered.filter(recipe => recipe.calories <= Number(filters.caloriesMax));
    }

    // ソート
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'cooking_time':
          aValue = a.cookingTimeMinutes;
          bValue = b.cookingTimeMinutes;
          break;
        case 'calories':
          aValue = a.calories;
          bValue = b.calories;
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredRecipes(filtered);
    onRecipesChange(filtered);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, recipes]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRecipeToggle = (recipeId: string) => {
    const newSelection = selectedRecipeIds.includes(recipeId)
      ? selectedRecipeIds.filter(id => id !== recipeId)
      : [...selectedRecipeIds, recipeId];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedRecipeIds.length === filteredRecipes.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredRecipes.map(recipe => recipe.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* 検索・フィルター */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">レシピ検索・フィルター</h3>
        
        {/* テキスト検索 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            テキスト検索
          </label>
          <input
            type="text"
            value={filters.searchText}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            placeholder="レシピ名や説明で検索..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* フィルター */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ライフステージ</label>
            <select
              value={filters.lifeStage}
              onChange={(e) => handleFilterChange('lifeStage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {LIFE_STAGES.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">健康状態</label>
            <select
              value={filters.healthCondition}
              onChange={(e) => handleFilterChange('healthCondition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {HEALTH_CONDITIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">タンパク質タイプ</label>
            <select
              value={filters.proteinType}
              onChange={(e) => handleFilterChange('proteinType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {PROTEIN_TYPES.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">食事シーン</label>
            <select
              value={filters.mealScene}
              onChange={(e) => handleFilterChange('mealScene', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {MEAL_SCENES.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">難易度</label>
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {DIFFICULTIES.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">調理時間（分）</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={filters.cookingTimeMin}
                onChange={(e) => handleFilterChange('cookingTimeMin', e.target.value ? Number(e.target.value) : '')}
                placeholder="最小"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="flex items-center">〜</span>
              <input
                type="number"
                value={filters.cookingTimeMax}
                onChange={(e) => handleFilterChange('cookingTimeMax', e.target.value ? Number(e.target.value) : '')}
                placeholder="最大"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カロリー</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={filters.caloriesMin}
                onChange={(e) => handleFilterChange('caloriesMin', e.target.value ? Number(e.target.value) : '')}
                placeholder="最小"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="flex items-center">〜</span>
              <input
                type="number"
                value={filters.caloriesMax}
                onChange={(e) => handleFilterChange('caloriesMax', e.target.value ? Number(e.target.value) : '')}
                placeholder="最大"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* ソート */}
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">並び替え</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">順序</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="asc">昇順</option>
              <option value="desc">降順</option>
            </select>
          </div>
        </div>
      </div>

      {/* レシピ一覧 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            レシピ一覧 ({filteredRecipes.length}件)
          </h3>
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {selectedRecipeIds.length === filteredRecipes.length ? '全て解除' : '全て選択'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipes.map(recipe => (
              <div
                key={recipe.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedRecipeIds.includes(recipe.id)
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleRecipeToggle(recipe.id)}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedRecipeIds.includes(recipe.id)}
                    onChange={() => handleRecipeToggle(recipe.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{recipe.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{recipe.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {recipe.lifeStage}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        {recipe.proteinType}
                      </span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        {recipe.difficulty}
                      </span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        {recipe.cookingTimeMinutes}分
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {recipe.calories}kcal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredRecipes.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">条件に一致するレシピが見つかりませんでした。</p>
          </div>
        )}
      </div>
    </div>
  );
}
