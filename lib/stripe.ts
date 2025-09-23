import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export const formatAmountForDisplay = (
  amount: number,
  currency: string
): string => {
  let numberFormat = new Intl.NumberFormat(['ja-JP'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(amount);
};

export const formatAmountForStripe = (
  amount: number,
  currency: string
): number => {
  let numberFormat = new Intl.NumberFormat(['ja-JP'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency: boolean = true;
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};

// プレミアムプランの価格設定
export const PREMIUM_PLAN = {
  // 環境に応じて価格IDを切り替え
  priceId: process.env.NODE_ENV === 'production' 
    ? 'price_live_premium_monthly'  // 本番環境用の価格ID
    : 'price_1S6ox0LcNGls8mGHJ7RNhbnt', // テスト環境用の価格ID（price_...で始まる）
  amount: 500, // 500円
  currency: 'jpy',
  interval: 'month' as const,
  name: 'プレミアムプラン',
  description: '愛犬の健康管理をサポートする全機能をご利用いただけます'
};
