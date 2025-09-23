// components/recipe-filters.tsx
'use client';

import { useState } from 'react';
import type { RecipeFilters, LifeStage, HealthCondition, MealScene, ProteinType, Difficulty } from '@/types/recipe';
import { 
  LIFE_STAGE_LABELS, 
  HEALTH_CONDITION_LABELS, 
  MEAL_SCENE_LABELS, 
  PROTEIN_TYPE_LABELS,
  PROTEIN_COLOR_MAP,
  DIFFICULTY_LABELS
} from '@/types/recipe';

interface RecipeFiltersProps {
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
}

export function RecipeFilters({ filters, onFiltersChange }: RecipeFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = <T extends string>(
    filterType: keyof RecipeFilters,
    value: T,
    checked: boolean
  ) => {
    const currentFilters = filters[filterType] as T[] || [];
    const newFilters = checked
      ? [...currentFilters, value]
      : currentFilters.filter(item => item !== value);
    
    onFiltersChange({
      ...filters,
      [filterType]: newFilters.length > 0 ? newFilters : undefined
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: filters.searchQuery
    });
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof RecipeFilters];
    return Array.isArray(value) && value.length > 0;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">レシピを絞り込む</h2>
          {hasActiveFilters && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              フィルター適用中
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              すべてクリア
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 font-medium px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isExpanded ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                閉じる
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                詳細フィルター
              </>
            )}
          </button>
        </div>
      </div>

      {/* 検索バー */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="レシピ名や材料で検索..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      {/* フィルター項目 */}
      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden'}`}>
        {/* ライフステージ */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-lg">🐕</span>
            ライフステージ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.keys(LIFE_STAGE_LABELS) as LifeStage[]).map((stage) => (
              <label key={stage} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.lifeStage?.includes(stage) || false}
                  onChange={(e) => handleFilterChange('lifeStage', stage, e.target.checked)}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                />
                <span className="ml-3 text-sm text-gray-700 font-medium">{LIFE_STAGE_LABELS[stage]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 体の悩み */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-lg">💚</span>
            体の悩み
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {(Object.keys(HEALTH_CONDITION_LABELS) as HealthCondition[]).map((condition) => (
              <label key={condition} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.healthConditions?.includes(condition) || false}
                  onChange={(e) => handleFilterChange('healthConditions', condition, e.target.checked)}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                />
                <span className="ml-3 text-sm text-gray-700 font-medium">{HEALTH_CONDITION_LABELS[condition]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 食事シーン */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-lg">🍽️</span>
            食事シーン
          </h3>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(MEAL_SCENE_LABELS) as MealScene[]).map((scene) => (
              <label key={scene} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.mealScene?.includes(scene) || false}
                  onChange={(e) => handleFilterChange('mealScene', scene, e.target.checked)}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                />
                <span className="ml-3 text-sm text-gray-700 font-medium">{MEAL_SCENE_LABELS[scene]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* タンパク質 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-lg">🥩</span>
            タンパク質
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(Object.keys(PROTEIN_TYPE_LABELS) as ProteinType[]).map((protein) => {
              const color = PROTEIN_COLOR_MAP[protein];
              return (
                <label key={protein} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.proteinType?.includes(protein) || false}
                    onChange={(e) => handleFilterChange('proteinType', protein, e.target.checked)}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                  />
                  <span className="ml-3 text-sm text-gray-700 font-medium flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${color === 'red' ? 'bg-red-500' : 'bg-gray-300'}`} />
                    {PROTEIN_TYPE_LABELS[protein]}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 難易度 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-lg">⭐</span>
            難易度
          </h3>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((difficulty) => (
              <label key={difficulty} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.difficulty?.includes(difficulty) || false}
                  onChange={(e) => handleFilterChange('difficulty', difficulty, e.target.checked)}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                />
                <span className="ml-3 text-sm text-gray-700 font-medium">{DIFFICULTY_LABELS[difficulty]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 調理時間 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-lg">⏱️</span>
            調理時間
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              { value: 15, label: '15分以下' },
              { value: 30, label: '30分以下' },
              { value: 60, label: '1時間以下' },
              { value: 120, label: '1時間以上' }
            ].map((time) => (
              <label key={time.value} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="cookingTime"
                  checked={filters.cookingTimeMax === time.value}
                  onChange={() => onFiltersChange({ ...filters, cookingTimeMax: time.value })}
                  className="border-gray-300 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                />
                <span className="ml-3 text-sm text-gray-700 font-medium">{time.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
