'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/supabase-provider';
import { cachedFetch, useButtonLoading, getErrorMessage, buttonStyles, LoadingSpinner, clearCache } from '@/lib/utils/button-optimization';
import { trackFavorite } from '@/lib/utils/analytics';

interface FavoriteButtonProps {
  recipeId: string;
  className?: string;
}

export function FavoriteButton({ recipeId, className = '' }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const { isLoading, executeWithLoading } = useButtonLoading();

  // サーバーからお気に入り状態を読み込み（キャッシュ付き）
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user?.id) {
        setIsFavorite(false);
        return;
      }
      
      try {
        const response = await cachedFetch(`/api/favorites?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const isFav = data.favorites.some((fav: any) => fav.recipe_id === recipeId);
          setIsFavorite(isFav);
        }
      } catch (error) {
        console.error('お気に入り状態取得エラー:', error);
        setIsFavorite(false);
      }
    };

    fetchFavoriteStatus();
  }, [recipeId, user]);

  const toggleFavorite = async () => {
    if (!user?.id) {
      alert('ログインが必要です');
      return;
    }

    await executeWithLoading(async () => {
      try {
        const method = isFavorite ? 'DELETE' : 'POST';
        let response;
        
        if (method === 'DELETE') {
          response = await fetch(`/api/favorites?recipeId=${recipeId}&userId=${user.id}`, {
            method: 'DELETE'
          });
        } else {
          response = await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipeId, userId: user.id })
          });
        }

        if (response.ok) {
          const newFavoriteState = !isFavorite;
          setIsFavorite(newFavoriteState);
          
          // トラッキング
          trackFavorite(recipeId, newFavoriteState ? 'add' : 'remove');
          
          // キャッシュをクリア
          clearCache(`/api/favorites?userId=${user.id}`);
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'エラーが発生しました');
        }
        
      } catch (error) {
        console.error('お気に入り切り替えエラー:', error);
        alert(getErrorMessage(error));
      }
    });
  };

  // ログインしていない場合は非表示
  if (!user) {
    return null;
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`transition-colors ${className} ${
        isFavorite 
          ? 'text-red-500 hover:text-red-600 bg-red-50' 
          : 'text-gray-600 hover:text-red-500 bg-gray-50'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} hover:bg-gray-100 rounded-full border border-gray-200`}
      title={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <svg 
          className="w-8 h-8" 
          fill={isFavorite ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      )}
    </button>
  );
}

