'use client';

import { CloudflareVideoPlayer, VideoPreview } from '@/components/cloudflare-video-player';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { VideoPlayer } from '@/components/video-player';

interface Recipe {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  cookingTime: number;
  servings: string;
  lifeStage: string;
  proteinType: string;
  mealScene: string;
  difficulty: string;
  healthConditions: string[];
  ingredients: any[];
  instructions: any[];
  thumbnailUrl?: string;
  mainVideoId?: string;
  mainVideoUrl?: string;
}

interface RecipeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const resolvedParams = use(params);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cloudflare StreamのURL変換関数
  const convertCloudflareStreamUrl = (url: string): string => {
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
  };

  useEffect(() => {
    fetchRecipe();
  }, [resolvedParams.id]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/admin/recipes/${resolvedParams.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'レシピの取得に失敗しました');
      }
      
      if (!data.success || !data.recipe) {
        throw new Error('レシピが見つかりません');
      }
      
      console.log('Fetched recipe data:', data.recipe);
      setRecipe(data.recipe);
    } catch (err) {
      console.error('Recipe fetch error:', err);
      setError(err instanceof Error ? err.message : '不明なエラー');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">エラー: {error}</div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* ページヘッダー */}
        <div className="flex justify-between items-center">
          <div>
            <Link 
              href="/admin/recipes" 
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              ← レシピ一覧に戻る
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{recipe.title}</h1>
            <p className="mt-2 text-gray-600">{recipe.description}</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/admin/recipes/${resolvedParams.id}/edit`}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              編集
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* サムネイル画像 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">サムネイル画像</h3>
              {recipe.thumbnailUrl ? (
                <div className="relative">
                  <img
                    src={recipe.thumbnailUrl}
                    alt={recipe.title}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Image load error:', recipe.thumbnailUrl);
                      const img = e.currentTarget;
                      img.style.display = 'none';
                      // エラー時のフォールバック表示
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-64 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center';
                      fallback.innerHTML = `
                        <div class="text-center text-red-600">
                          <div class="text-2xl mb-2">⚠️</div>
                          <p class="text-sm">画像の読み込みに失敗しました</p>
                          <p class="text-xs mt-1">URL: ${recipe.thumbnailUrl}</p>
                        </div>
                      `;
                      img.parentNode?.insertBefore(fallback, img.nextSibling);
                    }}
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    URL: {recipe.thumbnailUrl}
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">サムネイル画像が設定されていません</p>
                </div>
              )}
            </div>

            {/* メイン動画 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">メイン動画</h3>
              {recipe.mainVideoUrl ? (
                <div className="relative">
                  <VideoPlayer
                    src={convertCloudflareStreamUrl(recipe.mainVideoUrl)}
                    title={`${recipe.title} - メイン動画`}
                    className="w-full"
                    autoPlay={false}
                    muted={true}
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    動画URL: {recipe.mainVideoUrl}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    変換後URL: {convertCloudflareStreamUrl(recipe.mainVideoUrl)}
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">メイン動画が設定されていません</p>
                </div>
              )}
            </div>

            {/* 作り方の手順 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">作り方の手順</h3>
              <div className="space-y-4">
                {recipe.instructions?.map((instruction, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                        {instruction.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-3">{instruction.text}</p>
                        {instruction.videoUrl && (
                          <div className="mt-3">
                            <VideoPlayer
                              src={convertCloudflareStreamUrl(instruction.videoUrl)}
                              title={`${recipe.title} - ステップ ${instruction.step}`}
                              className="w-full"
                              autoPlay={false}
                              muted={true}
                            />
                            <div className="mt-1 text-xs text-gray-400">
                              動画URL: {instruction.videoUrl}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* レシピ情報 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">レシピ情報</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">調理時間</dt>
                  <dd className="text-sm text-gray-900">{recipe.cookingTime}分</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">分量</dt>
                  <dd className="text-sm text-gray-900">{recipe.servings}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">ライフステージ</dt>
                  <dd className="text-sm text-gray-900">{recipe.lifeStage}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">タンパク質の種類</dt>
                  <dd className="text-sm text-gray-900">{recipe.proteinType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">食事シーン</dt>
                  <dd className="text-sm text-gray-900">{recipe.mealScene}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">難易度</dt>
                  <dd className="text-sm text-gray-900">{recipe.difficulty}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">ステータス</dt>
                  <dd className="text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      recipe.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {recipe.status === 'published' ? '公開中' : '下書き'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* 食材・材料 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">食材・材料</h3>
              <ul className="space-y-2">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-900">{ingredient.displayText}</span>
                    <span className="text-xs text-gray-500">{ingredient.grams}g</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 対象健康状態 */}
            {recipe.healthConditions && recipe.healthConditions.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">対象健康状態</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.healthConditions.map((condition, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* デバッグ情報（開発環境のみ） */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">デバッグ情報</h3>
                <div className="text-xs text-yellow-700 space-y-1">
                  <p>レシピID: {recipe.id}</p>
                  <p>サムネイルURL: {recipe.thumbnailUrl || '未設定'}</p>
                  <p>メイン動画ID: {recipe.mainVideoId || '未設定'}</p>
                  <p>メイン動画URL: {recipe.mainVideoUrl || '未設定'}</p>
                  <p>Cloudflare Account ID: {process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || '未設定'}</p>
                  
                  {/* URLテストボタン */}
                  <div className="mt-3 space-x-2">
                    {recipe.thumbnailUrl && (
                      <button
                        onClick={() => {
                          const imageId = recipe.thumbnailUrl?.split('/').pop();
                          if (imageId) {
                            window.open(`/api/debug/urls?type=image&id=${imageId}`, '_blank');
                          }
                        }}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        画像URL確認
                      </button>
                    )}
                    {recipe.mainVideoId && (
                      <button
                        onClick={() => {
                          window.open(`/api/debug/urls?type=video&id=${recipe.mainVideoId}`, '_blank');
                        }}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                      >
                        動画URL確認
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
