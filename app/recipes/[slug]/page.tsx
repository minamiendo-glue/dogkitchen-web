'use client';

// app/recipes/[slug]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { VideoPlayer } from "@/components/video-player";
import { FavoriteButton } from "@/components/favorite-button";
import { PremiumButton } from "@/components/premium-button";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { convertR2ImageUrl } from "@/lib/utils/image-url";
import { useAuth } from "@/components/auth/supabase-provider";
import { adjustRecipeForDog, calculateDogNutritionRequirements, type DogProfile, type AdjustedIngredient, type DogNutritionRequirements } from "@/lib/nutrition-calculator";
import { convertSupabaseToRecipe } from "@/lib/utils/recipe-converter";
import { useRecipeTracking } from "@/lib/utils/analytics";

// Cloudflare Streamの動画URLを正しい形式に変換する関数
function convertCloudflareStreamUrl(url: string): string {
  if (!url || url.trim() === '') return url;
  
  // customer-プレフィックスのURLをiframe.cloudflarestream.comの形式に変換
  const customerPattern = /https:\/\/customer-[a-zA-Z0-9]+\.cloudflarestream\.com\/([a-zA-Z0-9]+)\/iframe/;
  const match = url.match(customerPattern);
  
  if (match) {
    const videoId = match[1];
    const newUrl = `https://iframe.cloudflarestream.com/${videoId}/iframe`;
    console.log(`Converting Cloudflare Stream URL: ${url} -> ${newUrl}`);
    return newUrl;
  }
  
  return url;
}

// 手順動画のURLを新しいR2のURLに変換する関数
function convertInstructionVideoUrl(url: string): string {
  if (!url || url.trim() === '') return url;
  
  // 古いR2のURL形式を新しいパブリック開発URLに変換
  const oldR2Pattern = /https:\/\/1da531377a6fe6d969f5c2b84e4a3eda\.r2\.cloudflarestorage\.com\/(.+)/;
  const match = url.match(oldR2Pattern);
  
  if (match) {
    const path = match[1];
    const newUrl = `https://pub-cfe9dbdc66fe4ac2a608873ba0acfdc4.r2.dev/${path}`;
    console.log(`Converting instruction video URL: ${url} -> ${newUrl}`);
    return newUrl;
  }
  
  return url;
}

// 動画URLが有効かどうかを検証する関数
function isValidVideoUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  
  // Cloudflare StreamのURLパターンをチェック
  const cloudflarePatterns = [
    /https:\/\/iframe\.cloudflarestream\.com\/[a-zA-Z0-9]+\/iframe/,
    /https:\/\/customer-[a-zA-Z0-9]+\.cloudflarestream\.com\/[a-zA-Z0-9]+\/iframe/,
    /https:\/\/[a-zA-Z0-9]+\.cloudflarestream\.com\/[a-zA-Z0-9]+\/iframe/
  ];
  
  // R2の動画URLパターンをチェック
  const r2Patterns = [
    /https:\/\/pub-[a-zA-Z0-9]+\.r2\.dev\/.*\.(mp4|webm|mov|avi|wmv|flv|3gp|mkv|ogv|m4v|mpeg)/,
    /https:\/\/[a-zA-Z0-9]+\.r2\.cloudflarestorage\.com\/.*\.(mp4|webm|mov|avi|wmv|flv|3gp|mkv|ogv|m4v|mpeg)/
  ];
  
  // 一般的な動画URLパターンをチェック
  const generalPatterns = [
    /https?:\/\/.*\.(mp4|webm|mov|avi|wmv|flv|3gp|mkv|ogv|m4v|mpeg)/,
    /https?:\/\/.*\/.*\.(mp4|webm|mov|avi|wmv|flv|3gp|mkv|ogv|m4v|mpeg)/
  ];
  
  const allPatterns = [...cloudflarePatterns, ...r2Patterns, ...generalPatterns];
  
  return allPatterns.some(pattern => pattern.test(url));
}

async function getRecipe(slug: string) {
  try {
    const response = await fetch('/api/admin/recipes', {
      cache: 'no-store'
    });
    const data = await response.json();
    
    if (data.success && data.recipes) {
      const recipes = data.recipes.map(convertSupabaseToRecipe);
      
      // デバッグ情報を出力
      console.log('Searching for recipe with slug:', slug);
      console.log('Available recipes:', recipes.map(r => ({ id: r.id, slug: r.slug, title: r.title })));
      
      // slugで検索（slugはIDと同じ値）
      let recipe = recipes.find((recipe: any) => recipe.slug === slug);
      if (!recipe) {
        // slugが見つからない場合は、IDで検索（URLが直接IDでアクセスされた場合）
        recipe = recipes.find((recipe: any) => recipe.id === slug);
      }
      
      console.log('Found recipe:', recipe ? { id: recipe.id, title: recipe.title } : 'Not found');
      return recipe;
    }
    
    return null;
  } catch (error) {
    console.error('レシピの取得に失敗:', error);
    return null;
  }
}

async function getAllRecipes() {
  try {
    const response = await fetch('/api/admin/recipes', {
      cache: 'no-store'
    });
    const data = await response.json();
    
    if (data.success && data.recipes) {
      return data.recipes.map(convertSupabaseToRecipe);
    }
    
    return [];
  } catch (error) {
    console.error('レシピ一覧の取得に失敗:', error);
    return [];
  }
}

// ライフステージの表示名を取得
function getLifeStageLabel(lifeStage: string): string {
  const labels: Record<string, string> = {
    'puppy': '子犬期',
    'junior': 'ジュニア期',
    'adult': '成犬期',
    'senior': 'シニア期',
    'elderly': '老年期'
  };
  return labels[lifeStage] || lifeStage;
}

// タンパク質タイプの表示名を取得
function getProteinTypeLabel(proteinType: string): string {
  const labels: Record<string, string> = {
    'chicken': '鶏肉',
    'beef': '牛肉',
    'pork': '豚肉',
    'fish': '魚',
    'lamb': 'ラム肉',
    'turkey': 'ターキー',
    'duck': '鴨肉',
    'rabbit': 'うさぎ肉',
    'horse': '馬肉',
    'venison': '鹿肉'
  };
  return labels[proteinType] || proteinType;
}

// 健康状態の表示名を取得
function getHealthConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    'digestive': '消化器系',
    'skin': '皮膚・被毛',
    'joint': '関節・骨',
    'heart': '心臓',
    'kidney': '腎臓',
    'liver': '肝臓',
    'diabetes': '糖尿病',
    'allergy': 'アレルギー',
    'weight': '体重管理',
    'dental': '歯・口腔',
    'immune': '免疫力',
    'anxiety': 'ストレス・不安'
  };
  return labels[condition] || condition;
}

// 食事シーンの表示名を取得
function getMealSceneLabel(scene: string): string {
  const labels: Record<string, string> = {
    'breakfast': '朝食',
    'lunch': '昼食',
    'dinner': '夕食',
    'snack': 'おやつ',
    'treat': 'ご褒美',
    'shared': 'おんなじご飯'
  };
  return labels[scene] || scene;
}


export default function RecipeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { user, session } = useAuth();
  const [slug, setSlug] = useState<string>('');
  const [recipe, setRecipe] = useState<any>(null);
  const [allRecipes, setAllRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dogProfile, setDogProfile] = useState<DogProfile | null>(null);
  const [adjustedIngredients, setAdjustedIngredients] = useState<AdjustedIngredient[]>([]);
  const [nutritionRequirements, setNutritionRequirements] = useState<DogNutritionRequirements | null>(null);
  const [showAdjustedRecipe, setShowAdjustedRecipe] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // 愛犬プロフィールとプレミアム状態を取得
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !session) return;
      
      try {
        // プレミアム状態を確認
        const premiumResponse = await fetch('/api/stripe/subscription-status', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        if (premiumResponse.ok) {
          const premiumData = await premiumResponse.json();
          setIsPremium(premiumData.isPremium);
        }
        
        // 愛犬プロフィールを取得
        const profileResponse = await fetch(`/api/profile/create?userId=${user.id}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.profiles && profileData.profiles.length > 0) {
            setDogProfile(profileData.profiles[0]); // 最初のプロフィールを使用
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, [user, session]);

  useEffect(() => {
    const initData = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
      
      const [recipeData, recipesData] = await Promise.all([
        getRecipe(resolvedParams.slug),
        getAllRecipes()
      ]);
      
           // デバッグ情報をコンソールに出力
           console.log('Recipe data:', recipeData);
           console.log('Video URL:', recipeData?.videoUrl);
           console.log('Video URL type:', typeof recipeData?.videoUrl);
           console.log('Video URL length:', recipeData?.videoUrl?.length);
           console.log('Thumbnail URL:', recipeData?.thumbnailUrl);
           console.log('Thumbnail URL type:', typeof recipeData?.thumbnailUrl);
           console.log('Instructions:', recipeData?.instructions);
           console.log('Health conditions:', recipeData?.healthConditions);
           console.log('Ingredients:', recipeData?.ingredients);
           console.log('Nutrition info:', recipeData?.nutritionInfo);
           console.log('Servings:', recipeData?.servings);
           
           // 材料データの詳細を確認
           if (recipeData?.ingredients) {
             console.log('Ingredients detailed:');
             recipeData.ingredients.forEach((ingredient: any, index: number) => {
               console.log(`Ingredient ${index + 1}:`, {
                 name: ingredient.name,
                 amount: ingredient.amount,
                 quantity: ingredient.quantity,
                 ingredient_name: ingredient.ingredient_name,
                 full_object: ingredient
               });
             });
           }
      
      // 動画URLの詳細を確認
      if (recipeData?.videoUrl) {
        const convertedMainUrl = convertCloudflareStreamUrl(recipeData.videoUrl);
        console.log('Video URL details:');
        console.log('- Original URL:', recipeData.videoUrl);
        console.log('- Converted URL:', convertedMainUrl);
        console.log('- Contains cloudflarestream:', recipeData.videoUrl.includes('cloudflarestream'));
        console.log('- Contains iframe:', recipeData.videoUrl.includes('iframe'));
        console.log('- Contains customer-:', recipeData.videoUrl.includes('customer-'));
        console.log('- Is valid URL:', isValidVideoUrl(convertedMainUrl));
      }
      
      // 手順動画の詳細を確認
      if (recipeData?.instructions) {
        recipeData.instructions.forEach((instruction: any, index: number) => {
          if (instruction.videoUrl) {
            const convertedUrl = convertInstructionVideoUrl(instruction.videoUrl);
            console.log(`Instruction ${index + 1} video URL:`, instruction.videoUrl);
            console.log(`- Converted URL:`, convertedUrl);
            console.log(`- Is valid:`, isValidVideoUrl(convertedUrl));
          }
        });
      }
      
      setRecipe(recipeData);
      setAllRecipes(recipesData);
      setLoading(false);
    };
    
    initData();
  }, [params]);

  // レシピ閲覧トラッキング
  useEffect(() => {
    if (recipe?.id) {
      return useRecipeTracking(recipe.id);
    }
  }, [recipe?.id]);

  // レシピの分量を愛犬に合わせて調整する関数
  const adjustRecipeForMyDog = async () => {
    if (!recipe || !dogProfile || !isPremium) return;
    
    try {
      // 材料データを準備
      const ingredients = recipe.ingredients?.map((ing: any) => ({
        name: ing.name || ing.ingredient_name || '',
        amount: ing.amount || ing.quantity || ''
      })) || [];
      
      if (ingredients.length === 0) {
        alert('材料情報がありません');
        return;
      }
      
      // 分量調整を実行
      const result = await adjustRecipeForDog(ingredients, dogProfile);
      
      setAdjustedIngredients(result.adjustedIngredients);
      setNutritionRequirements(result.requirements);
      setShowAdjustedRecipe(true);
      
    } catch (error) {
      console.error('Error adjusting recipe:', error);
      alert('分量調整中にエラーが発生しました');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }
  
  if (!recipe) return notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="recipes" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* パンくずリスト */}
        <nav className="mb-4 sm:mb-6">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
            <li><Link href="/" className="hover:text-red-500 whitespace-nowrap">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/recipes" className="hover:text-red-500 whitespace-nowrap">レシピ一覧</Link></li>
            <li>/</li>
            <li className="text-gray-900 truncate">{recipe.title}</li>
          </ol>
        </nav>

        {/* レシピヘッダー */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* メイン動画 */}
          <div className="max-w-md mx-auto p-4">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              {recipe.videoUrl && recipe.videoUrl.trim() !== '' ? (
                (() => {
                  // Cloudflare StreamのURLを正しい形式に変換
                  const convertedUrl = convertCloudflareStreamUrl(recipe.videoUrl);
                  console.log(`Rendering main video:`, convertedUrl);
                  
                  return (
                    <>
                      {/* 動画プレイヤー */}
                      <div className="relative w-full h-full">
            <VideoPlayer
                          src={convertedUrl}
              title={`${recipe.title} - メイン動画`}
                          poster={convertR2ImageUrl(recipe.thumbnailUrl)}
                          className="w-full h-full"
              autoPlay={false}
              muted={true}
              aspectRatio="1:1"
            />
                      </div>
                    </>
                  );
                })()
              ) : (
                <>
                  {recipe.thumbnailUrl && recipe.thumbnailUrl.trim() !== '' ? (
                    <Image
                      src={convertR2ImageUrl(recipe.thumbnailUrl)}
                      alt={recipe.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      className="object-cover"
                      priority={true}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎬</div>
                        <div className="text-gray-500 text-sm font-medium">動画・画像なし</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* レシピ情報 */}
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
                <p className="text-sm sm:text-base text-gray-600 mb-4">{recipe.description}</p>
              </div>
              <div className="flex-shrink-0">
                <FavoriteButton recipeId={recipe.slug} className="p-4" />
              </div>
            </div>

            {/* バッジ */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                {getLifeStageLabel(recipe.lifeStage)}
              </span>
              {recipe.healthConditions.map((condition: any) => (
                <span key={condition} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {getHealthConditionLabel(condition)}
                </span>
              ))}
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {getMealSceneLabel(recipe.mealScene)}
              </span>
              <span className={`px-3 py-1 text-sm rounded-full ${
                recipe.proteinType === 'beef' || recipe.proteinType === 'pork' || recipe.proteinType === 'lamb' || recipe.proteinType === 'horse' || recipe.proteinType === 'deer' || recipe.proteinType === 'wild_boar' || recipe.proteinType === 'kangaroo'
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {getProteinTypeLabel(recipe.proteinType)}
              </span>
            </div>

            {/* 基本情報 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-red-500">{recipe.cookingTimeMinutes}</div>
                <div className="text-xs sm:text-sm text-gray-600">調理時間（分）</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-500">中型犬</div>
                <div className="text-xs sm:text-sm text-gray-600">1日分</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{recipe.nutritionInfo?.calories || 'N/A'}</div>
                <div className="text-xs sm:text-sm text-gray-600">カロリー</div>
              </div>
            </div>
          </div>
        </div>

        {/* 材料 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">材料</h2>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <div className="space-y-3">
              {recipe.ingredients.map((ingredient: any, index: number) => {
                // 材料名を取得（複数のフィールド名に対応）
                const ingredientName = ingredient.name || 
                                     ingredient.ingredient_name || 
                                     ingredient.ingredientName ||
                                     ingredient.title ||
                                     `材料 ${index + 1}`;
                
                // 分量を取得（複数のフィールド名に対応）
                // displayTextが存在する場合はそれを使用（材料名と分量が含まれている）
                let ingredientAmount = '適量';
                
                if (ingredient.displayText) {
                  // displayTextから材料名を除いた分量部分を抽出
                  const name = ingredientName;
                  if (ingredient.displayText.includes(name)) {
                    ingredientAmount = ingredient.displayText.replace(name, '').trim();
                  } else {
                    ingredientAmount = ingredient.displayText;
                  }
                } else {
                  // 従来のフィールドから分量を取得
                  ingredientAmount = ingredient.amount || 
                                   ingredient.quantity || 
                                   ingredient.ingredientAmount ||
                                   ingredient.ingredient_quantity ||
                                   ingredient.unit ||
                                   ingredient.measurement ||
                                   '適量';
                }
                
                // デバッグ情報をコンソールに出力
                console.log(`Displaying ingredient ${index + 1}:`, {
                  name: ingredientName,
                  amount: ingredientAmount,
                  original: ingredient
                });
                
                // displayTextが存在する場合は、材料名と分量を分けずに表示
                if (ingredient.displayText) {
                  return (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm sm:text-base text-gray-900">
                        {ingredient.displayText}
                      </span>
                    </div>
                  );
                }
                
                // 従来の表示方法（材料名と分量を分けて表示）
                return (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm sm:text-base text-gray-900">
                      {ingredientName}
                    </span>
                    <span className="text-sm sm:text-base text-gray-600 font-medium">
                      {ingredientAmount}
                    </span>
                  </div>
                );
              })}
              </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🥘</div>
              <p>材料情報が登録されていません</p>
          </div>
          )}
        </div>

        {/* プレミアム機能: 愛犬に合わせた分量調整 */}
        {user && isPremium && dogProfile && (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-yellow-500 mr-2">⭐</span>
                愛犬に合わせた分量調整
              </h2>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                プレミアム機能
              </span>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4 border border-yellow-200">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">🐕</span>
                <span className="font-semibold text-gray-800">{dogProfile.name}</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>体重: {dogProfile.weight}kg</div>
                <div>ライフステージ: {getLifeStageLabel(dogProfile.lifeStage)}</div>
                <div>活動量: {dogProfile.activityLevel === 'low' ? '低' : dogProfile.activityLevel === 'medium' ? '中' : '高'}</div>
              </div>
            </div>
            
            {!showAdjustedRecipe ? (
              <button
                onClick={adjustRecipeForMyDog}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {dogProfile.name}に合わせて分量を調整する
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">調整された材料</h3>
                  <button
                    onClick={() => setShowAdjustedRecipe(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    元の分量に戻す
                  </button>
                </div>
                
                {/* 調整された材料リスト */}
                <div className="space-y-3">
                  {adjustedIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{ingredient.name}</div>
                        <div className="text-sm text-gray-500">
                          元: {ingredient.originalAmount} → 調整後: {ingredient.adjustedAmount}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>{ingredient.nutrition.calories} kcal</div>
                        <div>P: {ingredient.nutrition.protein}g</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 栄養要件との比較 */}
                {nutritionRequirements && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">栄養要件との比較</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-blue-700 font-medium">必要カロリー</div>
                        <div className="text-lg font-bold text-blue-800">{nutritionRequirements.perMealCalories} kcal</div>
                      </div>
                      <div>
                        <div className="text-blue-700 font-medium">必要タンパク質</div>
                        <div className="text-lg font-bold text-blue-800">{nutritionRequirements.perMealProtein}g</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* プレミアム機能の案内（非プレミアムユーザー向け） */}
        {user && !isPremium && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-yellow-200">
            <div className="text-center">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">愛犬に合わせた分量調整</h3>
              <p className="text-gray-600 mb-4">
                プレミアム会員になると、愛犬の体重・年齢・活動量に基づいて、各レシピの分量を自動調整できます。
              </p>
              <Link
                href="/premium"
                className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
              >
                プレミアムプランを確認する
              </Link>
            </div>
          </div>
        )}

        {/* 作り方 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">作り方</h2>
          {recipe.instructions && recipe.instructions.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
              {recipe.instructions.map((instruction: any, index: number) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0 flex justify-center sm:justify-start">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                      <div className="w-48 mx-auto sm:mx-0">
                        {instruction.videoUrl && instruction.videoUrl.trim() !== '' ? (
                          (() => {
                            const convertedUrl = convertInstructionVideoUrl(instruction.videoUrl);
                            console.log(`Rendering instruction video ${index + 1}:`, convertedUrl);
                            return (
                      <VideoPlayer
                                src={convertedUrl}
                        title={`${recipe.title} - ステップ ${index + 1}`}
                        className="w-full"
                        autoPlay={false}
                        muted={true}
                        aspectRatio="1:1"
                      />
                            );
                          })()
                        ) : (
                          <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl mb-1">🎬</div>
                              <div className="text-gray-500 text-xs font-medium">動画なし</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-900 leading-relaxed">
                      {instruction.text || instruction.description || instruction.step_text || `ステップ ${index + 1}`}
                    </p>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">👨‍🍳</div>
              <p>作り方の情報が登録されていません</p>
            </div>
          )}
        </div>

        {/* 栄養情報 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">栄養情報</h2>
            {recipe.nutritionInfo?.calculated_at && (
              <div className="text-xs text-gray-500">
                計算日時: {new Date(recipe.nutritionInfo.calculated_at).toLocaleDateString('ja-JP')}
              </div>
            )}
          </div>
          {recipe.nutritionInfo && (
            (recipe.nutritionInfo.calories && recipe.nutritionInfo.calories > 0) || 
            (recipe.nutritionInfo.protein && recipe.nutritionInfo.protein > 0) || 
            (recipe.nutritionInfo.fat && recipe.nutritionInfo.fat > 0) || 
            (recipe.nutritionInfo.carbs && recipe.nutritionInfo.carbs > 0)
          ) ? (
            <div className="space-y-4">
              {/* カロリー表示（目立つように上部に配置） */}
              <div className="text-center p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                <div className="text-2xl sm:text-3xl font-bold text-red-600">
                  {recipe.nutritionInfo.calories} kcal
                </div>
                <div className="text-sm text-gray-600 mt-1">総カロリー</div>
              </div>
              
              {/* 栄養素詳細 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-lg sm:text-xl font-bold text-blue-700">
                    {recipe.nutritionInfo.protein}g
                  </div>
              <div className="text-xs sm:text-sm text-gray-600">タンパク質</div>
            </div>
                <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="text-lg sm:text-xl font-bold text-yellow-700">
                    {recipe.nutritionInfo.fat}g
                  </div>
              <div className="text-xs sm:text-sm text-gray-600">脂質</div>
            </div>
                <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-lg sm:text-xl font-bold text-green-700">
                    {recipe.nutritionInfo.carbs}g
                  </div>
              <div className="text-xs sm:text-sm text-gray-600">炭水化物</div>
            </div>
                <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="text-lg sm:text-xl font-bold text-purple-700">
                    {recipe.nutritionInfo.fiber}g
                  </div>
              <div className="text-xs sm:text-sm text-gray-600">食物繊維</div>
            </div>
          </div>
              
            </div>
         ) : (
           <div className="text-center py-8 text-gray-500">
             <div className="text-4xl mb-2">📊</div>
             <p>栄養情報が登録されていません</p>
             <p className="text-sm mt-2">材料から自動計算された栄養情報が表示されます</p>
             <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
               <p className="text-sm text-blue-700">
                 💡 栄養情報は材料の登録時に自動計算されます。<br/>
                 現在の材料: {recipe.ingredients?.length || 0}種類
               </p>
             </div>
           </div>
         )}
        </div>

        {/* プレミアム機能 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">プレミアム機能</h2>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💎</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">このレシピをカスタマイズ</h3>
            <p className="text-gray-600 mb-4 text-sm">
              愛犬の体重や年齢に合わせて、このレシピの分量を自動計算します
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <PremiumButton 
                variant="primary" 
                size="md"
                premiumFeature="レシピカスタマイズ"
                onClick={() => {
                  // プレミアムユーザーの場合はカスタマイズ機能に遷移
                  alert('レシピカスタマイズ機能（開発中）');
                }}
              >
                🎯 レシピをカスタマイズ
              </PremiumButton>
            </div>
          </div>
        </div>

        {/* 関連レシピ */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            {getProteinTypeLabel(recipe.proteinType)}を使った他のレシピ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(() => {
              const relatedRecipes = allRecipes
                .filter(r => r.slug !== recipe.slug && r.proteinType === recipe.proteinType)
                .slice(0, 3);
              
              if (relatedRecipes.length === 0) {
                return (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p>{getProteinTypeLabel(recipe.proteinType)}を使った他のレシピはまだありません</p>
                  </div>
                );
              }
              
              return relatedRecipes.map((relatedRecipe) => (
              <Link key={relatedRecipe.slug} href={`/recipes/${relatedRecipe.slug}`} className="group">
                <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    {relatedRecipe.thumbnailUrl && relatedRecipe.thumbnailUrl.trim() !== '' ? (
                    <Image
                        src={convertR2ImageUrl(relatedRecipe.thumbnailUrl)}
                      alt={relatedRecipe.title}
                      fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2">{relatedRecipe.title}</h3>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                      <span>{relatedRecipe.cookingTimeMinutes}分</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        {getLifeStageLabel(relatedRecipe.lifeStage)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              ));
            })()}
          </div>
        </div>
    </main>

      <Footer />
    </div>
  );
}
