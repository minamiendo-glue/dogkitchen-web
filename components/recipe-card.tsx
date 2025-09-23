// components/recipe-card.tsx
import Link from 'next/link';
import type { Recipe } from '@/types/recipe';
import { SafeImage } from './safe-image';
import { convertR2ImageUrl } from '@/lib/utils/image-url';
import { 
  LIFE_STAGE_LABELS, 
  HEALTH_CONDITION_LABELS, 
  MEAL_SCENE_LABELS, 
  PROTEIN_TYPE_LABELS,
  PROTEIN_COLOR_MAP 
} from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const proteinColor = PROTEIN_COLOR_MAP[recipe.proteinType];
  
  return (
    <Link 
      href={`/recipes/${recipe.slug}`}
      className="group block w-full rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
    >
      <div className="flex flex-row">
        {/* 画像 (横長) */}
        <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden">
          {recipe.thumbnailUrl && recipe.thumbnailUrl.trim() !== '' ? (
            <SafeImage
              src={convertR2ImageUrl(recipe.thumbnailUrl)}
              alt={recipe.title}
              fill
              sizes="128px"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              fallbackComponent={
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🍽️</div>
                    <div className="text-gray-500 text-xs font-medium">画像なし</div>
                  </div>
                </div>
              }
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-1">🍽️</div>
                <div className="text-gray-500 text-xs font-medium">画像なし</div>
              </div>
            </div>
          )}
        </div>
        
        {/* テキスト部分 */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200">
              {recipe.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {recipe.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center">
                <span className="text-xs mr-1" style={{fontSize: '5px'}}>⏱</span>
                <span className="text-xs">{recipe.cookingTimeMinutes}分</span>
              </span>
              <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                proteinColor === 'red' 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                <span className="text-xs mr-1" style={{fontSize: '5px'}}>{proteinColor === 'red' ? '●' : '○'}</span>
                <span className="text-xs">{PROTEIN_TYPE_LABELS[recipe.proteinType]}</span>
              </span>
            </div>
            
            <button className="w-8 h-8 bg-gray-100 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
