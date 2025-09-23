'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/supabase-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';

// DogProfile型定義
interface DogProfile {
  id: string;
  userId: string;
  name: string;
  weight: number;
  activityLevel: 'low' | 'medium' | 'high';
  healthConditions: string[];
  lifeStage: 'puppy' | 'adult' | 'senior';
  breed: string;
  createdAt: string;
}

const healthConditions = [
  'アレルギー',
  '肥満',
  '関節炎',
  '腎臓病',
  '心臓病',
  '糖尿病',
  '皮膚病',
  '消化器系の問題',
  '特になし'
];

export default function EditDogProfile() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [dogProfile, setDogProfile] = useState<DogProfile>({
    id: '',
    userId: '',
    name: '',
    weight: 0,
    activityLevel: 'medium',
    healthConditions: [],
    lifeStage: 'adult',
    breed: '',
    createdAt: ''
  });
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    // URLパラメータからIDを取得
    const profileId = searchParams.get('id');
    
    if (profileId) {
      // APIからプロフィールデータを取得
      const fetchProfile = async () => {
        if (!user || !session) return;
        
        try {
          const response = await fetch('/api/profile/create', {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            const profile = data.profiles.find((p: DogProfile) => p.id === profileId);
            if (profile) {
              setDogProfile(profile);
            } else {
              console.error('プロフィールが見つかりません');
              router.push('/mypage?tab=dogs');
            }
          } else {
            console.error('プロフィール取得に失敗しました');
            router.push('/mypage?tab=dogs');
          }
        } catch (error) {
          console.error('プロフィール取得エラー:', error);
          router.push('/mypage?tab=dogs');
        }
      };
      
      fetchProfile();
    }
  }, [searchParams, router, user, session]);

  const handleInputChange = (field: keyof DogProfile, value: string | number | string[]) => {
    setDogProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHealthConditionChange = (condition: string, checked: boolean) => {
    setDogProfile(prev => ({
      ...prev,
      healthConditions: checked
        ? [...prev.healthConditions, condition]
        : prev.healthConditions.filter(c => c !== condition)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify(dogProfile),
      });

      if (response.ok) {
        router.push('/mypage?tab=dogs');
      } else {
        console.error('プロフィール更新に失敗しました');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('この愛犬のプロフィールを削除してもよろしいですか？この操作は取り消せません。')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ id: dogProfile.id }),
      });

      if (response.ok) {
        router.push('/mypage?tab=dogs');
      } else {
        console.error('プロフィール削除に失敗しました');
        alert('プロフィールの削除に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="profile" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href="/mypage" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">愛犬プロフィール編集</h1>
          </div>
          <p className="text-gray-600">
            愛犬の情報を更新して、より適切なレシピ提案を受けましょう
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">基本情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    愛犬の名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={dogProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    犬種 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={dogProfile.breed}
                    onChange={(e) => handleInputChange('breed', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">犬種を選択してください</option>
                    <optgroup label="小型犬（あいうえお順）">
                      <option value="アーフェンピンシャー">アーフェンピンシャー</option>
                      <option value="アメリカンコッカースパニエル">アメリカンコッカースパニエル</option>
                      <option value="イタリアングレーハウンド">イタリアングレーハウンド</option>
                      <option value="イングリッシュコッカースパニエル">イングリッシュコッカースパニエル</option>
                      <option value="イングリッシュトイスパニエル">イングリッシュトイスパニエル</option>
                      <option value="ウェストハイランドホワイトテリア">ウェストハイランドホワイトテリア</option>
                      <option value="ウェルシュコーギーペンブローク">ウェルシュコーギーペンブローク</option>
                      <option value="ウェルシュテリア">ウェルシュテリア</option>
                      <option value="エアデールテリア">エアデールテリア</option>
                      <option value="オーストラリアンテリア">オーストラリアンテリア</option>
                      <option value="カニンヘンダックスフンド">カニンヘンダックスフンド</option>
                      <option value="キャバリアキングチャールズスパニエル">キャバリアキングチャールズスパニエル</option>
                      <option value="キングチャールズスパニエル">キングチャールズスパニエル</option>
                      <option value="ケアーンテリア">ケアーンテリア</option>
                      <option value="コッカースパニエル">コッカースパニエル</option>
                      <option value="シェットランドシープドッグ">シェットランドシープドッグ</option>
                      <option value="シーズー">シーズー</option>
                      <option value="ジャックラッセルテリア">ジャックラッセルテリア</option>
                      <option value="スコティッシュテリア">スコティッシュテリア</option>
                      <option value="スピッツ">スピッツ</option>
                      <option value="ダックスフンド">ダックスフンド</option>
                      <option value="チワワ">チワワ</option>
                      <option value="トイプードル">トイプードル</option>
                      <option value="パグ">パグ</option>
                      <option value="パピヨン">パピヨン</option>
                      <option value="ビーグル">ビーグル</option>
                      <option value="フレンチブルドッグ">フレンチブルドッグ</option>
                      <option value="ボストンテリア">ボストンテリア</option>
                      <option value="ポメラニアン">ポメラニアン</option>
                      <option value="マルチーズ">マルチーズ</option>
                      <option value="ミニチュアダックスフンド">ミニチュアダックスフンド</option>
                      <option value="ミニチュアシュナウザー">ミニチュアシュナウザー</option>
                      <option value="ミニチュアピンシャー">ミニチュアピンシャー</option>
                      <option value="ヨークシャーテリア">ヨークシャーテリア</option>
                    </optgroup>
                    <optgroup label="中型犬（あいうえお順）">
                      <option value="アメリカンフォックスハウンド">アメリカンフォックスハウンド</option>
                      <option value="オーストラリアンシェパード">オーストラリアンシェパード</option>
                      <option value="コーギー">コーギー</option>
                      <option value="コリー">コリー</option>
                      <option value="柴犬">柴犬</option>
                      <option value="ジャーマンシェパード">ジャーマンシェパード</option>
                      <option value="ボーダーコリー">ボーダーコリー</option>
                      <option value="ボクサー">ボクサー</option>
                      <option value="ラブラドールレトリバー">ラブラドールレトリバー</option>
                    </optgroup>
                    <optgroup label="大型犬（あいうえお順）">
                      <option value="グレートデーン">グレートデーン</option>
                      <option value="ゴールデンレトリバー">ゴールデンレトリバー</option>
                      <option value="サモエド">サモエド</option>
                      <option value="セントバーナード">セントバーナード</option>
                      <option value="ドーベルマン">ドーベルマン</option>
                      <option value="ロットワイラー">ロットワイラー</option>
                    </optgroup>
                    <optgroup label="ミックス犬種">
                      <option value="ミックス（小型）">ミックス（小型）</option>
                      <option value="ミックス（中型）">ミックス（中型）</option>
                      <option value="ミックス（大型）">ミックス（大型）</option>
                      <option value="ミックス（サイズ不明）">ミックス（サイズ不明）</option>
                    </optgroup>
                    <optgroup label="その他">
                      <option value="その他">その他</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    体重 (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="100"
                    value={dogProfile.weight}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === '' ? 0 : parseFloat(value) || 0;
                      handleInputChange('weight', numValue);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Life Stage */}
            <div>
              <label htmlFor="lifeStage" className="block text-sm font-medium text-gray-700 mb-2">
                ライフステージ <span className="text-red-500">*</span>
              </label>
              <select
                id="lifeStage"
                name="lifeStage"
                value={dogProfile.lifeStage}
                onChange={(e) => handleInputChange('lifeStage', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="puppy">子犬 (0-1歳)</option>
                <option value="adult">成犬 (1-7歳)</option>
                <option value="senior">シニア (7歳以上)</option>
              </select>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                活動レベル <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {[
                  { value: 'low', label: '低い (散歩は短時間、室内中心)' },
                  { value: 'medium', label: '普通 (1日1-2回の散歩)' },
                  { value: 'high', label: '高い (長時間の散歩、運動が好き)' }
                ].map((level) => (
                  <label key={level.value} className="flex items-center">
                    <input
                      type="radio"
                      name="activityLevel"
                      value={level.value}
                      checked={dogProfile.activityLevel === level.value}
                      onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Health Conditions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                健康状態 (該当するものを選択)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {healthConditions.map((condition) => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={dogProfile.healthConditions.includes(condition)}
                      onChange={(e) => handleHealthConditionChange(condition, e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? '削除中...' : '削除'}
              </button>
              <div className="flex space-x-4">
                <Link
                  href="/mypage?tab=dogs"
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
