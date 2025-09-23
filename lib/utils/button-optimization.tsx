// ボタン最適化のためのユーティリティ
import { useState, useEffect } from 'react';

// API呼び出しのキャッシュ
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5分

// キャッシュクリア機能
export function clearCache(key?: string) {
  if (key) {
    apiCache.delete(key);
  } else {
    apiCache.clear();
  }
}

// キャッシュ付きAPI呼び出し
export async function cachedFetch(
  url: string,
  options?: RequestInit,
  cacheKey?: string
): Promise<Response> {
  const key = cacheKey || url;
  const now = Date.now();
  
  // キャッシュをチェック
  if (apiCache.has(key)) {
    const cached = apiCache.get(key)!;
    if (now - cached.timestamp < CACHE_DURATION) {
      // キャッシュが有効な場合は、レスポンスオブジェクトを模擬
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // キャッシュが期限切れの場合は削除
      apiCache.delete(key);
    }
  }

  try {
    // 認証が必要なAPIの場合は、Supabaseセッションからトークンを取得
    let enhancedOptions = { ...options };
    if (url.includes('/api/stripe/') || url.includes('/api/profile/')) {
      try {
        // 動的インポートでSupabaseクライアントを取得
        const { supabase } = await import('@/lib/supabase');
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          console.log('cachedFetch - Supabase session:', {
            hasSession: !!session,
            hasAccessToken: !!session?.access_token,
            userEmail: session?.user?.email
          });
          if (session?.access_token) {
            enhancedOptions.headers = {
              ...enhancedOptions.headers,
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            };
          }
        }
      } catch (error) {
        console.warn('Failed to get Supabase session for cachedFetch:', error);
      }
    }

    const response = await fetch(url, {
      ...enhancedOptions,
      credentials: 'include', // Cookieを含めてリクエストを送信
    });
    
    console.log('cachedFetch - Response:', {
      url,
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    // GETリクエストで成功した場合のみキャッシュに保存
    if (response.ok && (!options?.method || options.method === 'GET')) {
      const data = await response.clone().json();
      apiCache.set(key, { data, timestamp: now });
    }
    
    return response;
  } catch (error) {
    // エラーの場合はキャッシュから削除
    apiCache.delete(key);
    throw error;
  }
}

// ボタンのローディング状態管理（最適化版）
export function useButtonLoading() {
  const [isLoading, setIsLoading] = useState(false);
  
  const executeWithLoading = async <T>(
    asyncFunction: () => Promise<T>
  ): Promise<T | null> => {
    if (isLoading) return null;
    
    // 即座にローディング状態を設定してUIの反応を改善
    setIsLoading(true);
    
    try {
      // 非同期処理を実行
      const result = await asyncFunction();
      return result;
    } catch (error) {
      console.error('Button action error:', error);
      throw error;
    } finally {
      // 最小限の遅延を追加してUIの安定性を確保
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  };

  return { isLoading, executeWithLoading };
}

// エラーハンドリングのユーティリティ
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'ネットワークエラーが発生しました。インターネット接続を確認してください';
    }
    if (message.includes('認証') || message.includes('unauthorized')) {
      return 'ログインが必要です';
    }
    if (message.includes('stripe') || message.includes('payment')) {
      return '決済システムのエラーが発生しました。しばらく時間をおいて再度お試しください';
    }
    if (message.includes('timeout')) {
      return '処理がタイムアウトしました。再度お試しください';
    }
    
    return error.message;
  }
  
  return '予期しないエラーが発生しました';
}

// ボタンの共通スタイル（最適化版）
export const buttonStyles = {
  base: 'font-medium rounded-lg transition-all duration-150 transform hover:-translate-y-0.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  primary: 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:from-red-600 hover:to-orange-600 active:from-red-700 active:to-orange-700',
  secondary: 'bg-white text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600',
  outline: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:border-red-500 hover:text-red-500 active:bg-red-50',
  sizes: {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  }
};

// ローディングスピナーのコンポーネント
export function LoadingSpinner({ size = 'sm', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin ${className}`} />
  );
}

// デバウンス機能
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
