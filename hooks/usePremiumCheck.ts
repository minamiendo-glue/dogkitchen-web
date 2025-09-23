'use client';

import { useAuth } from '@/components/auth/supabase-provider';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface PremiumCheckOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export function usePremiumCheck(options: PremiumCheckOptions = {}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { redirectTo = '/premium', requireAuth = true } = options;

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (loading) return;
      
      if (requireAuth && !user) {
        router.push('/login');
        return;
      }

      try {
        if (user) {
          // Stripeから課金状況をチェック
          const response = await fetch('/api/stripe/subscription-status');
          const data = await response.json();
          
          if (response.ok) {
            setIsPremium(data.isPremium);
            
            if (!data.isPremium) {
              // 未課金の場合はプレミアム機能説明ページにリダイレクト
              const redirectUrl = redirectTo.includes('?') 
                ? `${redirectTo}&redirect=${encodeURIComponent(window.location.pathname)}`
                : `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`;
              router.push(redirectUrl);
              return;
            }
          } else {
            // エラーの場合はモック状態を使用
            const mockPremiumStatus = user?.email === 'test@example.com';
            setIsPremium(mockPremiumStatus);
            
            if (!mockPremiumStatus) {
              const redirectUrl = redirectTo.includes('?') 
                ? `${redirectTo}&redirect=${encodeURIComponent(window.location.pathname)}`
                : `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`;
              router.push(redirectUrl);
              return;
            }
          }
        } else {
          // 未ログインの場合はプレミアムページにリダイレクト
          router.push(redirectTo);
          return;
        }
      } catch (error) {
        console.error('課金状況の確認に失敗しました:', error);
        setError('課金状況の確認に失敗しました');
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user, loading, router, redirectTo, requireAuth]);

  return {
    isPremium,
    isLoading,
    error,
    user,
    loading
  };
}




