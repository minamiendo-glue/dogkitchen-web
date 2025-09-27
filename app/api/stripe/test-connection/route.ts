import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    // Stripe APIへの接続テスト
    const balance = await stripe.balance.retrieve();
    
    return NextResponse.json({
      success: true,
      message: 'Stripe接続成功',
      balance: {
        available: balance.available,
        pending: balance.pending,
      },
      currency: balance.available[0]?.currency || 'jpy',
    });
  } catch (error) {
    console.error('Stripe connection test failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Stripe接続失敗',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}






















