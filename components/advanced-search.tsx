'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { LifeStage, HealthCondition, ProteinType, MealScene, Difficulty } from '@/types/recipe';

interface SearchFilters {
  query: string;
  lifeStage: LifeStage[];
  healthConditions: HealthCondition[];
  proteinType: ProteinType[];
  mealScene: MealScene[];
  difficulty: Difficulty[];
  cookingTimeMin: number | null;
  cookingTimeMax: number | null;
  caloriesMin: number | null;
  caloriesMax: number | null;
  sortBy: 'relevance' | 'cookingTime' | 'calories' | 'newest';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onFiltersChange?: (filters: SearchFilters) => void;
  showSearchButton?: boolean;
}

interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
}

const LIFE_STAGES = [
  { value: 'puppy', label: '子犬期' },
  { value: 'junior', label: 'ジュニア期' },
  { value: 'adult', label: '成犬期' },
  { value: 'senior', label: 'シニア期' },
  { value: 'elderly', label: '老年期' }
];

const HEALTH_CONDITIONS = [
  { value: 'weak_stomach', label: 'お腹が弱い' },
  { value: 'diet', label: 'ダイエット' },
  { value: 'balanced', label: 'バランスGood' },
  { value: 'cold', label: '冷え' },
  { value: 'appetite', label: '嗜好性UP' },
  { value: 'summer_heat', label: '夏バテ' },
  { value: 'heart_care', label: '心臓ケア' },
  { value: 'urinary_care', label: '泌尿器ケア' },
  { value: 'diabetes_care', label: '糖尿ケア' },
  { value: 'kidney_care', label: '腎臓ケア' },
  { value: 'joint_care', label: '関節ケア' },
  { value: 'fighting_disease', label: '闘病応援!' }
];

const PROTEIN_TYPES = [
  { value: 'red', label: '赤身肉' },
  { value: 'white', label: '白身肉' }
];

const MEAL_SCENES = [
  { value: 'daily', label: '日常ご飯' },
  { value: 'snack', label: 'おやつ' },
  { value: 'shared', label: 'おんなじご飯' },
  { value: 'special', label: '特別な日' }
];

const SORT_OPTIONS = [
  { value: 'relevance', label: '関連度順' },
  { value: 'cookingTime', label: '調理時間順' },
  { value: 'calories', label: 'カロリー順' },
  { value: 'newest', label: '新着順' }
];

export function AdvancedSearch({ onFiltersChange, showSearchButton = true }: AdvancedSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    lifeStage: (searchParams.getAll('lifeStage') as LifeStage[]) || [],
    healthConditions: (searchParams.getAll('healthConditions') as HealthCondition[]) || [],
    proteinType: (searchParams.getAll('proteinType') as ProteinType[]) || [],
    mealScene: (searchParams.getAll('mealScene') as MealScene[]) || [],
    difficulty: (searchParams.getAll('difficulty') as Difficulty[]) || [],
    cookingTimeMin: searchParams.get('cookingTimeMin') ? parseInt(searchParams.get('cookingTimeMin')!) : null,
    cookingTimeMax: searchParams.get('cookingTimeMax') ? parseInt(searchParams.get('cookingTimeMax')!) : null,
    caloriesMin: searchParams.get('caloriesMin') ? parseInt(searchParams.get('caloriesMin')!) : null,
    caloriesMax: searchParams.get('caloriesMax') ? parseInt(searchParams.get('caloriesMax')!) : null,
    sortBy: (searchParams.get('sortBy') as any) || 'relevance',
    sortOrder: (searchParams.get('sortOrder') as any) || 'asc'
  });

  // 検索履歴を読み込み
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // 検索候補を生成（実際の実装ではAPIから取得）
  useEffect(() => {
    if (filters.query.length > 1) {
      const mockSuggestions = [
        'チキンと野菜のヘルシーご飯',
        '牛肉とさつまいものシチュー',
        'サーモンとブロッコリーのおやつ',
        '馬肉と人参のヘルシー丼',
        '鶏むね肉',
        'さつまいも',
        'ブロッコリー'
      ].filter(item => 
        item.toLowerCase().includes(filters.query.toLowerCase())
      );
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [filters.query]);

  // リアルタイム絞り込み機能
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters]); // onFiltersChangeを依存配列から除外

  const handleSearch = () => {
    // 検索履歴に追加
    if (filters.query.trim()) {
      const newHistory: SearchHistory = {
        id: Date.now().toString(),
        query: filters.query.trim(),
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [newHistory, ...searchHistory.slice(0, 9)]; // 最新10件を保持
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    }

    // URLパラメータを構築
    const params = new URLSearchParams();
    if (filters.query.trim()) params.set('q', filters.query.trim());
    filters.lifeStage.forEach(stage => params.append('lifeStage', stage));
    filters.healthConditions.forEach(condition => params.append('healthConditions', condition));
    filters.proteinType.forEach(type => params.append('proteinType', type));
    filters.mealScene.forEach(scene => params.append('mealScene', scene));
    if (filters.cookingTimeMin !== null) params.set('cookingTimeMin', filters.cookingTimeMin.toString());
    if (filters.cookingTimeMax !== null) params.set('cookingTimeMax', filters.cookingTimeMax.toString());
    if (filters.caloriesMin !== null) params.set('caloriesMin', filters.caloriesMin.toString());
    if (filters.caloriesMax !== null) params.set('caloriesMax', filters.caloriesMax.toString());
    params.set('sortBy', filters.sortBy);
    params.set('sortOrder', filters.sortOrder);

    // 検索結果ページに遷移
    router.push(`/search?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFilters(prev => ({ ...prev, query: suggestion }));
    setShowSuggestions(false);
  };

  const handleHistoryClick = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
    setShowHistory(false);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      lifeStage: [],
      healthConditions: [],
      proteinType: [],
      mealScene: [],
      difficulty: [],
      cookingTimeMin: null,
      cookingTimeMax: null,
      caloriesMin: null,
      caloriesMax: null,
      sortBy: 'relevance',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = filters.lifeStage.length > 0 || 
    filters.healthConditions.length > 0 || 
    filters.proteinType.length > 0 ||
    filters.mealScene.length > 0 ||
    filters.difficulty.length > 0 ||
    filters.cookingTimeMin !== null ||
    filters.cookingTimeMax !== null ||
    filters.caloriesMin !== null ||
    filters.caloriesMax !== null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* メイン検索バー */}
      <div className="relative">
        <div className="flex">
          <div className="relative flex-1">
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              onFocus={() => setShowSuggestions(filters.query.length > 1)}
              placeholder="レシピ名や材料名で検索..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-red-500 text-white rounded-r-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            検索
          </button>
        </div>

        {/* 検索候補 */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* 検索履歴 */}
        {showHistory && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="px-4 py-2 border-b border-gray-100 text-sm font-medium text-gray-700">
              最近の検索
            </div>
            {searchHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => handleHistoryClick(item.query)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 last:rounded-b-lg"
              >
                {item.query}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 高度な検索オプション */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">高度な検索オプション</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
              フィルター適用中
            </span>
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* ライフステージ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ライフステージ
                </label>
                <div className="space-y-1">
                  {LIFE_STAGES.map((stage) => (
                    <label key={stage.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.lifeStage.includes(stage.value as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              lifeStage: [...prev.lifeStage, stage.value as any]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              lifeStage: prev.lifeStage.filter(s => s !== stage.value)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{stage.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 健康状態 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  健康状態
                </label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {HEALTH_CONDITIONS.map((condition) => (
                    <label key={condition.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.healthConditions.includes(condition.value as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              healthConditions: [...prev.healthConditions, condition.value as any]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              healthConditions: prev.healthConditions.filter(c => c !== condition.value)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{condition.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* タンパク質タイプ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タンパク質タイプ
                </label>
                <div className="space-y-1">
                  {PROTEIN_TYPES.map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.proteinType.includes(type.value as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              proteinType: [...prev.proteinType, type.value as any]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              proteinType: prev.proteinType.filter(t => t !== type.value)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 利用シーン */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  利用シーン
                </label>
                <div className="space-y-1">
                  {MEAL_SCENES.map((scene) => (
                    <label key={scene.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.mealScene.includes(scene.value as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              mealScene: [...prev.mealScene, scene.value as any]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              mealScene: prev.mealScene.filter(s => s !== scene.value)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{scene.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 調理時間 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  調理時間（分）
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="最小"
                    value={filters.cookingTimeMin || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      cookingTimeMin: e.target.value ? parseInt(e.target.value) || null : null
                    }))}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <span className="text-gray-500">〜</span>
                  <input
                    type="number"
                    placeholder="最大"
                    value={filters.cookingTimeMax || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      cookingTimeMax: e.target.value ? parseInt(e.target.value) || null : null
                    }))}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* カロリー */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カロリー
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="最小"
                    value={filters.caloriesMin || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      caloriesMin: e.target.value ? parseInt(e.target.value) || null : null
                    }))}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <span className="text-gray-500">〜</span>
                  <input
                    type="number"
                    placeholder="最大"
                    value={filters.caloriesMax || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      caloriesMax: e.target.value ? parseInt(e.target.value) || null : null
                    }))}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* 並び替え */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  並び替え
                </label>
                <div className="space-y-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      sortBy: e.target.value as any
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {filters.sortBy !== 'relevance' && (
                    <div className="flex space-x-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={filters.sortOrder === 'asc'}
                          onChange={() => setFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-1 text-sm text-gray-700">昇順</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={filters.sortOrder === 'desc'}
                          onChange={() => setFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-1 text-sm text-gray-700">降順</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-red-500 transition-colors"
              >
                フィルターをクリア
              </button>
              {showSearchButton && (
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  検索実行
                </button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}






