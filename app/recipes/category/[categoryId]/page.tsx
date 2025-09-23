'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipe-card';
import { Footer } from '@/components/footer';

// Supabaseレシピ型定義
interface SupabaseRecipe {
  id: string;
  user_id: string;
  title: string;
  description: string;
  cooking_time: number;
  servings: string;
  life_stage: string;
  protein_type: string;
  meal_scene: string;
  difficulty: string;
  health_conditions: string[];
  ingredients: Array<{
    name: string;
    unit: string;
    grams: number;
    displayText: string;
  }>;
  instructions: Array<{
    step: number;
    text: string;
    videoUrl: string;
  }>;
  status: string;
  thumbnail_url: string | null;
  main_video_id: string | null;
  main_video_url: string | null;
  created_at: string;
  updated_at: string;
  nutrition_info: {
    fat: number;
    carbs: number;
    fiber: number;
    protein: number;
    calories: number;
    calculated_at: string;
  };
}

// カテゴリー情報の型定義
interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  image?: string;
  section: string;
}

// カテゴリー情報を取得する関数
function getCategoryInfo(categoryId: string): CategoryInfo | null {
  const categories: Record<string, CategoryInfo> = {
    // タンパク質カテゴリー
    beef: {
      id: 'beef',
      name: '牛肉',
      description: 'ジューシーで旨みたっぷりの牛肉を使ったレシピ。高タンパクで鉄分豊富な牛肉は、愛犬の健康をサポートします。',
      section: 'タンパク質から探す'
    },
    chicken: {
      id: 'chicken',
      name: '鶏肉',
      description: 'ヘルシーで使いやすい鶏肉のレシピ。低脂肪で高タンパク、消化も良く、愛犬に人気の食材です。',
      section: 'タンパク質から探す'
    },
    pork: {
      id: 'pork',
      name: '豚肉',
      description: 'コクのある豚肉を使った人気レシピ。ビタミンB1が豊富で、疲労回復にも効果的です。',
      section: 'タンパク質から探す'
    },
    salmon: {
      id: 'salmon',
      name: 'サーモン',
      description: 'オメガ3豊富なサーモンのレシピ。美しい毛艶と健康な皮膚をサポートします。',
      section: 'タンパク質から探す'
    },
    lamb: {
      id: 'lamb',
      name: 'ラム',
      description: '独特の風味が魅力のラム肉レシピ。低アレルゲンで、アレルギー体質の愛犬にもおすすめです。',
      section: 'タンパク質から探す'
    },
    horse: {
      id: 'horse',
      name: '馬肉',
      description: '低カロリー高タンパクな馬肉レシピ。低脂肪で消化が良く、ダイエット中の愛犬にも最適です。',
      section: 'タンパク質から探す'
    },
    // 体のお悩みカテゴリー
    weak_stomach: {
      id: 'weak_stomach',
      name: 'お腹が弱い',
      description: '消化に優しい、胃腸にやさしいレシピ。消化しやすい食材を使い、愛犬の胃腸に負担をかけません。',
      section: '体のお悩みから探す'
    },
    diet: {
      id: 'diet',
      name: 'ダイエット',
      description: '低カロリーで満足感のあるダイエットレシピ。健康的に体重管理をサポートします。',
      section: '体のお悩みから探す'
    },
    balanced: {
      id: 'balanced',
      name: 'バランスGood',
      description: '栄養バランスの取れた健康的なレシピ。愛犬の総合的な健康をサポートします。',
      section: '体のお悩みから探す'
    },
    cold: {
      id: 'cold',
      name: '冷え',
      description: '体を温める食材を使ったレシピ。血行を良くし、体の冷えを改善します。',
      section: '体のお悩みから探す'
    },
    appetite: {
      id: 'appetite',
      name: '嗜好性UP',
      description: '食欲をそそる美味しいレシピ。食が細い愛犬の食欲を刺激します。',
      section: '体のお悩みから探す'
    },
    summer_heat: {
      id: 'summer_heat',
      name: '夏バテ',
      description: '夏の暑さに負けない元気レシピ。夏バテ対策に効果的な食材を使用しています。',
      section: '体のお悩みから探す'
    },
    heart_care: {
      id: 'heart_care',
      name: '心臓ケア',
      description: '心臓に優しい食材を使ったレシピ。心臓の健康をサポートする栄養素を豊富に含んでいます。',
      section: '体のお悩みから探す'
    },
    urinary_care: {
      id: 'urinary_care',
      name: '泌尿器ケア',
      description: '泌尿器の健康をサポートするレシピ。尿路の健康維持に効果的な食材を使用しています。',
      section: '体のお悩みから探す'
    },
    diabetes_care: {
      id: 'diabetes_care',
      name: '糖尿ケア',
      description: '血糖値に配慮したレシピ。糖尿病の愛犬の血糖値管理をサポートします。',
      section: '体のお悩みから探す'
    },
    kidney_care: {
      id: 'kidney_care',
      name: '腎臓ケア',
      description: '腎臓に負担をかけないレシピ。腎臓の健康をサポートする低リン・低タンパクの食材を使用しています。',
      section: '体のお悩みから探す'
    },
    joint_care: {
      id: 'joint_care',
      name: '関節ケア',
      description: '関節の健康をサポートするレシピ。関節の動きをサポートする栄養素を豊富に含んでいます。',
      section: '体のお悩みから探す'
    },
    fighting_disease: {
      id: 'fighting_disease',
      name: '闘病応援!',
      description: '病気と闘う愛犬をサポートするレシピ。免疫力を高め、回復をサポートする栄養素を豊富に含んでいます。',
      section: '体のお悩みから探す'
    },
    // ライフステージカテゴリー
    puppy: {
      id: 'puppy',
      name: '子犬期',
      description: '生後6ヶ月までの子犬向けレシピ。成長期に必要な栄養素を豊富に含み、健やかな成長をサポートします。',
      section: 'ライフステージから探す'
    },
    junior: {
      id: 'junior',
      name: 'ジュニア期',
      description: '6ヶ月〜2歳の成長期向けレシピ。活発な成長期に必要なエネルギーと栄養素を提供します。',
      section: 'ライフステージから探す'
    },
    adult: {
      id: 'adult',
      name: '成犬期',
      description: '2歳〜7歳の成犬向けレシピ。健康維持に必要な栄養バランスを考慮したレシピです。',
      section: 'ライフステージから探す'
    },
    senior: {
      id: 'senior',
      name: 'シニア期',
      description: '7歳以上のシニア犬向けレシピ。加齢に伴う変化に対応し、健康維持をサポートします。',
      section: 'ライフステージから探す'
    },
    elderly: {
      id: 'elderly',
      name: '老年期',
      description: '高齢犬向けのやさしいレシピ。消化しやすく、高齢犬の健康をサポートする食材を使用しています。',
      section: 'ライフステージから探す'
    },
    // 利用シーンカテゴリー
    daily: {
      id: 'daily',
      name: '日常ご飯',
      description: '毎日の基本となるご飯レシピ。栄養バランスを考慮した、日常的に食べられるレシピです。',
      section: '利用シーンから探す'
    },
    snack: {
      id: 'snack',
      name: 'おやつ',
      description: '特別な日のご褒美おやつレシピ。愛犬との絆を深める特別な時間を演出します。',
      section: '利用シーンから探す'
    },
    shared: {
      id: 'shared',
      name: 'おんなじご飯',
      description: '家族と一緒に楽しめるレシピ。愛犬と家族が同じ食材で作れる、特別なレシピです。',
      section: '利用シーンから探す'
    },
    quick: {
      id: 'quick',
      name: '時短レシピ',
      description: '忙しい時でも簡単に作れるレシピ。短時間で美味しく作れる、忙しい飼い主さんにおすすめです。',
      section: '利用シーンから探す'
    },
    special: {
      id: 'special',
      name: '特別な日',
      description: '誕生日や記念日におすすめのレシピ。特別な日の思い出を彩る、特別なレシピです。',
      section: '利用シーンから探す'
    }
  };

  return categories[categoryId] || null;
}

// レシピデータを取得する関数
async function getRecipesByCategory(categoryId: string): Promise<SupabaseRecipe[]> {
  try {
    const response = await fetch(`/api/recipes?category=${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    const data = await response.json();
    return data.recipes || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export default function CategoryRecipePage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  
  const [recipes, setRecipes] = useState<SupabaseRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // カテゴリー情報を取得
      const info = getCategoryInfo(categoryId);
      setCategoryInfo(info);
      
      // レシピデータを取得
      const recipeData = await getRecipesByCategory(categoryId);
      setRecipes(recipeData);
      
      setIsLoading(false);
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">カテゴリーが見つかりません</h1>
            <Link href="/search" className="text-red-500 hover:text-red-600">
              カテゴリー一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DK</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">DOG KITCHEN</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-red-500 transition-colors">
                ホーム
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-red-500 transition-colors">
                DOG KITCHENとは
              </Link>
              <Link href="/premium" className="text-gray-600 hover:text-red-500 transition-colors">
                プレミアム
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずリスト */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-red-500">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/search" className="hover:text-red-500">レシピカテゴリー一覧</Link></li>
            <li>/</li>
            <li className="text-gray-900">{categoryInfo.name}</li>
          </ol>
        </nav>

        {/* カテゴリーヘッダー */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* カテゴリー画像エリア */}
          <div className="h-48 bg-gradient-to-r from-red-100 to-orange-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🐕</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryInfo.name}</h1>
              <p className="text-gray-600 text-sm">{categoryInfo.section}</p>
            </div>
          </div>
          
          {/* カテゴリー説明 */}
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed">{categoryInfo.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {recipes.length}件のレシピが見つかりました
              </span>
              <Link
                href="/search"
                className="text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                他のカテゴリーを見る →
              </Link>
            </div>
          </div>
        </div>

        {/* レシピ一覧 */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={{
                  id: recipe.id,
                  title: recipe.title,
                  description: recipe.description,
                  thumbnailUrl: recipe.thumbnail_url || '',
                  cookingTimeMinutes: recipe.cooking_time,
                  servings: recipe.servings,
                  difficulty: recipe.difficulty as 'easy' | 'medium' | 'hard',
                  lifeStage: recipe.life_stage as 'puppy' | 'junior' | 'adult' | 'senior' | 'elderly',
                  proteinType: recipe.protein_type as 'beef' | 'chicken' | 'pork' | 'salmon' | 'lamb' | 'horse',
                  healthConditions: recipe.health_conditions,
                  mealScene: recipe.meal_scene as 'daily' | 'snack' | 'shared' | 'special',
                  slug: recipe.id, // IDをslugとして使用
                  createdAt: new Date(recipe.created_at),
                  updatedAt: new Date(recipe.updated_at)
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🍽️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {categoryInfo.name}のレシピはまだありません
            </h3>
            <p className="text-gray-600 mb-6">
              新しいレシピが追加されるまで、他のカテゴリーをチェックしてみてください。
            </p>
            <Link
              href="/search"
              className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              他のカテゴリーを見る
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}









