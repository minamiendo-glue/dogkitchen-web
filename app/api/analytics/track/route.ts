import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface TrackingData {
  type: 'page_view' | 'recipe_view' | 'search' | 'user_action';
  page_path?: string;
  page_title?: string;
  recipe_id?: string;
  search_query?: string;
  search_filters?: Record<string, any>;
  results_count?: number;
  action_type?: string;
  target_id?: string;
  target_type?: string;
  metadata?: Record<string, any>;
  view_duration?: number;
  session_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    const body: TrackingData = await request.json();
    const { type, ...data } = body;

    // IPアドレスとUser-Agentを取得
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || null;

    // セッションIDを生成（既存の場合は使用）
    const sessionId = data.session_id || generateSessionId();

    // タイプ別の処理
    switch (type) {
      case 'page_view':
        await trackPageView({
          ...data,
          ip_address: ip,
          user_agent: userAgent,
          referrer,
          session_id: sessionId
        });
        break;

      case 'recipe_view':
        await trackRecipeView({
          ...data,
          ip_address: ip,
          user_agent: userAgent,
          referrer,
          session_id: sessionId
        });
        break;

      case 'search':
        await trackSearch({
          ...data,
          session_id: sessionId
        });
        break;

      case 'user_action':
        await trackUserAction({
          ...data,
          ip_address: ip,
          user_agent: userAgent,
          session_id: sessionId
        });
        break;

      default:
        return NextResponse.json(
          { error: '無効なトラッキングタイプ' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      session_id: sessionId
    });

  } catch (error) {
    console.error('トラッキングエラー:', error);
    return NextResponse.json(
      { error: 'トラッキングに失敗しました' },
      { status: 500 }
    );
  }
}

// ページビューを記録
async function trackPageView(data: any) {
  const { data: result, error } = await supabaseAdmin
    .from('page_views')
    .insert({
      page_path: data.page_path,
      page_title: data.page_title,
      session_id: data.session_id,
      ip_address: data.ip_address,
      user_agent: data.user_agent,
      referrer: data.referrer
    });

  if (error) {
    console.error('ページビュートラッキングエラー:', error);
  }
}

// レシピ閲覧を記録
async function trackRecipeView(data: any) {
  const { data: result, error } = await supabaseAdmin
    .from('recipe_views')
    .insert({
      recipe_id: data.recipe_id,
      session_id: data.session_id,
      ip_address: data.ip_address,
      user_agent: data.user_agent,
      referrer: data.referrer,
      view_duration: data.view_duration
    });

  if (error) {
    console.error('レシピビュートラッキングエラー:', error);
  }
}

// 検索を記録
async function trackSearch(data: any) {
  const { data: result, error } = await supabaseAdmin
    .from('search_logs')
    .insert({
      session_id: data.session_id,
      search_query: data.search_query,
      search_filters: data.search_filters,
      results_count: data.results_count,
      page_path: data.page_path
    });

  if (error) {
    console.error('検索トラッキングエラー:', error);
  }
}

// ユーザーアクションを記録
async function trackUserAction(data: any) {
  const { data: result, error } = await supabaseAdmin
    .from('user_actions')
    .insert({
      session_id: data.session_id,
      action_type: data.action_type,
      target_id: data.target_id,
      target_type: data.target_type,
      metadata: data.metadata,
      ip_address: data.ip_address,
      user_agent: data.user_agent
    });

  if (error) {
    console.error('ユーザーアクショントラッキングエラー:', error);
  }
}

// セッションIDを生成
function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}
