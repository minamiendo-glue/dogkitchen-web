'use client';

import { useAuth } from '@/components/auth/supabase-provider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cachedFetch, useButtonLoading, getErrorMessage, buttonStyles, LoadingSpinner } from '@/lib/utils/button-optimization';

interface PremiumButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  premiumFeature?: string; // プレミアム機能の説明
}

export function PremiumButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  premiumFeature = 'この機能'
}: PremiumButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { isLoading: isChecking, executeWithLoading } = useButtonLoading();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (disabled || isChecking) return;

    if (onClick) {
      onClick();
      return;
    }

    await executeWithLoading(async () => {
      try {
        // ログインしていない場合はログインページにリダイレクト
        if (!user) {
          router.push('/login');
          return;
        }

        // プレミアム状況をチェック（キャッシュ付き）
        const response = await cachedFetch('/api/stripe/subscription-status');
        const data = await response.json();
        
        if (response.ok) {
          if (!data.isPremium) {
            // 未課金の場合はプレミアムページにリダイレクト
            router.push('/premium');
            return;
          } else {
            // 課金済みの場合は愛犬プロフィール作成ページにリダイレクト
            router.push('/profile/create');
            return;
          }
        } else {
          // エラーの場合はプレミアムページにリダイレクト
          router.push('/premium');
          return;
        }
        
      } catch (error) {
        console.error('プレミアム状況の確認に失敗しました:', error);
        // エラーの場合はプレミアムページにリダイレクト
        router.push('/premium');
      }
    });
  };

  const variantClass = buttonStyles[variant] || buttonStyles.primary;
  const sizeClass = buttonStyles.sizes[size] || buttonStyles.sizes.md;

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isChecking}
      className={`${buttonStyles.base} ${variantClass} ${sizeClass} ${className}`}
      title={isChecking ? '確認中...' : `${premiumFeature}はプレミアム機能です`}
    >
      {isChecking ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          確認中...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {children}
          <span className="text-xs opacity-75">💎</span>
        </div>
      )}
    </button>
  );
}

