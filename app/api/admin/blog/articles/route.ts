import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 管理画面用の記事一覧取得（全ステータス）
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
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 全記事を取得（管理者用）
    const { data: articles, error } = await supabaseAdmin
      .from('articles')
      .select(`
        id,
        title,
        slug,
        content,
        excerpt,
        featured_image_url,
        status,
        published_at,
        created_at,
        updated_at,
        recipe_count:article_recipes(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('記事取得エラー:', error);
      
      // テーブルが存在しない場合の特別な処理
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          articles: [],
          pagination: {
            page: 1,
            limit: 10,
            hasMore: false
          }
        });
      }
      
      return NextResponse.json(
        { error: 'サーバーエラーが発生しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      articles: articles || [],
      pagination: {
        page,
        limit,
        hasMore: (articles?.length || 0) === limit
      }
    });

  } catch (error) {
    console.error('管理画面用記事一覧取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 記事作成（管理者のみ）
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, slug, content, excerpt, featured_image_url, status, recipe_ids } = body;

    // バリデーション
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'タイトル、スラッグ、内容は必須です' },
        { status: 400 }
      );
    }

    // スラッグの重複チェック
    const { data: existingArticle } = await supabaseAdmin
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingArticle) {
      return NextResponse.json(
        { error: 'このスラッグは既に使用されています' },
        { status: 400 }
      );
    }

    // 記事を作成
    const articleData = {
      title,
      slug,
      content,
      excerpt,
      featured_image_url,
      status,
      published_at: status === 'published' ? new Date().toISOString() : null
    };

    const { data: newArticle, error: insertError } = await supabaseAdmin
      .from('articles')
      .insert(articleData)
      .select()
      .single();

    if (insertError) {
      console.error('記事作成エラー:', insertError);
      return NextResponse.json(
        { error: '記事の作成に失敗しました' },
        { status: 500 }
      );
    }

    // レシピとの紐づけ
    if (recipe_ids && recipe_ids.length > 0) {
      const articleRecipes = recipe_ids.map((recipe_id: string, index: number) => ({
        article_id: newArticle.id,
        recipe_id,
        display_order: index
      }));

      const { error: linkError } = await supabaseAdmin
        .from('article_recipes')
        .insert(articleRecipes);

      if (linkError) {
        console.error('レシピ紐づけエラー:', linkError);
        // 記事は作成されているので、エラーをログに記録するが処理は続行
      }
    }

    return NextResponse.json(
      { 
        message: '記事が正常に作成されました',
        article: newArticle
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('記事作成エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
