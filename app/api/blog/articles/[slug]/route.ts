import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Article } from '@/types/blog';

// 個別記事取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    const { slug } = await params;

    // 記事を取得（公開記事のみ）
    const { data: article, error } = await supabaseAdmin
      .from('articles')
      .select(`
        id,
        title,
        slug,
        content,
        excerpt,
        featured_image_url,
        published_at,
        created_at,
        updated_at,
        recipes:article_recipes(
          display_order,
          recipe:recipes(
            id,
            title,
            description,
            thumbnail_url
          )
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '記事が見つかりません' },
          { status: 404 }
        );
      }
      
      // テーブルが存在しない場合の特別な処理
      if (error.message?.includes('relation "articles" does not exist')) {
        return NextResponse.json(
          { error: '記事テーブルがまだ作成されていません。管理画面でデータベースセットアップを実行してください。' },
          { status: 404 }
        );
      }
      
      console.error('記事取得エラー:', error);
      return NextResponse.json(
        { error: '記事の取得に失敗しました', details: error.message },
        { status: 500 }
      );
    }

    // レシピを表示順でソート
    const sortedRecipes = article.recipes
      ?.sort((a: any, b: any) => a.display_order - b.display_order)
      .map((item: any) => item.recipe) || [];

    const formattedArticle = {
      ...article,
      recipes: sortedRecipes
    };

    return NextResponse.json({ article: formattedArticle });

  } catch (error) {
    console.error('記事取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 記事更新（管理者のみ）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const { slug } = await params;
    const body = await request.json();
    const { title, slug: newSlug, content, excerpt, featured_image_url, status, recipe_ids } = body;

    // バリデーション
    if (!title || !content) {
      return NextResponse.json(
        { error: 'タイトルと内容は必須です' },
        { status: 400 }
      );
    }

    // スラッグの重複チェック（スラッグが変更される場合のみ）
    if (newSlug && newSlug !== slug) {
      const { data: existingArticle } = await supabaseAdmin
        .from('articles')
        .select('id')
        .eq('slug', newSlug)
        .single();

      if (existingArticle) {
        return NextResponse.json(
          { error: 'このスラッグは既に使用されています' },
          { status: 400 }
        );
      }
    }

    // 記事を更新
    const updateData: any = {
      title,
      content,
      excerpt,
      featured_image_url,
      status
    };

    // スラッグが変更される場合は更新データに含める
    if (newSlug && newSlug !== slug) {
      updateData.slug = newSlug;
    }

    // 公開状態に変更する場合、公開日時を設定
    if (status === 'published') {
      const { data: currentArticle } = await supabaseAdmin
        .from('articles')
        .select('published_at')
        .eq('slug', slug)
        .single();

      if (!currentArticle?.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data: updatedArticle, error: updateError } = await supabaseAdmin
      .from('articles')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single();

    if (updateError) {
      console.error('記事更新エラー:', updateError);
      return NextResponse.json(
        { error: '記事の更新に失敗しました' },
        { status: 500 }
      );
    }

    // レシピとの紐づけを更新
    if (recipe_ids !== undefined) {
      // 既存の紐づけを削除
      await supabaseAdmin
        .from('article_recipes')
        .delete()
        .eq('article_id', updatedArticle.id);

      // 新しい紐づけを作成
      if (recipe_ids.length > 0) {
        const articleRecipes = recipe_ids.map((recipe_id: string, index: number) => ({
          article_id: updatedArticle.id,
          recipe_id,
          display_order: index
        }));

        const { error: linkError } = await supabaseAdmin
          .from('article_recipes')
          .insert(articleRecipes);

        if (linkError) {
          console.error('レシピ紐づけエラー:', linkError);
        }
      }
    }

    return NextResponse.json({
      message: '記事が正常に更新されました',
      article: updatedArticle
    });

  } catch (error) {
    console.error('記事更新エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 記事削除（管理者のみ）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const { slug } = await params;

    // 記事を削除（CASCADEで関連データも削除される）
    const { error: deleteError } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('slug', slug);

    if (deleteError) {
      console.error('記事削除エラー:', deleteError);
      return NextResponse.json(
        { error: '記事の削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '記事が正常に削除されました'
    });

  } catch (error) {
    console.error('記事削除エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
