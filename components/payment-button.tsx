'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/supabase-provider';
import { useRouter } from 'next/navigation';
import getStripe from '@/lib/stripe-client';

interface PaymentButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function PaymentButton({ 
  className = '', 
  children,
  variant = 'primary',
  size = 'md'
}: PaymentButtonProps) {
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (loading) {
      return;
    }

    if (!user || !session) {
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Cookieを含めてリクエストを送信
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Checkout session creation failed: ${data.error || 'Unknown error'}`);
      }

      const { sessionId } = data;

      if (!sessionId) {
        throw new Error('Session ID not received from server');
      }

      const stripe = await getStripe();

      if (!stripe) {
        throw new Error('Stripe instance not available. Please check your publishable key.');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Stripe checkout error:', error);
        alert(`決済処理でエラーが発生しました: ${error.message}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // ユーザーフレンドリーなエラーメッセージ
      let errorMessage = '決済処理でエラーが発生しました';
      
      if (error instanceof Error) {
        if (error.message.includes('認証が必要です')) {
          errorMessage = 'ログインが必要です';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'ネットワークエラーが発生しました。インターネット接続を確認してください';
        } else if (error.message.includes('Stripe')) {
          errorMessage = '決済システムのエラーが発生しました。しばらく時間をおいて再度お試しください';
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses = 'font-bold rounded-xl transition-all duration-200 transform hover:-translate-y-1 shadow-lg';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-xl',
    secondary: 'bg-white text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white'
  };

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        isLoading || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          決済画面へ移動中...
        </div>
      ) : (
        children || 'プレミアムにアップグレード'
      )}
    </button>
  );
}
