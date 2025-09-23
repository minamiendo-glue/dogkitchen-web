'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/components/auth/supabase-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { DogProfile } from '@/lib/data/mock-dog-profiles'; // Supabaseに移行
// import { mockRecipes } from '@/lib/data/mock-recipes'; // Supabaseに移行
import { SubscriptionManager } from '@/components/subscription-manager';
import { Header } from '@/components/header';

interface FavoriteRecipe {
  id: string;
  userId: string;
  recipeId: string;
  createdAt: string;
}

interface DogProfile {
  id: string;
  name: string;
  weight: number;
  activityLevel: 'low' | 'medium' | 'high';
  healthConditions: string[];
  lifeStage: 'puppy' | 'junior' | 'adult' | 'senior' | 'elderly';
  breed: string;
}

export default function MyPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { user, session, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'dogs' | 'favorites'>('profile');
  const [dogProfiles, setDogProfiles] = useState<DogProfile[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<FavoriteRecipe[]>([]);
  const [isPremium, setIsPremium] = useState(false);

  // React.use()を使用してsearchParamsを取得
  const resolvedSearchParams = use(searchParams);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // プレミアム状態を取得
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user || !session) return;
      
      try {
        const response = await fetch('/api/stripe/subscription-status', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIsPremium(data.isPremium);
        } else {
          setIsPremium(false);
        }
      } catch (error) {
        console.error('プレミアム状態の確認に失敗しました:', error);
        setIsPremium(false);
      }
    };

    checkPremiumStatus();
  }, [user, session]);

  // URLパラメータからタブを設定
  useEffect(() => {
    if (resolvedSearchParams.tab === 'dogs') {
      setActiveTab('dogs');
      // 愛犬プロフィールタブに遷移した場合はデータを再取得
      refreshProfiles();
    } else if (resolvedSearchParams.tab === 'favorites') {
      setActiveTab('favorites');
      // お気に入りタブに遷移した場合はデータを再取得
      refreshFavorites();
    }
  }, [resolvedSearchParams.tab]);

  useEffect(() => {
    // 愛犬プロフィールをAPIから取得
    const fetchDogProfiles = async () => {
      if (!user?.id || !session) return;
      
      try {
        const response = await fetch(`/api/profile/create?userId=${user.id}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDogProfiles(data.profiles || []);
        } else {
          console.warn('プロフィール取得に失敗しました');
          setDogProfiles([]);
        }
      } catch (error) {
        console.error('プロフィール取得エラー:', error);
        setDogProfiles([]);
      }
    };

    fetchDogProfiles();
    fetchFavorites();
  }, [user, session]);

  const fetchFavorites = async () => {
    if (!user || !session) return;
    
    try {
      const response = await fetch('/api/favorites', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFavoriteRecipes(data.favorites || []);
      }
    } catch (error) {
      console.error('お気に入り取得エラー:', error);
    }
  };

  // プロフィール作成後にデータを再取得
  const refreshProfiles = async () => {
    if (!user?.id || !session) return;
    
    try {
      const response = await fetch(`/api/profile/create?userId=${user.id}`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDogProfiles(data.profiles || []);
      }
    } catch (error) {
      console.error('プロフィール再取得エラー:', error);
    }
  };

  // お気に入りデータを再取得
  const refreshFavorites = async () => {
    if (!user || !session) return;
    
    try {
      const response = await fetch('/api/favorites', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFavoriteRecipes(data.favorites || []);
      }
    } catch (error) {
      console.error('お気に入り再取得エラー:', error);
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

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="mypage" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            こんにちは、{user?.user_metadata?.name || user?.email}さん！
          </h1>
          <p className="text-gray-600">
            愛犬の健康管理をサポートするDOG KITCHENへようこそ
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                プロフィール
              </button>
              <button
                onClick={() => setActiveTab('dogs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dogs'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                愛犬プロフィール
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'favorites'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                お気に入りレシピ
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ユーザー情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        名前
                      </label>
                      <input
                        type="text"
                        value={user?.user_metadata?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        メールアドレス
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <SubscriptionManager />
              </div>
            )}

            {/* Dogs Tab */}
            {activeTab === 'dogs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">愛犬プロフィール</h3>
                  {isPremium ? (
                    <Link 
                      href="/profile/create" 
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      愛犬プロフィールを追加
                    </Link>
                  ) : (
                    <Link 
                      href="/premium?redirect=/mypage?tab=dogs" 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors"
                    >
                      プレミアムプランを詳しく見る
                    </Link>
                  )}
                </div>

                {/* プレミアム機能の案内（未課金の場合） */}
                {!isPremium && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-2xl">⭐</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          プレミアム会員なら愛犬の体にあった分量がわかる！
                        </h4>
                        <p className="text-gray-600 mb-4">
                          愛犬の体重・年齢・活動量に基づいて、各レシピの食材分量を自動調整できます。
                          栄養バランスを考慮した最適な分量で、愛犬の健康をサポートします。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link
                            href="/premium?redirect=/mypage?tab=dogs"
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
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">✓</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          プレミアム会員の方は愛犬に合わせた分量調整が利用できます
                        </h4>
                        <p className="text-gray-600 text-sm">
                          愛犬プロフィールを作成後、各レシピで愛犬専用の食材分量を確認できます
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dogProfiles.map((dog) => (
                    <div key={dog.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{dog.name}</h4>
                        <Link
                          href={`/profile/edit?id=${dog.id}`}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
                        >
                          編集
                        </Link>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">体重:</span> {dog.weight}kg</p>
                        <p><span className="font-medium">ライフステージ:</span> {
                          dog.lifeStage === 'puppy' ? '子犬期' :
                          dog.lifeStage === 'junior' ? 'ジュニア期' :
                          dog.lifeStage === 'adult' ? '成犬期' :
                          dog.lifeStage === 'senior' ? 'シニア期' : '老年期'
                        }</p>
                        <p><span className="font-medium">活動量:</span> {
                          dog.activityLevel === 'low' ? '低い' :
                          dog.activityLevel === 'medium' ? '普通' : '高い'
                        }</p>
                        {dog.breed && <p><span className="font-medium">犬種:</span> {dog.breed}</p>}
                        <p><span className="font-medium">健康状態:</span> {dog.healthConditions.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">お気に入りレシピ</h3>
                  <span className="text-sm text-gray-500">{favoriteRecipes.length}件</span>
                </div>
                
                {favoriteRecipes.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">お気に入りレシピがありません</h4>
                    <p className="text-gray-600 mb-4">気になるレシピを見つけたら、ハートマークをクリックしてお気に入りに追加しましょう</p>
                    <Link 
                      href="/" 
                      className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      レシピを探す
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">お気に入り機能を準備中</h4>
                    <p className="text-gray-600 mb-4">お気に入り機能は現在開発中です。近日公開予定です。</p>
                    <Link 
                      href="/" 
                      className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      レシピを探す
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
