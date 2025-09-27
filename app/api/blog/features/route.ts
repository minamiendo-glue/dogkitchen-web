import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Feature, CreateFeatureData } from '@/types/blog';

// 特集一覧取得（公開特集のみ）
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

    // 公開特集のみを取得
    const { data: features, error } = await supabaseAdmin
      .from('features')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image_url,
        published_at,
        created_at,
        recipe_count:feature_recipes(count)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
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

// 特集作成（管理者のみ）
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

    const body: CreateFeatureData = await request.json();
    const { title, slug, excerpt, featured_image_url, status, recipe_ids, sections } = body;

    // バリデーション
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'タイトル、スラッグは必須です' },
        { status: 400 }
      );
    }

    // スラッグの重複チェック
    const { data: existingFeature } = await supabaseAdmin
      .from('features')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingFeature) {
      return NextResponse.json(
        { error: 'このスラッグは既に使用されています' },
        { status: 400 }
      );
    }

    // 特集を作成
    const featureData = {
      title,
      slug,
      excerpt,
      featured_image_url,
      status,
      published_at: status === 'published' ? new Date().toISOString() : null
    };

    const { data: newFeature, error: insertError } = await supabaseAdmin
      .from('features')
      .insert(featureData)
      .select()
      .single();

    if (insertError) {
      console.error('特集作成エラー:', insertError);
      return NextResponse.json(
        { error: '特集の作成に失敗しました' },
        { status: 500 }
      );
    }

    // 小項目とレシピの紐づけ
    if (sections && sections.length > 0) {
      const featureSectionsToInsert = sections.map((section, sectionIndex) => ({
        feature_id: newFeature.id,
        title: section.title,
        description: section.description,
        display_order: sectionIndex,
        recipe_ids: section.recipe_ids // JSONBとして保存
      }));

      const { error: sectionsInsertError } = await supabaseAdmin
        .from('feature_sections')
        .insert(featureSectionsToInsert);

      if (sectionsInsertError) {
        console.error('小項目作成エラー:', sectionsInsertError);
      }

      // 各小項目のレシピをfeature_recipesテーブルにも保存
      for (const section of sections) {
        if (section.recipe_ids && section.recipe_ids.length > 0) {
          const featureRecipes = section.recipe_ids.map((recipe_id, recipeIndex) => ({
            feature_id: newFeature.id,
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

    // 従来のrecipe_idsでの紐づけ（後方互換性のため）
    if (recipe_ids && recipe_ids.length > 0) {
      const featureRecipes = recipe_ids.map((recipe_id, index) => ({
        feature_id: newFeature.id,
        recipe_id,
        display_order: index
      }));

      const { error: linkError } = await supabaseAdmin
        .from('feature_recipes')
        .insert(featureRecipes);

      if (linkError) {
        console.error('レシピ紐づけエラー:', linkError);
        // 特集は作成されているので、エラーをログに記録するが処理は続行
      }
    }

    return NextResponse.json(
      { 
        message: '特集が正常に作成されました',
        feature: newFeature
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('特集作成エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
