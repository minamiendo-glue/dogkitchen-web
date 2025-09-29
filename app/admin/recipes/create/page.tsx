'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { R2FileUpload } from '@/components/admin/r2-file-upload';
import { VideoUpload } from '@/components/admin/video-upload';
import { IngredientInput } from '@/components/admin/ingredient-input';
import { InstructionInput } from '@/components/admin/instruction-input';
import { PlatingImageInput } from '@/components/admin/plating-image-input';

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

interface PlatingImage {
  url: string;
  comment: string;
}

function CreateRecipePage() {
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
    healthConditions: [] as string[],
    recipeType: 'video_steps' as 'video_steps' | 'image_plating'
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [platingImages, setPlatingImages] = useState<PlatingImage[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [thumbnailKey, setThumbnailKey] = useState<string>('');
  const [mainVideoData, setMainVideoData] = useState<{
    id: string;
    playbackUrl: string;
    iframeUrl: string;
    thumbnail: string;
    duration: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | string[] | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecipeTypeChange = (type: 'video_steps' | 'image_plating') => {
    setFormData(prev => ({
      ...prev,
      recipeType: type
    }));
    
    // 表示タイプが変更されたときに、対応するデータをクリア
    if (type === 'video_steps') {
      setPlatingImages([]);
    } else {
      setInstructions([]);
    }
  };

  const handleHealthConditionChange = (condition: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      healthConditions: checked
        ? [...prev.healthConditions, condition]
        : prev.healthConditions.filter(c => c !== condition)
    }));
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    setIsSubmitting(true);
    try {
      // フォームデータの検証
      if (!formData.title || !formData.description || !formData.cookingTime) {
        alert('必須項目を入力してください');
        return;
      }

      if (ingredients.length === 0) {
        alert('食材を少なくとも1つ追加してください');
        return;
      }

      // 表示タイプに応じた検証
      if (formData.recipeType === 'video_steps' && instructions.length === 0) {
        alert('作り方の手順を少なくとも1つ追加してください');
        return;
      }
      
      if (formData.recipeType === 'image_plating' && platingImages.length === 0) {
        alert('盛り付け画像を少なくとも1つ追加してください');
        return;
      }

      // FormDataを作成
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('cookingTime', formData.cookingTime.toString());
      submitData.append('servings', formData.servings);
      submitData.append('lifeStage', formData.lifeStage);
      submitData.append('proteinType', formData.proteinType);
      submitData.append('mealScene', formData.mealScene);
      submitData.append('difficulty', formData.difficulty);
      submitData.append('healthConditions', JSON.stringify(formData.healthConditions));
      submitData.append('ingredients', JSON.stringify(ingredients));
      submitData.append('instructions', JSON.stringify(instructions));
      submitData.append('platingImages', JSON.stringify(platingImages));
      submitData.append('recipeType', formData.recipeType);
      submitData.append('status', status);

      // サムネイル画像のURLを追加（R2から）
      if (thumbnailUrl) {
        submitData.append('thumbnailUrl', thumbnailUrl);
      }
      if (mainVideoData) {
        submitData.append('mainVideoId', mainVideoData.id);
        submitData.append('mainVideoUrl', mainVideoData.iframeUrl);
      }
      
      // 手順の動画ファイルを追加
      instructions.forEach((instruction, index) => {
        if (instruction.videoFile) {
          submitData.append(`instructionVideo_${index}`, instruction.videoFile);
        }
      });

      // APIエンドポイントに送信
      const response = await fetch('/api/admin/recipes', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '保存に失敗しました');
      }

      alert(`${status === 'draft' ? '下書き' : 'レシピ'}として保存しました`);
      
      // レシピ一覧画面に遷移
      router.push('/admin/recipes');

    } catch (error) {
      console.error('エラー:', error);
      alert(`保存中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
      <div className="space-y-6">
        {/* ページヘッダー */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">新しいレシピを作成</h1>
          <p className="mt-2 text-gray-600">
            愛犬のための新しいレシピを追加します
          </p>
        </div>

        {/* レシピフォーム */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">レシピ情報</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* 基本情報 */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">基本情報</h4>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    レシピタイトル *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="例: チキンと野菜のヘルシーご飯"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    説明 *
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="レシピの簡単な説明を入力してください"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700">
                      調理時間（分） *
                    </label>
                    <input
                      type="number"
                      id="cookingTime"
                      value={formData.cookingTime}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value === '' ? 0 : parseInt(value) || 0;
                        handleInputChange('cookingTime', numValue);
                      }}
                      placeholder="30"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="servings" className="block text-sm font-medium text-gray-700">
                      分量
                    </label>
                    <input
                      type="text"
                      id="servings"
                      value={formData.servings}
                      onChange={(e) => handleInputChange('servings', e.target.value)}
                      placeholder="例: 1食分"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* カテゴリ情報 */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">カテゴリ情報</h4>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="lifeStage" className="block text-sm font-medium text-gray-700">
                      ライフステージ *
                    </label>
                    <select
                      id="lifeStage"
                      value={formData.lifeStage}
                      onChange={(e) => handleInputChange('lifeStage', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    >
                      <option value="">選択してください</option>
                      <option value="puppy">子犬期（出生～約6ヶ月）</option>
                      <option value="adult">成犬期（約2歳～7歳）</option>
                      <option value="senior">シニア期（約7歳～）</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="proteinType" className="block text-sm font-medium text-gray-700">
                      タンパク質の種類 *
                    </label>
                    <select
                      id="proteinType"
                      value={formData.proteinType}
                      onChange={(e) => handleInputChange('proteinType', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    >
                      <option value="">選択してください</option>
                      <option value="chicken">鶏</option>
                      <option value="beef">牛</option>
                      <option value="pork">豚</option>
                      <option value="fish">魚</option>
                      <option value="horse">馬</option>
                      <option value="kangaroo">カンガルー</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="mealScene" className="block text-sm font-medium text-gray-700">
                      食事シーン *
                    </label>
                    <select
                      id="mealScene"
                      value={formData.mealScene}
                      onChange={(e) => handleInputChange('mealScene', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    >
                      <option value="">選択してください</option>
                      <option value="daily">日常ご飯</option>
                      <option value="snack">おやつ</option>
                      <option value="special">特別な日</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                      難易度
                    </label>
                    <select
                      id="difficulty"
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    >
                      <option value="">選択してください</option>
                      <option value="easy">簡単</option>
                      <option value="medium">普通</option>
                      <option value="hard">難しい</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 健康状態 */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">対象健康状態</h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {[
                    { key: 'balanced', label: 'バランスGood' },
                    { key: 'diet', label: 'ダイエット' },
                    { key: 'weight_gain', label: '体重増加' },
                    { key: 'cold', label: '冷え' },
                    { key: 'hot', label: '熱中症対策' },
                    { key: 'digestive', label: 'お腹が弱い' },
                    { key: 'joint_care', label: '関節ケア' },
                    { key: 'heart_care', label: '心臓ケア' },
                    { key: 'kidney_care', label: '腎臓ケア' },
                    { key: 'liver_care', label: '肝臓ケア' },
                    { key: 'skin_care', label: '皮膚ケア' },
                    { key: 'appetite', label: '嗜好性UP' }
                  ].map((condition) => (
                    <label key={condition.key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.healthConditions.includes(condition.key)}
                        onChange={(e) => handleHealthConditionChange(condition.key, e.target.checked)}
                        className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {condition.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* メディアアップロード */}
              <div className="space-y-6">
                <h4 className="text-md font-medium text-gray-900">メディア</h4>
                
                {/* サムネイル画像 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    サムネイル画像 *
                  </label>
                  <R2FileUpload
                    accept="image/*"
                    maxSize={10}
                    category="recipes/thumbnails"
                    onFileUploaded={(url, key) => {
                      setThumbnailUrl(url);
                      setThumbnailKey(key);
                    }}
                    onFileRemoved={() => {
                      setThumbnailUrl('');
                      setThumbnailKey('');
                    }}
                    preview={true}
                    currentUrl={thumbnailUrl}
                  />
                </div>

                {/* メイン動画 */}
                <VideoUpload
                  label="メイン動画（任意）"
                  type="main"
                  onVideoUploaded={setMainVideoData}
                  onError={(error) => alert(error)}
                />
              </div>

              {/* 食材・材料 */}
              <IngredientInput
                ingredients={ingredients}
                onChange={setIngredients}
              />

              {/* 作り方の表示タイプ選択 */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">作り方の表示形式</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="relative flex cursor-pointer rounded-lg p-4 focus:outline-none">
                    <input
                      type="radio"
                      name="recipeType"
                      value="video_steps"
                      checked={formData.recipeType === 'video_steps'}
                      onChange={() => handleRecipeTypeChange('video_steps')}
                      className="sr-only"
                    />
                    <div className={`flex-1 rounded-lg border-2 p-4 ${
                      formData.recipeType === 'video_steps'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white'
                    }`}>
                      <div className="flex items-center">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">ステップ動画形式</div>
                          <div className="text-gray-500">調理手順を動画で説明</div>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="relative flex cursor-pointer rounded-lg p-4 focus:outline-none">
                    <input
                      type="radio"
                      name="recipeType"
                      value="image_plating"
                      checked={formData.recipeType === 'image_plating'}
                      onChange={() => handleRecipeTypeChange('image_plating')}
                      className="sr-only"
                    />
                    <div className={`flex-1 rounded-lg border-2 p-4 ${
                      formData.recipeType === 'image_plating'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white'
                    }`}>
                      <div className="flex items-center">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">盛り付け画像形式</div>
                          <div className="text-gray-500">完成した料理の画像で説明</div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* 作り方の手順（動画形式の場合） */}
              {formData.recipeType === 'video_steps' && (
                <InstructionInput
                  instructions={instructions}
                  onChange={setInstructions}
                />
              )}

              {/* 盛り付け画像（画像形式の場合） */}
              {formData.recipeType === 'image_plating' && (
                <PlatingImageInput
                  platingImages={platingImages}
                  onChange={setPlatingImages}
                />
              )}
            </div>
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="flex justify-end space-x-4">
          <button 
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            {isSubmitting ? '保存中...' : '下書き保存'}
          </button>
          <button 
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            {isSubmitting ? '公開中...' : 'レシピを公開'}
          </button>
        </div>
      </div>
  );
}

export default function CreateRecipePageWrapper() {
  return <CreateRecipePage />;
}
