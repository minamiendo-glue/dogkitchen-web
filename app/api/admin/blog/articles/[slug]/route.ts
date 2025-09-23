import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 管理画面用の個別記事取得（全てのステータス）
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

    // 記事を取得（全てのステータス）
    const { data: article, error } = await supabaseAdmin
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
        updated_at
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '記事が見つかりません' },
          { status: 404 }
        );
      }
      console.error('記事取得エラー:', error);
      return NextResponse.json(
        { error: 'サーバーエラーが発生しました' },
        { status: 500 }
      );
    }

    if (!article) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });

  } catch (error) {
    console.error('管理画面用記事取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 記事更新（管理者のみ）
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    const { title, slug: newSlug, content, excerpt, featured_image_url, status } = body;

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
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // 記事を削除
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
