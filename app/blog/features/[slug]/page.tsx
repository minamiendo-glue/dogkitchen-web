"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Feature, FeatureSectionData } from '@/types/blog';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface Recipe {
  id: string;
  title: string;
  thumbnail_url?: string;
  difficulty: string;
  cooking_time: number;
  slug: string;
  description?: string;
  life_stage?: string;
  health_conditions?: string[];
}

// FeatureRecipeから実際のレシピデータを抽出する関数
function extractRecipes(feature: Feature): Recipe[] {
  if (!feature.recipes) {
    return [];
  }
  
  // APIレスポンスの構造に応じて処理を分岐
  const extracted = feature.recipes
    .map((recipeData: any) => {
      // recipeDataが直接レシピデータの場合
      if (recipeData.id && recipeData.title) {
        return {
          id: recipeData.id,
          title: recipeData.title,
          slug: recipeData.id, // IDをスラッグとして使用
          description: recipeData.description,
          thumbnail_url: recipeData.thumbnail_url,
          difficulty: '普通', // デフォルト値
          cooking_time: 30, // デフォルト値
          life_stage: '成犬', // デフォルト値
          health_conditions: [] // デフォルト値
        };
      }
      // recipeData.recipeが存在する場合（従来の構造）
      else if (recipeData.recipe) {
        return {
          id: recipeData.recipe.id,
          title: recipeData.recipe.title,
          slug: recipeData.recipe.id, // IDをスラッグとして使用
          description: recipeData.recipe.description,
          thumbnail_url: recipeData.recipe.thumbnail_url,
      difficulty: '普通', // デフォルト値
      cooking_time: 30, // デフォルト値
      life_stage: '成犬', // デフォルト値
      health_conditions: [] // デフォルト値
        };
      }
      return null;
    })
    .filter(Boolean) as Recipe[]; // nullを除外
    
  return extracted;
}

export default function FeaturePage() {
  const params = useParams();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeature = async () => {
    try {
      const slug = await params.slug;
      const response = await fetch(`/api/blog/features/${slug}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.needsSetup) {
          setError('特集が見つかりません');
          return;
        }
        throw new Error(errorData.error || '特集が見つかりません');
      }

      const data = await response.json();
      setFeature(data.feature);
    } catch (err) {
      console.error('Error fetching feature:', err);
      setError('特集が見つかりません');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeature();
  }, [params]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  // 小項目ごとのレシピを取得
  const getSectionsWithRecipes = () => {
    if (!feature) return [];
    const recipes = extractRecipes(feature);
    
    // 小項目が存在しない場合は、デフォルトの小項目を作成
    if (!feature?.sections || feature.sections.length === 0) {
      return [{
        title: 'おすすめレシピ',
        description: 'この特集で紹介しているレシピです。愛犬の健康を考えた栄養バランスの良いレシピを厳選しました。',
        recipes: recipes
      }];
    }
    
    return feature.sections.map((section: FeatureSectionData) => {
      // 小項目に紐づいたレシピを取得
      let sectionRecipes = [];
      
      if (section.recipe_ids && Array.isArray(section.recipe_ids)) {
        sectionRecipes = recipes.filter((recipe: Recipe) => 
          section.recipe_ids.includes(recipe.id)
        );
      } else {
        // recipe_idsが存在しない場合は、すべてのレシピを表示
        sectionRecipes = recipes;
      }
      
      return {
        title: section.title,
        description: section.description,
        recipes: sectionRecipes
      };
    });
  };

  // レシピカードコンポーネント
  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Link href={`/recipes/${recipe.slug}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:border-red-300">
      {recipe.thumbnail_url && (
          <div className="aspect-video w-full overflow-hidden">
          <img
            src={recipe.thumbnail_url}
            alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
      
      <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight group-hover:text-red-600 transition-colors duration-200">
          {recipe.title}
        </h3>
        
        {recipe.description && (
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            {recipe.description}
          </p>
        )}
        
        <div className="space-y-3">
          {/* 調理時間 */}
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>調理時間: {recipe.cooking_time}分</span>
          </div>
          
          {/* 難易度 */}
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>難易度: {recipe.difficulty}</span>
          </div>
          
          {/* 体のお悩み */}
          {recipe.health_conditions && recipe.health_conditions.length > 0 && (
            <div className="flex items-start text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <div>
                <span className="block mb-1">体のお悩み:</span>
                <div className="flex flex-wrap gap-1">
                  {recipe.health_conditions.map((condition, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* ライフステージ */}
          {recipe.life_stage && (
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>ライフステージ: {recipe.life_stage}</span>
            </div>
          )}
        </div>
        
        <div className="mt-6">
            <div className="inline-flex items-center justify-center w-full px-4 py-3 bg-red-600 text-white rounded-lg group-hover:bg-red-700 transition-colors duration-200 font-medium">
            <span>レシピを見る</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <>
        <Header currentPage="features" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header currentPage="features" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-800 mb-2">エラーが発生しました</h2>
            <p className="text-red-600 mb-4">{error}</p>
            {error.includes('セットアップ') && (
              <div className="text-sm text-red-500">
                  <p>管理者に記事機能のセットアップを依頼してください。</p>
              </div>
            )}
            <Link
              href="/blog/features"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              特集一覧に戻る
            </Link>
          </div>
        </div>
      </div>
        <Footer />
      </>
    );
  }

  if (!feature) {
    return (
      <>
        <Header currentPage="features" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">特集が見つかりません</h2>
            <p className="text-gray-600 mb-4">お探しの特集は存在しないか、削除された可能性があります。</p>
            <Link
              href="/blog/features"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              特集一覧に戻る
            </Link>
          </div>
        </div>
      </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header currentPage="features" />
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {feature.featured_image_url && (
            <div className="aspect-video w-full">
              <img
                src={feature.featured_image_url}
                alt={feature.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                特集
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {feature.title}
            </h1>
            
            {feature.excerpt && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {feature.excerpt}
                </p>
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span>公開日: {feature.published_at ? formatDate(feature.published_at) : '未公開'}</span>
              <span>•</span>
              <span>作成日: {formatDate(feature.created_at)}</span>
                {(() => {
                  const recipes = extractRecipes(feature);
                  return recipes.length > 0 ? (
                <>
                  <span>•</span>
                      <span>{recipes.length}件のレシピ</span>
                </>
                  ) : null;
                })()}
            </div>
          </div>
        </div>

        {/* 関連レシピ */}
          {(() => {
            const recipes = extractRecipes(feature);
            return recipes.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  {(() => {
                    const sections = getSectionsWithRecipes();
                console.log('小項目データ:', sections);
                console.log('特集データ全体:', feature);
                console.log('特集のsections:', feature?.sections);
                
                    return sections.map((section: any, sectionIndex: number) => (
                      <div key={sectionIndex} className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-red-200">
                          {section.title}
                    </h3>
                    
                        {section.description && (
                      <p className="text-lg text-gray-600 mb-6 leading-relaxed">{section.description}</p>
                        )}
                        
                        {section.recipes.length > 0 ? (
                      <div className="space-y-6">
                            {section.recipes.map((recipe: Recipe) => (
                          <div key={recipe.id} className="w-full">
                            <RecipeCard recipe={recipe} />
                          </div>
                            ))}
                    </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">このカテゴリーにはレシピがありません</p>
                        )}
                  </div>
                    ));
                  })()}
          </div>
            );
          })()}

        {/* 戻るボタン */}
        <div className="mt-8 text-center">
          <Link
            href="/blog/features"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            特集一覧に戻る
          </Link>
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
}