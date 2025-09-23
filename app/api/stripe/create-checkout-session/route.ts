import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { PREMIUM_PLAN } from '@/lib/stripe';

// 顧客情報のキャッシュ（メモリ内）
const customerCache = new Map<string, string>();

export async function POST(request: NextRequest) {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // サーバーサイドではCookieを設定しない
          },
          remove(name: string, options: any) {
            // サーバーサイドではCookieを削除しない
          },
        },
        global: {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      }
    );
    
    // トークンがある場合は直接ユーザー情報を取得
    let session = null;
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        session = { user };
      }
    } else {
      // フォールバック: Cookieからセッションを取得
      const { data: { session: cookieSession } } = await supabase.auth.getSession();
      session = cookieSession;
    }
    
    console.log('Stripe API - Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasEmail: !!session?.user?.email,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    if (!session?.user?.email) {
      console.log('Stripe API - Authentication failed: No session or email');
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // Stripeの顧客を取得または作成（キャッシュを使用）
    let customer;
    const cachedCustomerId = customerCache.get(session.user.email);
    
    if (cachedCustomerId) {
      try {
        customer = await stripe.customers.retrieve(cachedCustomerId);
      } catch (error) {
        // キャッシュが無効な場合は削除して再取得
        customerCache.delete(session.user.email);
      }
    }
    
    if (!customer) {
      const existingCustomers = await stripe.customers.list({
        email: session.user.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
        customerCache.set(session.user.email, customer.id);
      } else {
        customer = await stripe.customers.create({
          email: session.user.email,
          name: session.user.name || undefined,
          metadata: {
            userId: session.user.id || '',
          },
        });
        customerCache.set(session.user.email, customer.id);
      }
    }

    // Checkout Sessionを作成
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PREMIUM_PLAN.priceId, // 価格IDを直接指定
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.nextUrl.origin}/mypage?tab=profile&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/premium?cancelled=true`,
      metadata: {
        userId: session.user.id || '',
        userEmail: session.user.email,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    
    // より詳細なエラーメッセージを返す
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `決済セッションの作成に失敗しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}
