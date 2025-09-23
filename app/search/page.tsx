'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipe-card';
import { PremiumButton } from '@/components/premium-button';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
// Supabaseクライアントのインポートを削除

// カテゴリー型定義
interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  image?: string;
  thumbnails?: string[];
}

interface CategorySection {
  title: string;
  description: string;
  categories: Category[];
}

// Supabaseのレシピ型定義
interface SupabaseRecipe {
  id: string;
  title: string;
  description: string;
  cooking_time: number;
  servings: string;
  life_stage: string;
  health_conditions: string[];
  protein_type: string;
  meal_scene: string;
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
  }>;
  instructions: string[];
  thumbnail_url: string | null;
  video_url?: string;
  nutrition_info?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  created_at: string;
  updated_at: string;
}

// レシピデータを取得する関数
async function getRecipes(): Promise<SupabaseRecipe[]> {
  try {
    const response = await fetch('/api/recipes');
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

// カテゴリーデータを生成する関数
function generateCategories(recipes: SupabaseRecipe[]): CategorySection[] {
  // タンパク質ごとのカテゴリー
  const proteinCategories: Category[] = [
    {
      id: 'beef',
      name: '牛肉',
      description: 'ジューシーで旨みたっぷりの牛肉を使ったレシピ',
      count: recipes.filter(r => r.protein_type === 'beef').length,
      thumbnails: recipes.filter(r => r.protein_type === 'beef').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'chicken',
      name: '鶏肉',
      description: 'ヘルシーで使いやすい鶏肉のレシピ',
      count: recipes.filter(r => r.protein_type === 'chicken').length,
      thumbnails: recipes.filter(r => r.protein_type === 'chicken').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'pork',
      name: '豚肉',
      description: 'コクのある豚肉を使った人気レシピ',
      count: recipes.filter(r => r.protein_type === 'pork').length,
      thumbnails: recipes.filter(r => r.protein_type === 'pork').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'salmon',
      name: 'サーモン',
      description: 'オメガ3豊富なサーモンのレシピ',
      count: recipes.filter(r => r.protein_type === 'salmon').length,
      thumbnails: recipes.filter(r => r.protein_type === 'salmon').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'lamb',
      name: 'ラム',
      description: '独特の風味が魅力のラム肉レシピ',
      count: recipes.filter(r => r.protein_type === 'lamb').length,
      thumbnails: recipes.filter(r => r.protein_type === 'lamb').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'horse',
      name: '馬肉',
      description: '低カロリー高タンパクな馬肉レシピ',
      count: recipes.filter(r => r.protein_type === 'horse').length,
      thumbnails: recipes.filter(r => r.protein_type === 'horse').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    }
  ];

  // 体のお悩みカテゴリー
  const healthCategories: Category[] = [
    {
      id: 'weak_stomach',
      name: 'お腹が弱い',
      description: '消化に優しい、胃腸にやさしいレシピ',
      count: recipes.filter(r => r.health_conditions.includes('weak_stomach')).length,
      thumbnails: recipes.filter(r => r.health_conditions.includes('weak_stomach')).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'diet',
      name: 'ダイエット',
      description: '低カロリーで満足感のあるダイエットレシピ',
      count: recipes.filter(r => r.health_conditions.includes('diet')).length,
      thumbnails: recipes.filter(r => r.health_conditions.includes('diet')).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'balanced',
      name: 'バランスGood',
      description: '栄養バランスの取れた健康的なレシピ',
      count: recipes.filter(r => r.health_conditions.includes('balanced')).length,
      thumbnails: recipes.filter(r => r.health_conditions.includes('balanced')).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'cold',
      name: '冷え',
      description: '体を温める食材を使ったレシピ',
      count: recipes.filter(r => r.health_conditions.includes('cold')).length,
      thumbnails: recipes.filter(r => r.health_conditions.includes('cold')).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'appetite',
      name: '嗜好性UP',
      description: '食欲をそそる美味しいレシピ',
      count: recipes.filter(r => r.health_conditions.includes('appetite')).length,
      thumbnails: recipes.filter(r => r.health_conditions.includes('appetite')).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'summer_heat',
      name: '夏バテ',
      description: '夏の暑さに負けない元気レシピ',
      count: recipes.filter(r => r.health_conditions.includes('summer_heat')).length,
      thumbnails: recipes.filter(r => r.health_conditions.includes('summer_heat')).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'heart_care',
      name: '心臓ケア',
      description: '心臓に優しい食材を使ったレシピ',
      count: recipes.filter(r => r.health_conditions.includes('heart_care')).length,
      thumbnails: recipes.filter(r => r.health_conditions.includes('heart_care')).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'urinary_care',
      name: '泌尿器ケア',
      description: '泌尿器の健康をサポートするレシピ',
      count: recipes.filter(r => r.health_conditions.includes('urinary_care')).length,
      thumbnails: recipes.filter(r => r.health_conditions.includes('urinary_care')).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'diabetes_care',
      name: '糖尿ケア',
      description: '血糖値に配慮したレシピ',
      count: recipes.filter(r => r.health_conditions.includes('diabetes_care')).length,
      thumbnails: recipes.filter(r => r.health_conditions.includes('diabetes_care')).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'kidney_care',
      name: '腎臓ケア',
      description: '腎臓に負担をかけないレシピ',
      count: recipes.filter(r => r.health_conditions.includes('kidney_care')).length,
      thumbnails: recipes.filter(r => r.health_conditions.includes('kidney_care')).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'joint_care',
      name: '関節ケア',
      description: '関節の健康をサポートするレシピ',
      count: recipes.filter(r => r.health_conditions.includes('joint_care')).length,
      thumbnails: recipes.filter(r => r.health_conditions.includes('joint_care')).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'fighting_disease',
      name: '闘病応援!',
      description: '病気と闘う愛犬をサポートするレシピ',
      count: recipes.filter(r => r.health_conditions.includes('fighting_disease')).length,
      thumbnails: recipes.filter(r => r.health_conditions.includes('fighting_disease')).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    }
  ];

  // ライフステージカテゴリー
  const lifeStageCategories: Category[] = [
    {
      id: 'puppy',
      name: '子犬期',
      description: '生後6ヶ月までの子犬向けレシピ',
      count: recipes.filter(r => r.life_stage === 'puppy').length,
      thumbnails: recipes.filter(r => r.life_stage === 'puppy').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'junior',
      name: 'ジュニア期',
      description: '6ヶ月〜2歳の成長期向けレシピ',
      count: recipes.filter(r => r.life_stage === 'junior').length,
      thumbnails: recipes.filter(r => r.life_stage === 'junior').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'adult',
      name: '成犬期',
      description: '2歳〜7歳の成犬向けレシピ',
      count: recipes.filter(r => r.life_stage === 'adult').length,
      thumbnails: recipes.filter(r => r.life_stage === 'adult').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'senior',
      name: 'シニア期',
      description: '7歳以上のシニア犬向けレシピ',
      count: recipes.filter(r => r.life_stage === 'senior').length,
      thumbnails: recipes.filter(r => r.life_stage === 'senior').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'elderly',
      name: '老年期',
      description: '高齢犬向けのやさしいレシピ',
      count: recipes.filter(r => r.life_stage === 'elderly').length,
      thumbnails: recipes.filter(r => r.life_stage === 'elderly').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    }
  ];

  // 利用シーンカテゴリー
  const sceneCategories: Category[] = [
    {
      id: 'daily',
      name: '日常ご飯',
      description: '毎日の基本となるご飯レシピ',
      count: recipes.length, // 全レシピが対象
      thumbnails: recipes.slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'snack',
      name: 'おやつ',
      description: '特別な日のご褒美おやつレシピ',
      count: Math.floor(recipes.length * 0.3), // 推定値
      thumbnails: recipes.filter(r => r.meal_scene === 'snack').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'shared',
      name: 'おんなじご飯',
      description: '家族と一緒に楽しめるレシピ',
      count: Math.floor(recipes.length * 0.2), // 推定値
      thumbnails: recipes.filter(r => r.meal_scene === 'shared').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'quick',
      name: '時短レシピ',
      description: '忙しい時でも簡単に作れるレシピ',
      count: recipes.filter(r => r.cooking_time <= 15).length,
      thumbnails: recipes.filter(r => r.cooking_time <= 15).slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    },
    {
      id: 'special',
      name: '特別な日',
      description: '誕生日や記念日におすすめのレシピ',
      count: Math.floor(recipes.length * 0.1), // 推定値
      thumbnails: recipes.filter(r => r.meal_scene === 'special').slice(0, 4).map(r => r.thumbnail_url).filter((url): url is string => url !== null && url.trim() !== '')
    }
  ];

  return [
    {
      title: 'タンパク質から探す',
      description: 'お肉や魚の種類別にレシピを探せます',
      categories: proteinCategories.filter(cat => cat.count > 0)
    },
    {
      title: '体のお悩みから探す',
      description: '愛犬の健康状態に合わせたレシピを探せます',
      categories: healthCategories.filter(cat => cat.count > 0)
    },
    {
      title: 'ライフステージから探す',
      description: '年齢に応じたレシピを探せます',
      categories: lifeStageCategories.filter(cat => cat.count > 0)
    },
    {
      title: '利用シーンから探す',
      description: '目的に応じたレシピを探せます',
      categories: sceneCategories.filter(cat => cat.count > 0)
    }
  ];
}

export default function CategoriesPage() {
  const [allRecipes, setAllRecipes] = useState<SupabaseRecipe[]>([]);
  const [categorySections, setCategorySections] = useState<CategorySection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // レシピデータを取得してカテゴリーを生成
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const recipes = await getRecipes();
        setAllRecipes(recipes);
        const categories = generateCategories(recipes);
        setCategorySections(categories);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setAllRecipes([]);
        setCategorySections([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="search" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずリスト */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-red-500">ホーム</Link></li>
            <li>/</li>
            <li className="text-gray-900">レシピカテゴリー一覧</li>
          </ol>
        </nav>

        {/* ページヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">レシピカテゴリー一覧</h1>
          <p className="text-gray-600 text-lg">
            愛犬の年齢や健康状態、お好みに合わせてレシピを探せます
          </p>
        </div>

        {/* カテゴリー一覧 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {categorySections.map((section, sectionIndex) => (
              <section key={sectionIndex} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h2>
                  <p className="text-gray-600 text-sm">{section.description}</p>
                </div>
                <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.categories.map((category) => (
                              <Link
                                key={category.id}
                                href={`/recipes/category/${category.id}`}
                                className="group block p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-200 h-48"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                                    {category.name}
                                  </h3>
                                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {category.count}件
                                  </span>
            </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                  {category.description}
                                </p>
                                
                                {/* サムネイル表示エリア（2x2グリッド） */}
                                <div className="grid grid-cols-2 gap-1 mb-3 h-16">
                                  {Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                      key={index}
                                      className="bg-gray-100 rounded overflow-hidden"
                                    >
                                      {category.thumbnails && category.thumbnails[index] ? (
                                        <img
                                          src={category.thumbnails[index]}
                                          alt={`${category.name}のレシピ${index + 1}`}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                              parent.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-gray-400 text-xs">-</span></div>';
                                            }
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                          <span className="text-gray-400 text-xs">-</span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                
            </Link>
                            ))}
                          </div>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* プレミアム機能 */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💎</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">プレミアム機能でより便利に</h3>
            <p className="text-gray-600 mb-4 text-sm">
              愛犬のプロフィールを登録して、より適切なレシピを見つけましょう
            </p>
            <div className="flex justify-center">
              <PremiumButton 
                variant="primary" 
                size="md"
                premiumFeature="詳細検索"
                onClick={() => {
                  // プレミアムユーザーの場合はプロフィール作成ページに遷移
                  window.location.href = '/profile/create';
                }}
              >
                🐕 愛犬プロフィールを作成
              </PremiumButton>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
