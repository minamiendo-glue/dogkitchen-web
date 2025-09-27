import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Feature } from '@/types/blog';

// 管理画面用の特集一覧取得（全てのステータス）
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // 管理者権限チェック
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // 全てのステータスの特集を取得
    const { data: features, error } = await supabaseAdmin
      .from('features')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image_url,
        status,
        published_at,
        created_at,
        updated_at,
        recipe_count:feature_recipes(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('特集取得エラー:', error);
      return NextResponse.json(
        { error: '特集の取得に失敗しました' },
        { status: 500 }
      );
    }

    // レシピ数の整形
    const formattedFeatures = features?.map((feature: any) => ({
      ...feature,
      recipe_count: Array.isArray(feature.recipe_count) ? feature.recipe_count.length : 0
    })) || [];

    return NextResponse.json({
      features: formattedFeatures,
      pagination: {
        page,
        limit,
        hasMore: formattedFeatures.length === limit
      }
    });

  } catch (error) {
    console.error('特集一覧取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
