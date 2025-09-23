import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface RouteParams {
  params: {
    slug: string;
  };
}

// 管理画面用の特集取得（全てのステータス）
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    // 特集を取得（全てのステータス）
    const { data: feature, error } = await supabaseAdmin
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
        updated_at
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '特集が見つかりません' },
          { status: 404 }
        );
      }
      console.error('特集取得エラー:', error);
      return NextResponse.json(
        { error: '特集の取得に失敗しました' },
        { status: 500 }
      );
    }

    // レシピの関連データを別途取得
    let recipes = [];
    try {
      const { data: featureRecipes, error: recipesError } = await supabaseAdmin
        .from('feature_recipes')
        .select(`
          display_order,
          recipe:recipes(
            id,
            title,
            description,
            thumbnail_url
          )
        `)
        .eq('feature_id', feature.id)
        .order('display_order', { ascending: true });

      if (!recipesError && featureRecipes) {
        recipes = featureRecipes
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((item: any) => item.recipe);
      }
    } catch (recipesErr) {
      console.warn('レシピの取得に失敗:', recipesErr);
    }

    // 特集小項目を別途取得
    let sections = [];
    try {
      const { data: sectionsData, error: sectionsError } = await supabaseAdmin
        .from('feature_sections')
        .select(`
          id,
          title,
          description,
          display_order,
          recipe_ids
        `)
        .eq('feature_id', feature.id)
        .order('display_order', { ascending: true });

      if (!sectionsError && sectionsData) {
        sections = sectionsData;
      }
    } catch (sectionsErr) {
      console.warn('特集小項目の取得に失敗:', sectionsErr);
    }

    const formattedFeature = {
      ...feature,
      recipes: recipes,
      sections: sections
    };

    return NextResponse.json({ feature: formattedFeature });

  } catch (error) {
    console.error('特集取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 管理画面用の特集編集
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
    const { 
      title, 
      slug: newSlug, 
      excerpt, 
      featured_image_url, 
      status, 
      sections = [] 
    } = body;

    // バリデーション
    if (!title) {
      return NextResponse.json(
        { error: 'タイトルは必須です' },
        { status: 400 }
      );
    }

    // スラッグの重複チェック（スラッグが変更される場合のみ）
    if (newSlug && newSlug !== slug) {
      const { data: existingFeature } = await supabaseAdmin
        .from('features')
        .select('id')
        .eq('slug', newSlug)
        .single();

      if (existingFeature) {
        return NextResponse.json(
          { error: 'このスラッグは既に使用されています' },
          { status: 400 }
        );
      }
    }

    // 特集を更新
    const updateData: any = {
      title,
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
      const { data: currentFeature } = await supabaseAdmin
        .from('features')
        .select('published_at')
        .eq('slug', slug)
        .single();

      if (!currentFeature?.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data: updatedFeature, error: updateError } = await supabaseAdmin
      .from('features')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single();

    if (updateError) {
      console.error('特集更新エラー:', updateError);
      return NextResponse.json(
        { error: '特集の更新に失敗しました' },
        { status: 500 }
      );
    }

    // 小項目データを更新
    if (sections && sections.length > 0) {
      try {
        // 既存の小項目を削除
        await supabaseAdmin
          .from('feature_sections')
          .delete()
          .eq('feature_id', updatedFeature.id);

        // 新しい小項目を作成
        const featureSectionsToInsert = sections.map((section: any, sectionIndex: number) => ({
          feature_id: updatedFeature.id,
          title: section.title,
          description: section.description,
          display_order: sectionIndex,
          recipe_ids: section.recipe_ids || []
        }));

        const { error: sectionsInsertError } = await supabaseAdmin
          .from('feature_sections')
          .insert(featureSectionsToInsert);

        if (sectionsInsertError) {
          console.error('小項目更新エラー:', sectionsInsertError);
          console.error('挿入しようとしたデータ:', featureSectionsToInsert);
          return NextResponse.json(
            { 
              error: '小項目の更新に失敗しました',
              details: sectionsInsertError.message,
              code: sectionsInsertError.code
            },
            { status: 500 }
          );
        }
      } catch (sectionsErr) {
        console.error('小項目テーブルアクセスエラー:', sectionsErr);
        return NextResponse.json(
          { 
            error: '小項目テーブルにアクセスできません',
            details: sectionsErr instanceof Error ? sectionsErr.message : 'Unknown error',
            needsSetup: true
          },
          { status: 500 }
        );
      }

      // 各小項目のレシピをfeature_recipesテーブルにも保存
      for (const section of sections) {
        if (section.recipe_ids && section.recipe_ids.length > 0) {
          // 既存のレシピ紐づけを削除
          await supabaseAdmin
            .from('feature_recipes')
            .delete()
            .eq('feature_id', updatedFeature.id);

          const featureRecipes = section.recipe_ids.map((recipe_id: string, recipeIndex: number) => ({
            feature_id: updatedFeature.id,
            recipe_id,
            display_order: recipeIndex
          }));

          const { error: linkError } = await supabaseAdmin
            .from('feature_recipes')
            .insert(featureRecipes);

          if (linkError) {
            console.error('レシピ紐づけエラー:', linkError);
          }
        }
      }
    }

    return NextResponse.json({
      message: '特集が正常に更新されました',
      feature: updatedFeature
    });

  } catch (error) {
    console.error('特集更新エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 管理画面用の特集削除
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

    // 特集を削除（CASCADEで関連データも削除される）
    const { error: deleteError } = await supabaseAdmin
      .from('features')
      .delete()
      .eq('slug', slug);

    if (deleteError) {
      console.error('特集削除エラー:', deleteError);
      return NextResponse.json(
        { error: '特集の削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '特集が正常に削除されました'
    });

  } catch (error) {
    console.error('特集削除エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}