import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // お気に入り数でソートしたレシピを取得
    const { data: recipes, error } = await supabaseAdmin
      .from('recipes')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        status,
        created_at,
        favorite_recipes!inner(count)
      `)
      .eq('status', 'published')
      .order('favorite_recipes.count', { ascending: false })
      .limit(12);

    if (error) {
      console.error('Error fetching popular recipes:', error);
      return NextResponse.json({ error: 'Failed to fetch popular recipes' }, { status: 500 });
    }

    // お気に入り数が0のレシピも含めて取得（上記のクエリでは除外されるため）
    const { data: allRecipes, error: allError } = await supabaseAdmin
      .from('recipes')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        status,
        created_at
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(12);

    if (allError) {
      console.error('Error fetching all recipes:', allError);
      return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
    }

    // お気に入り数を取得してソート
    const recipesWithFavorites = await Promise.all(
      (allRecipes || []).map(async (recipe) => {
        const { count } = await supabaseAdmin
          .from('favorite_recipes')
          .select('*', { count: 'exact', head: true })
          .eq('recipe_id', recipe.id);

        return {
          ...recipe,
          favorite_count: count || 0
        };
      })
    );

    // お気に入り数でソート
    const sortedRecipes = recipesWithFavorites.sort((a, b) => b.favorite_count - a.favorite_count);

    return NextResponse.json({ recipes: sortedRecipes });
  } catch (error) {
    console.error('Error fetching popular recipes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
