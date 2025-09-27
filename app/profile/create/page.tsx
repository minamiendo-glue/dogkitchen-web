'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/supabase-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cachedFetch, useButtonLoading, getErrorMessage, buttonStyles, LoadingSpinner } from '@/lib/utils/button-optimization';
import { Header } from '@/components/header';

interface DogProfile {
  id: string;
  name: string;
  weight: number;
  activityLevel: 'low' | 'medium' | 'high';
  healthConditions: string[];
  lifeStage: 'puppy' | 'adult' | 'senior';
  breed: string;
}

export default function CreateDogProfile() {
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  
  // デバッグ用: isPremiumの状態変化をログ出力
  useEffect(() => {
    console.log('isPremium state changed:', isPremium);
  }, [isPremium]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isLoading: isSubmitting, executeWithLoading } = useButtonLoading();

  const [formData, setFormData] = useState<Omit<DogProfile, 'id'>>({
    name: '',
    weight: 0,
    activityLevel: 'medium',
    healthConditions: [],
    lifeStage: 'adult',
    breed: ''
  });

  // 課金状況をチェック
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (loading) return;
      
      if (!user || !session) {
        router.push('/login');
        return;
      }

      try {
        // Stripeから課金状況をチェック（キャッシュ付き）
        const response = await cachedFetch('/api/stripe/subscription-status', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        const data = await response.json();
        
        console.log('Premium status check:', {
          responseOk: response.ok,
          responseStatus: response.status,
          data: data,
          isPremium: data.isPremium
        });
        
        if (response.ok) {
          setIsPremium(data.isPremium);
        } else {
          // エラーの場合は未課金として扱う
          console.warn('プレミアム状態の確認に失敗しました。未課金として扱います。');
          setIsPremium(false);
        }
      } catch (error) {
        console.error('課金状況の確認に失敗しました:', error);
        // エラーの場合は未課金として扱う
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user, session, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'weight') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleHealthConditionChange = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user?.id) {
      setError('ユーザー情報が取得できません。再度ログインしてください。');
      return;
    }

    // 未課金の場合はプレミアムページにリダイレクト
    if (!isPremium) {
      router.push('/premium?redirect=/profile/create');
      return;
    }

    try {
      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          userId: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('プロフィールの作成に失敗しました');
      }

      setSuccess('愛犬プロフィールが正常に作成されました！');
      
      // 2秒後にマイページの愛犬プロフィールタブにリダイレクト
      setTimeout(() => {
        router.push('/mypage?tab=dogs');
      }, 2000);

    } catch (error) {
      console.error('プロフィール作成エラー:', error);
      setError('プロフィールの作成に失敗しました。もう一度お試しください。');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h2>
          <p className="text-gray-600 mb-6">愛犬プロフィールを作成するにはログインしてください。</p>
          <Link
            href="/login"
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            ログインページへ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="profile" />

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">愛犬プロフィール作成</h1>
            <p className="text-gray-600">愛犬の詳細情報を入力して、最適な栄養管理を始めましょう</p>
          </div>

          {/* デバッグ情報 */}
          <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
            Debug: isPremium = {isPremium ? 'true' : 'false'}, isLoading = {isLoading ? 'true' : 'false'}
          </div>

          {/* プレミアム機能の案内（未課金の場合） */}
          {!isPremium && (
            <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">⭐</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    プレミアム会員なら愛犬の体にあった分量がわかる！
                  </h3>
                  <p className="text-gray-600 mb-4">
                    愛犬の体重・年齢・活動量に基づいて、各レシピの食材分量を自動調整できます。
                    栄養バランスを考慮した最適な分量で、愛犬の健康をサポートします。
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/premium?redirect=/profile/create"
                      className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <span className="mr-2">⭐</span>
                      愛犬専用の食材分量を見る
                    </Link>
                    <Link
                      href="/premium"
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-yellow-600 border-2 border-yellow-500 font-semibold rounded-lg hover:bg-yellow-50 transition-all duration-200"
                    >
                      プレミアムプランを詳しく見る
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* プレミアム会員向けの案内（課金済みの場合） */}
          {isPremium && (
            <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    プレミアム会員の方は愛犬に合わせた分量調整が利用できます
                  </h3>
                  <p className="text-gray-600 text-sm">
                    プロフィール作成後、各レシピで愛犬専用の食材分量を確認できます
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600">{success}</p>
              <p className="text-green-600 text-sm mt-1">2秒後に愛犬プロフィール画面にリダイレクトします...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 愛犬の名前 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                愛犬の名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="例: ポチ"
              />
            </div>

            {/* 体重 */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                体重 (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight || ''}
                onChange={handleInputChange}
                required
                min="0.1"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="例: 5.5"
              />
            </div>


            {/* ライフステージ */}
            <div>
              <label htmlFor="lifeStage" className="block text-sm font-medium text-gray-700 mb-2">
                ライフステージ <span className="text-red-500">*</span>
              </label>
              <select
                id="lifeStage"
                name="lifeStage"
                value={formData.lifeStage}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="puppy">子犬 (0-1歳)</option>
                <option value="adult">成犬 (1-7歳)</option>
                <option value="senior">シニア (7歳以上)</option>
              </select>
            </div>

            {/* 活動レベル */}
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
                      checked={formData.activityLevel === level.value}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 健康状態 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                健康状態 (該当するものを選択)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'アレルギー',
                  '肥満',
                  '関節炎',
                  '腎臓病',
                  '心臓病',
                  '糖尿病',
                  '皮膚病',
                  '消化器系の問題',
                  '特になし'
                ].map((condition) => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.healthConditions.includes(condition)}
                      onChange={() => handleHealthConditionChange(condition)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 犬種 */}
            <div>
              <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
                犬種 <span className="text-red-500">*</span>
              </label>
              <select
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
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

            {/* 送信ボタン */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
                  isPremium 
                    ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500' 
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 focus:ring-yellow-500'
                }`}
              >
                {isSubmitting ? '作成中...' : (
                  isPremium ? '愛犬プロフィールを作成' : '愛犬プロフィールを追加'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/mypage" 
              className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
            >
              ← マイページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
