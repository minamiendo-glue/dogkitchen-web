'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { R2FileUpload } from '@/components/admin/r2-file-upload';
import { VideoUpload } from '@/components/admin/video-upload';
import { IngredientInput } from '@/components/admin/ingredient-input';
import { InstructionInput } from '@/components/admin/instruction-input';

interface Ingredient {
  name: string;
  unit: string;
  grams: number;
  displayText: string;
}

interface Instruction {
  step: number;
  text: string;
  videoFile?: File;
  videoUrl?: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  servings: string;
  lifeStage: string;
  proteinType: string;
  mealScene: string;
  difficulty: string;
  healthConditions: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
  thumbnailUrl?: string;
  mainVideoId?: string;
  mainVideoUrl?: string;
}

interface EditRecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

function EditRecipePage({ params }: EditRecipePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  // フォームの状態管理
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cookingTime: 0,
    servings: '',
    lifeStage: '',
    proteinType: '',
    mealScene: '',
    difficulty: '',
    healthConditions: [] as string[]
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [thumbnailKey, setThumbnailKey] = useState<string>('');
  const [mainVideoData, setMainVideoData] = useState<{
    id: string;
    playbackUrl: string;
    iframeUrl: string;
    thumbnail: string;
    duration: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // レシピデータを読み込み
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
      
      const recipe: Recipe = data.recipe;
      
      console.log('Fetched recipe data:', recipe);
      
      // フォームデータを設定
      setFormData({
        title: recipe.title,
        description: recipe.description,
        cookingTime: recipe.cookingTime,
        servings: recipe.servings,
        lifeStage: recipe.lifeStage,
        proteinType: recipe.proteinType,
        mealScene: recipe.mealScene,
        difficulty: recipe.difficulty,
        healthConditions: recipe.healthConditions || []
      });
      
      // 材料と手順を設定
      setIngredients(recipe.ingredients || []);
      setInstructions(recipe.instructions || []);
      
      // サムネイルを設定
      if (recipe.thumbnailUrl) {
        setThumbnailUrl(recipe.thumbnailUrl);
      }
      
      // メイン動画を設定
      if (recipe.mainVideoId && recipe.mainVideoUrl) {
        setMainVideoData({
          id: recipe.mainVideoId,
          playbackUrl: recipe.mainVideoUrl,
          iframeUrl: recipe.mainVideoUrl,
          thumbnail: '',
          duration: 0
        });
      }
      
    } catch (err) {
      console.error('Recipe fetch error:', err);
      setError(err instanceof Error ? err.message : '不明なエラー');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // 基本情報
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('cookingTime', formData.cookingTime.toString());
      formDataToSend.append('servings', formData.servings);
      formDataToSend.append('lifeStage', formData.lifeStage);
      formDataToSend.append('proteinType', formData.proteinType);
      formDataToSend.append('mealScene', formData.mealScene);
      formDataToSend.append('difficulty', formData.difficulty);
      formDataToSend.append('healthConditions', JSON.stringify(formData.healthConditions));
      
      // 材料と手順
      formDataToSend.append('ingredients', JSON.stringify(ingredients));
      formDataToSend.append('instructions', JSON.stringify(instructions));
      
      // サムネイル
      if (thumbnailUrl) {
        formDataToSend.append('thumbnailUrl', thumbnailUrl);
      }
      if (thumbnailKey) {
        formDataToSend.append('thumbnailKey', thumbnailKey);
      }
      
      // メイン動画
      if (mainVideoData) {
        formDataToSend.append('mainVideoId', mainVideoData.id);
        formDataToSend.append('mainVideoUrl', mainVideoData.iframeUrl);
      }

      const response = await fetch(`/api/admin/recipes/${resolvedParams.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'レシピの更新に失敗しました');
      }

      if (result.success) {
        router.push(`/admin/recipes/${resolvedParams.id}`);
      } else {
        throw new Error(result.error || 'レシピの更新に失敗しました');
      }

    } catch (err) {
      console.error('Recipe update error:', err);
      setError(err instanceof Error ? err.message : '不明なエラー');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">エラー: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">レシピ編集</h1>
        <p className="text-gray-600 mt-2">既存のレシピを編集します</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本情報 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">基本情報</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                レシピタイトル *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                調理時間 (分) *
              </label>
              <input
                type="number"
                value={formData.cookingTime}
                onChange={(e) => setFormData({ ...formData, cookingTime: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分量 *
              </label>
              <input
                type="text"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="例: 小型犬1日分"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ライフステージ *
              </label>
              <select
                value={formData.lifeStage}
                onChange={(e) => setFormData({ ...formData, lifeStage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">選択してください</option>
                <option value="puppy">子犬</option>
                <option value="adult">成犬</option>
                <option value="senior">シニア</option>
                <option value="all">全年齢</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タンパク質の種類 *
              </label>
              <select
                value={formData.proteinType}
                onChange={(e) => setFormData({ ...formData, proteinType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">選択してください</option>
                <option value="chicken">鶏肉</option>
                <option value="beef">牛肉</option>
                <option value="pork">豚肉</option>
                <option value="fish">魚</option>
                <option value="lamb">ラム</option>
                <option value="turkey">ターキー</option>
                <option value="duck">ダック</option>
                <option value="rabbit">うさぎ</option>
                <option value="venison">鹿肉</option>
                <option value="kangaroo">カンガルー</option>
                <option value="horse">馬肉</option>
                <option value="wild_boar">イノシシ</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食事シーン *
              </label>
              <select
                value={formData.mealScene}
                onChange={(e) => setFormData({ ...formData, mealScene: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">選択してください</option>
                <option value="daily">日常食</option>
                <option value="snack">おやつ</option>
                <option value="special">特別食</option>
                <option value="treat">ご褒美</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                難易度 *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">選択してください</option>
                <option value="easy">簡単</option>
                <option value="medium">普通</option>
                <option value="hard">難しい</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明 *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              対象健康状態
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { value: 'diet', label: 'ダイエット' },
                { value: 'liver_care', label: '肝臓ケア' },
                { value: 'kidney_care', label: '腎臓ケア' },
                { value: 'joint_care', label: '関節ケア' },
                { value: 'skin_care', label: '皮膚ケア' },
                { value: 'digestive_care', label: '消化器ケア' },
                { value: 'heart_care', label: '心臓ケア' },
                { value: 'balanced', label: 'バランス重視' }
              ].map((condition) => (
                <label key={condition.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.healthConditions.includes(condition.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          healthConditions: [...formData.healthConditions, condition.value]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          healthConditions: formData.healthConditions.filter(c => c !== condition.value)
                        });
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{condition.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* サムネイル画像 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">サムネイル画像</h2>
          <R2FileUpload
            onUpload={(url, key) => {
              setThumbnailUrl(url);
              setThumbnailKey(key);
            }}
            currentImageUrl={thumbnailUrl}
            folder="recipes/thumbnails"
            accept="image/*"
          />
        </div>

        {/* メイン動画 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">メイン動画</h2>
          <VideoUpload
            onUpload={(videoData) => setMainVideoData(videoData)}
            currentVideoData={mainVideoData}
          />
        </div>

        {/* 材料 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">材料</h2>
          <IngredientInput
            ingredients={ingredients}
            onIngredientsChange={setIngredients}
          />
        </div>

        {/* 作り方 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">作り方</h2>
          <InstructionInput
            instructions={instructions}
            onInstructionsChange={setInstructions}
          />
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* ボタン */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push(`/admin/recipes/${resolvedParams.id}`)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? '更新中...' : 'レシピを更新'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRecipePage;
