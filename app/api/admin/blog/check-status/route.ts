import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 記事と特集の公開状況をチェック
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

    // 記事の公開状況を確認
    const { data: articles, error: articlesError } = await supabaseAdmin
      .from('articles')
      .select('id, title, slug, status, published_at, created_at')
      .order('created_at', { ascending: false });

    if (articlesError) {
      console.error('記事取得エラー:', articlesError);
      return NextResponse.json(
        { error: '記事の取得に失敗しました', details: articlesError.message },
        { status: 500 }
      );
    }

    // 特集の公開状況を確認
    const { data: features, error: featuresError } = await supabaseAdmin
      .from('features')
      .select('id, title, slug, status, published_at, created_at')
      .order('created_at', { ascending: false });

    if (featuresError) {
      console.error('特集取得エラー:', featuresError);
      return NextResponse.json(
        { error: '特集の取得に失敗しました', details: featuresError.message },
        { status: 500 }
      );
    }

    // 統計情報を計算
    const articleStats = {
      total: articles?.length || 0,
      published: articles?.filter((a: any) => a.status === 'published').length || 0,
      draft: articles?.filter((a: any) => a.status === 'draft').length || 0,
      archived: articles?.filter((a: any) => a.status === 'archived').length || 0
    };

    const featureStats = {
      total: features?.length || 0,
      published: features?.filter((f: any) => f.status === 'published').length || 0,
      draft: features?.filter((f: any) => f.status === 'draft').length || 0,
      archived: features?.filter((f: any) => f.status === 'archived').length || 0
    };

    // 問題のある記事を特定
    const problematicArticles = articles?.filter((a: any) => 
      a.status !== 'published' && a.status !== 'draft' && a.status !== 'archived'
    ) || [];

    const problematicFeatures = features?.filter((f: any) => 
      f.status !== 'published' && f.status !== 'draft' && f.status !== 'archived'
    ) || [];

    return NextResponse.json({
      success: true,
      articles: {
        stats: articleStats,
        list: articles || [],
        problematic: problematicArticles
      },
      features: {
        stats: featureStats,
        list: features || [],
        problematic: problematicFeatures
      },
      summary: {
        totalArticles: articleStats.total,
        totalFeatures: featureStats.total,
        publishedArticles: articleStats.published,
        publishedFeatures: featureStats.published,
        draftArticles: articleStats.draft,
        draftFeatures: featureStats.draft,
        archivedArticles: articleStats.archived,
        archivedFeatures: featureStats.archived,
        hasProblematicData: problematicArticles.length > 0 || problematicFeatures.length > 0
      }
    });

  } catch (error) {
    console.error('公開状況チェックエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
