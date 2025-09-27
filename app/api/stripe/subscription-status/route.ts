import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe';

// サブスクリプション状況のキャッシュ（メモリ内）
const subscriptionCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2分（Stripe APIの制限を考慮）

export async function GET(request: NextRequest) {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const cookieStore = await cookies();
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
    
    console.log('Subscription Status API - Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasEmail: !!session?.user?.email,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      cookies: cookieStore.getAll().map(c => ({ name: c.name, hasValue: !!c.value, value: c.value?.substring(0, 20) + '...' }))
    });
    
    // より詳細な認証情報をログ出力
    console.log('All cookies:', cookieStore.getAll());
    console.log('Supabase session object:', session);
    
    if (!session?.user?.email) {
      console.log('Subscription Status API - Authentication failed: No session or email');
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // キャッシュをチェック
    const cacheKey = session.user.email;
    const now = Date.now();
    
    if (subscriptionCache.has(cacheKey)) {
      const cached = subscriptionCache.get(cacheKey)!;
      if (now - cached.timestamp < CACHE_DURATION) {
        return NextResponse.json(cached.data);
      } else {
        subscriptionCache.delete(cacheKey);
      }
    }

    // Stripeの顧客を取得
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      const response = {
        isPremium: false,
        subscription: null,
      };
      subscriptionCache.set(cacheKey, { data: response, timestamp: now });
      return NextResponse.json(response);
    }

    const customer = customers.data[0];

    // アクティブなサブスクリプションを取得
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      const response = {
        isPremium: false,
        subscription: null,
      };
      subscriptionCache.set(cacheKey, { data: response, timestamp: now });
      return NextResponse.json(response);
    }

    const subscription = subscriptions.data[0];
    const response = {
      isPremium: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: (subscription as any).current_period_start,
        currentPeriodEnd: (subscription as any).current_period_end,
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      },
    };
    
    subscriptionCache.set(cacheKey, { data: response, timestamp: now });
    return NextResponse.json(response);
  } catch (error) {
    console.error('Subscription status check failed:', error);
    return NextResponse.json(
      { error: 'サブスクリプション状態の確認に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const cookieStore = await cookies();
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
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // Stripeの顧客を取得
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: 'サブスクリプションが見つかりません' },
        { status: 404 }
      );
    }

    const customer = customers.data[0];

    // アクティブなサブスクリプションを取得
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: 'アクティブなサブスクリプションが見つかりません' },
        { status: 404 }
      );
    }

    const subscription = subscriptions.data[0];

    // サブスクリプションをキャンセル（期間終了時にキャンセル）
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    // キャッシュをクリア
    subscriptionCache.delete(session.user.email);

    return NextResponse.json({
      message: 'サブスクリプションがキャンセルされました',
      cancelAtPeriodEnd: true,
    });
  } catch (error) {
    console.error('Subscription cancellation failed:', error);
    return NextResponse.json(
      { error: 'サブスクリプションのキャンセルに失敗しました' },
      { status: 500 }
    );
  }
}

