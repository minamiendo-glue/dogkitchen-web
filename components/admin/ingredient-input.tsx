'use client';

import { useState } from 'react';
import { ingredientDatabase, getIngredientByName, convertToGrams, getCommonIngredients, ingredientCategories } from '@/lib/data/ingredient-units';

interface Ingredient {
  name: string;
  unit: string;
  grams: number;
  displayText: string; // 表示用テキスト（例: "にんじん 1本 (約120g)"）
}

interface IngredientInputProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

export function IngredientInput({ ingredients, onChange }: IngredientInputProps) {
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    unit: '',
    grams: 0,
    displayText: ''
  });

  const addIngredient = () => {
    if (newIngredient.name.trim() && newIngredient.unit.trim()) {
      onChange([...ingredients, { ...newIngredient }]);
      setNewIngredient({ name: '', unit: '', grams: 0, displayText: '' });
    }
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    onChange(newIngredients);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = ingredients.map((ingredient, i) => 
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    onChange(newIngredients);
  };

  const handleIngredientNameChange = (name: string) => {
    setNewIngredient(prev => ({
      ...prev,
      name,
      unit: '',
      grams: 0,
      displayText: ''
    }));
  };

  const handleUnitChange = (unit: string) => {
    const grams = convertToGrams(newIngredient.name, unit);
    const ingredientData = getIngredientByName(newIngredient.name);
    const unitData = ingredientData?.units.find(u => u.name === unit);
    
    setNewIngredient(prev => ({
      ...prev,
      unit,
      grams,
      displayText: `${prev.name} ${unit}${unitData ? ` (約${grams}g)` : ''}`
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const addQuickIngredient = (ingredientName: string, unitName: string) => {
    const ingredientData = getIngredientByName(ingredientName);
    if (!ingredientData) return;

    const unitData = ingredientData.units.find(u => u.name === unitName);
    if (!unitData) return;

    const grams = convertToGrams(ingredientName, unitName);
    const displayText = `${ingredientName} ${unitName} (約${grams}g)`;

    const exists = ingredients.some(ing => ing.name === ingredientName && ing.unit === unitName);
    if (!exists) {
      onChange([...ingredients, {
        name: ingredientName,
        unit: unitName,
        grams,
        displayText
      }]);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-gray-900">食材・材料</h4>
      
      {/* 既存の食材一覧 */}
      {ingredients.length > 0 && (
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{ingredient.displayText}</div>
                <div className="text-xs text-gray-500">栄養計算用: {ingredient.grams}g</div>
              </div>
              <button
                onClick={() => removeIngredient(index)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 新しい食材の追加 */}
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 食材選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">食材</label>
            <select
              value={newIngredient.name}
              onChange={(e) => handleIngredientNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            >
              <option value="">食材を選択</option>
              {getCommonIngredients().map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* 単位選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">単位</label>
            <select
              value={newIngredient.unit}
              onChange={(e) => handleUnitChange(e.target.value)}
              disabled={!newIngredient.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:bg-gray-100"
            >
              <option value="">単位を選択</option>
              {newIngredient.name && getIngredientByName(newIngredient.name)?.units.map(unit => (
                <option key={unit.name} value={unit.name}>
                  {unit.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* 追加ボタン */}
          <div className="flex items-end">
            <button
              onClick={addIngredient}
              disabled={!newIngredient.name.trim() || !newIngredient.unit.trim()}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              追加
            </button>
          </div>
        </div>

        {/* プレビュー */}
        {newIngredient.displayText && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            プレビュー: {newIngredient.displayText}
          </div>
        )}
      </div>

      {/* よく使われる材料のクイック選択 */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">よく使われる材料：</p>
        <div className="space-y-2">
          {[
            { name: '鶏むね肉', unit: '100g' },
            { name: '鶏もも肉', unit: '100g' },
            { name: '牛肉', unit: '80g' },
            { name: '豚肉', unit: '80g' },
            { name: '鮭', unit: '1切れ' },
            { name: '白米', unit: '1合' },
            { name: 'にんじん', unit: '1本' },
            { name: 'ブロッコリー', unit: '1房' },
            { name: 'さつまいも', unit: '1本' },
            { name: '卵', unit: '1個' },
            { name: '豆腐', unit: '1/2丁' }
          ].map((quick, index) => (
            <button
              key={index}
              onClick={() => addQuickIngredient(quick.name, quick.unit)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition-colors duration-200 mr-2 mb-2"
            >
              {quick.name} {quick.unit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
