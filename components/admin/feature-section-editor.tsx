'use client';

import { useState } from 'react';
import { FeatureSection } from '@/types/blog';

interface Recipe {
  id: string;
  title: string;
  thumbnail_url?: string;
  difficulty?: string;
  cooking_time?: number;
  description?: string;
  slug?: string;
}

interface FeatureSectionEditorProps {
  sections: FeatureSection[];
  onSectionsChange: (sections: FeatureSection[]) => void;
  recipes: Recipe[];
}

export function FeatureSectionEditor({ 
  sections, 
  onSectionsChange, 
  recipes 
}: FeatureSectionEditorProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  // デバッグ用ログ
  console.log('FeatureSectionEditor - レシピデータ:', recipes);
  console.log('FeatureSectionEditor - レシピ数:', recipes?.length || 0);
  console.log('FeatureSectionEditor - 展開中のセクション:', expandedSection);
  console.log('FeatureSectionEditor - 小項目数:', sections.length);

  const addSection = () => {
    const newSection: FeatureSection = {
      title: '',
      description: '',
      recipe_ids: []
    };
    onSectionsChange([...sections, newSection]);
  };

  const updateSection = (index: number, field: keyof FeatureSection, value: any) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    onSectionsChange(updatedSections);
  };

  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    onSectionsChange(updatedSections);
  };

  const toggleRecipeInSection = (sectionIndex: number, recipeId: string) => {
    const section = sections[sectionIndex];
    const recipeIds = section.recipe_ids || [];
    const isSelected = recipeIds.includes(recipeId);
    
    const updatedRecipeIds = isSelected
      ? recipeIds.filter(id => id !== recipeId)
      : [...recipeIds, recipeId];
    
    updateSection(sectionIndex, 'recipe_ids', updatedRecipeIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">小項目の管理</h3>
        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          小項目を追加
        </button>
      </div>

      {sections.length > 0 && (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setExpandedSection(expandedSection === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">
                      {section.title || `小項目 ${index + 1}`}
                    </h4>
                    {section.description && (
                      <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      レシピ数: {section.recipe_ids?.length || 0}件
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSection(index);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        expandedSection === index ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {expandedSection === index && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="space-y-4">
                    {/* デバッグ情報 */}
                    <div className="text-xs text-gray-500 p-2 bg-yellow-100 rounded">
                      デバッグ: セクション {index} が展開されています。レシピ数: {recipes.length}
                    </div>
                    {/* 小項目タイトル */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        小項目タイトル <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="例: レンジで作る主菜・主食レシピ"
                      />
                    </div>

                    {/* 小項目説明 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        小項目の説明
                      </label>
                      <textarea
                        value={section.description || ''}
                        onChange={(e) => updateSection(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="この小項目の説明を入力してください"
                      />
                    </div>

                    {/* レシピ選択 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        含めるレシピを選択
                      </label>
                      
                      {(() => {
                        console.log('レシピ表示条件チェック:', {
                          recipesLength: recipes.length,
                          recipesArray: recipes,
                          isZero: recipes.length === 0
                        });
                        
                        if (recipes.length === 0) {
                          return (
                            <div className="text-center py-4">
                              <p className="text-gray-500">レシピが見つかりません</p>
                              <div className="text-xs text-gray-400 mt-2">
                                デバッグ: recipes配列の長さ = {recipes.length}
                              </div>
                            </div>
                          );
                        } else {
                          return (
                        <div>
                          <div className="text-xs text-gray-500 mb-2">
                            デバッグ: {recipes.length}件のレシピを表示中
                          </div>
                          <div className="text-xs text-gray-400 mb-2">
                            レシピマップ開始: recipes配列 = {JSON.stringify(recipes.map(r => ({ id: r.id, title: r.title })), null, 2)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                          {recipes.map((recipe, recipeIndex) => {
                            console.log(`レシピ ${recipeIndex} の処理開始:`, {
                              recipeId: recipe.id,
                              recipeTitle: recipe.title,
                              sectionRecipeIds: section.recipe_ids
                            });
                            
                            const isSelected = section.recipe_ids?.includes(recipe.id) || false;
                            console.log(`レシピ ${recipeIndex} の選択状態:`, isSelected);
                            
                            return (
                              <label
                                key={recipe.id}
                                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
                                  isSelected 
                                    ? 'border-purple-500 bg-purple-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleRecipeInSection(index, recipe.id)}
                                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <div className="ml-3 flex-1">
                                  <div className="flex items-start space-x-3">
                                    {recipe.thumbnail_url && (
                                      <img
                                        src={recipe.thumbnail_url}
                                        alt={recipe.title}
                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h5 className="text-sm font-medium text-gray-900 truncate">
                                        {recipe.title}
                                      </h5>
                                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                        {recipe.difficulty && (
                                          <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100">
                                            {recipe.difficulty}
                                          </span>
                                        )}
                                        {recipe.cooking_time && (
                                          <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100">
                                            {recipe.cooking_time}分
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            レシピマップ完了: {recipes.length}件のレシピを処理しました
                          </div>
                        </div>
                        );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
