'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/supabase-provider';
import { supabase } from '@/lib/supabase';
import { PaymentButton } from './payment-button';

interface SubscriptionData {
  isPremium: boolean;
  subscription: {
    id: string;
    status: string;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
  } | null;
}

export function SubscriptionManager() {
  const { user, loading } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      console.log('Subscription Manager - Fetching subscription status for user:', {
        hasUser: !!user,
        userId: user?.id,
        userEmail: user?.email
      });
      
      // 現在のCookieを確認
      console.log('Current cookies:', document.cookie);
      
      // Supabaseのセッションからアクセストークンを取得
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Supabase session:', {
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        tokenLength: session?.access_token?.length,
        userEmail: session?.user?.email
      });
      
      const response = await fetch('/api/stripe/subscription-status', {
        credentials: 'include', // Cookieを含めてリクエストを送信
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && {
            'Authorization': `Bearer ${session.access_token}`
          }),
        },
      });
      
      console.log('Subscription Manager - Response status:', response.status);
      console.log('Subscription Manager - Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      setSubscriptionData(data);
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('サブスクリプションをキャンセルしますか？現在の期間終了までご利用いただけます。')) {
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch('/api/stripe/subscription-status', {
        method: 'DELETE',
        credentials: 'include', // Cookieを含めてリクエストを送信
      });

      if (response.ok) {
        alert('サブスクリプションがキャンセルされました。現在の期間終了までご利用いただけます。');
        fetchSubscriptionStatus(); // 状態を再取得
      } else {
        alert('キャンセル処理でエラーが発生しました。');
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('キャンセル処理でエラーが発生しました。');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading || isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">プレミアム機能</h3>
        <p className="text-gray-600 mb-6">ログインしてプレミアム機能をご利用ください</p>
        <PaymentButton />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">プレミアム機能</h3>
      
      {subscriptionData?.isPremium ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-800 font-medium">プレミアム会員</span>
            </div>
            <p className="text-green-700 text-sm">
              愛犬の健康管理をサポートする全機能をご利用いただけます
            </p>
          </div>

          {subscriptionData.subscription && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ステータス:</span>
                <span className="font-medium">
                  {subscriptionData.subscription.cancelAtPeriodEnd ? 'キャンセル予定' : 'アクティブ'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">次回更新日:</span>
                <span className="font-medium">
                  {formatDate(subscriptionData.subscription.currentPeriodEnd)}
                </span>
              </div>
            </div>
          )}

          {subscriptionData.subscription?.cancelAtPeriodEnd ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                サブスクリプションはキャンセルされています。
                {subscriptionData.subscription && (
                  <> {formatDate(subscriptionData.subscription.currentPeriodEnd)} までご利用いただけます。</>
                )}
              </p>
            </div>
          ) : (
            <button
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isCancelling ? '処理中...' : 'サブスクリプションをキャンセル'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">月額 500円</div>
            <p className="text-gray-600 text-sm mb-6">
              愛犬の健康管理をサポートする全機能をご利用いただけます
            </p>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>個別栄養計算</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>分量自動調整</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>愛犬プロフィール管理</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>専門家への相談</span>
            </div>
          </div>

          <PaymentButton className="w-full">
            プレミアムにアップグレード
          </PaymentButton>
        </div>
      )}
    </div>
  );
}




