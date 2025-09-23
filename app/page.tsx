'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AdvancedSearch } from '@/components/advanced-search';
import { RecipeCard } from '@/components/recipe-card';
import { VideoGallery } from '@/components/video-gallery';
import { PaymentButton } from '@/components/payment-button';
import { Header } from '@/components/header';
import { PremiumButton } from '@/components/premium-button';
import { Footer } from '@/components/footer';
import { useAuth } from '@/components/auth/supabase-provider';
import { filterRecipes, getActiveFilterCount } from '@/lib/utils/recipe-filter';
import type { RecipeFilters as RecipeFiltersType } from '@/types/recipe';

// Supabaseのレシピ型定義
interface SupabaseRecipe {
  id: string;
  title: string;
  description: string;
  cooking_time: number;
  servings: string;
  life_stage: string;
  protein_type: string;
  meal_scene: string;
  difficulty: string;
  health_conditions?: string[];
  thumbnail_url?: string;
  main_video_id?: string;
  main_video_url?: string;
  ingredients?: any[];
  instructions?: any[];
  nutrition_info?: any;
}

// Supabaseのデータを既存のRecipe型に変換する関数
function convertSupabaseToRecipe(supabaseRecipe: SupabaseRecipe): any {
  return {
    id: supabaseRecipe.id,
    title: supabaseRecipe.title,
    slug: supabaseRecipe.id, // IDをslugとして使用（日本語タイトルのため）
    description: supabaseRecipe.description,
    cookingTimeMinutes: supabaseRecipe.cooking_time,
    lifeStage: supabaseRecipe.life_stage as any,
    healthConditions: supabaseRecipe.health_conditions || [],
    proteinType: supabaseRecipe.protein_type as any,
    mealScene: supabaseRecipe.meal_scene as any,
    videoUrl: supabaseRecipe.main_video_url || '',
    thumbnailUrl: supabaseRecipe.thumbnail_url || '',
    servings: supabaseRecipe.servings,
    difficulty: supabaseRecipe.difficulty,
    ingredients: supabaseRecipe.ingredients || [],
    instructions: supabaseRecipe.instructions || [],
    nutritionInfo: supabaseRecipe.nutrition_info || {},
    createdAt: new Date()
  };
}

export default function Home() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<RecipeFiltersType>({});
  const [recipes, setRecipes] = useState<any[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState({
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "おすすめ動画"
  });
  const [loading, setLoading] = useState(true);
  
  // Supabaseからレシピを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // レシピデータを取得
        const recipesResponse = await fetch('/api/admin/recipes');
        const recipesData = await recipesResponse.json();
        if (recipesData.success) {
          const convertedRecipes = (recipesData.recipes || []).map(convertSupabaseToRecipe);
          setRecipes(convertedRecipes);
        }

        // おすすめ動画設定を取得
        const settingsResponse = await fetch('/api/admin/settings');
        const settingsData = await settingsResponse.json();
        if (settingsData.success && settingsData.settings?.featuredVideo?.src) {
          setFeaturedVideo({
            src: settingsData.settings.featuredVideo.src,
            title: "おすすめ動画"
          });
        }
      } catch (error) {
        console.error('データの取得に失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const filteredRecipes = useMemo(() => {
    return filterRecipes(recipes, filters);
  }, [recipes, filters]);

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header currentPage="home" />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヒーローセクション */}
        <div className="text-center mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🍽️</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                愛犬のための<br />
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  手作りご飯レシピ
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                迷わない、悩まない。同じ食材で、健康も美味しさも手に入れよう。
                <br />
                <span className="font-semibold text-red-600">3日サイクル</span>で赤身肉と白身肉を交互に与えて、愛犬の健康をサポートしましょう。
              </p>
              <div className="flex justify-center">
                <Link 
                  href="/recipes?sort=popular"
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  人気のレシピを見る
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* おすすめ動画 */}
        <div className="mb-12">
          <VideoGallery
            videos={[featuredVideo]}
            className="max-w-4xl mx-auto"
            aspectRatio="16:9"
          />
        </div>

        {/* カテゴリ別レシピボタン */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              カテゴリ別レシピ
            </h3>
            <p className="text-gray-600">
              愛犬の年齢、健康状態、好みに合わせてレシピを探してみましょう
            </p>
          </div>
          <div className="flex justify-center">
            <Link
              href="/recipes/category"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg max-w-md mx-auto"
            >
              <div className="relative z-10">
                <div className="text-4xl mb-3">🍽️</div>
                <div className="text-white font-bold text-lg mb-2">カテゴリ別レシピ</div>
                <div className="text-white/90 text-sm">
                  ライフステージ・健康状態・利用シーン・タンパク質タイプから選ぶ
                </div>
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>

        {/* 高度な検索 */}
        <div className="mb-8">
          <AdvancedSearch 
            onFiltersChange={useCallback((searchFilters: any) => {
              // SearchFiltersをRecipeFiltersに変換
              const recipeFilters: RecipeFiltersType = {
                lifeStage: searchFilters.lifeStage,
                healthConditions: searchFilters.healthConditions,
                proteinType: searchFilters.proteinType,
                mealScene: searchFilters.mealScene,
                difficulty: searchFilters.difficulty,
                cookingTimeMax: searchFilters.cookingTimeMax || undefined,
                searchQuery: searchFilters.query
              };
              setFilters(recipeFilters);
            }, [])}
            showSearchButton={false}
          />
        </div>

        {/* 結果表示 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              レシピ一覧
            </h3>
            {activeFilterCount > 0 && (
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {filteredRecipes.length}件のレシピが見つかりました
              </span>
            )}
          </div>
        </div>

        {/* レシピグリッド */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-gray-500">レシピを読み込み中...</p>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              レシピが見つかりませんでした
            </h3>
            <p className="text-gray-500">
              フィルターを調整して、再度お試しください。
            </p>
          </div>
        )}

        {/* プレミアム機能のボタン */}
        {user && (
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <PremiumButton 
                variant="primary" 
                size="lg"
                premiumFeature="愛犬プロフィール登録"
                onClick={() => {
                  // プレミアムユーザーの場合はプロフィール作成ページに遷移
                  window.location.href = '/profile/create';
                }}
              >
                🐕 愛犬プロフィールを作成
              </PremiumButton>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              これらの機能はプレミアムプランでご利用いただけます
            </p>
          </div>
        )}

        {/* プレミアム機能の案内 */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-3xl">💎</span>
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              プレミアム機能で<br />
              愛犬にぴったりのレシピを
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
              愛犬の体重や年齢を入力するだけで、<br />
              最適な食材量を自動計算します。
            </p>
            <div className="flex justify-center">
              <Link 
                href="/premium"
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-4 px-8 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                詳しく見る
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}