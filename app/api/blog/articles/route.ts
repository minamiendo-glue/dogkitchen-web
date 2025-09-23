import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Article, CreateArticleData } from '@/types/blog';

// 記事一覧取得（公開記事のみ、管理者は全記事）
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 管理者権限チェック
    const authHeader = request.headers.get('authorization');
    const isAdmin = !!authHeader;

    let query = supabaseAdmin
      .from('articles')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image_url,
        status,
        published_at,
        created_at,
        recipe_count:article_recipes(count)
      `);

    // 管理者の場合は全記事、一般ユーザーの場合は公開記事のみ
    if (!isAdmin) {
      query = query.eq('status', 'published');
    }

    const { data: articles, error } = await query
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('記事取得エラー:', error);
      
      // テーブルが存在しない場合の特別な処理
      if (error.code === 'PGRST116' || error.message?.includes('relation "articles" does not exist')) {
        return NextResponse.json({
          articles: [],
          message: '記事テーブルがまだ作成されていません。管理画面でデータベースセットアップを実行してください。',
          needsSetup: true
        });
      }
      
      return NextResponse.json(
        { error: '記事の取得に失敗しました', details: error.message },
        { status: 500 }
      );
    }

    // レシピ数の整形
    const formattedArticles = articles?.map(article => ({
      ...article,
      recipe_count: Array.isArray(article.recipe_count) ? article.recipe_count.length : 0
    })) || [];

    return NextResponse.json({
      articles: formattedArticles,
      pagination: {
        page,
        limit,
        hasMore: formattedArticles.length === limit
      }
    });

  } catch (error) {
    console.error('記事一覧取得エラー:', error);
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

    const body: CreateArticleData = await request.json();
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
      const articleRecipes = recipe_ids.map((recipe_id, index) => ({
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
