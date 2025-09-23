import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// お気に入りレシピ一覧取得
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      // ユーザーIDがない場合は空の配列を返す
      return NextResponse.json({
        favorites: []
      });
    }

    // Supabaseからユーザーのお気に入りレシピを取得
    const { data: favorites, error: fetchError } = await supabaseAdmin
      .from('favorite_recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return NextResponse.json(
        { error: 'お気に入りの取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      favorites: favorites || []
    });
  } catch (error) {
    console.error('お気に入り取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// お気に入りレシピ追加
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { recipeId, userId } = body;

    if (!recipeId || !userId) {
      return NextResponse.json(
        { error: 'レシピIDとユーザーIDが必要です' },
        { status: 400 }
      );
    }

    // Supabaseにお気に入りを追加
    const { data: favorite, error: insertError } = await supabaseAdmin
      .from('favorite_recipes')
      .insert({
        user_id: userId,
        recipe_id: recipeId
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { error: 'お気に入りの追加に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'お気に入りに追加しました',
      favorite
    });
  } catch (error) {
    console.error('お気に入り追加エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// お気に入りレシピ削除
export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');
    const userId = searchParams.get('userId');

    if (!recipeId || !userId) {
      return NextResponse.json(
        { error: 'レシピIDとユーザーIDが必要です' },
        { status: 400 }
      );
    }

    // Supabaseからお気に入りを削除
    const { error: deleteError } = await supabaseAdmin
      .from('favorite_recipes')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      return NextResponse.json(
        { error: 'お気に入りの削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'お気に入りから削除しました'
    });
  } catch (error) {
    console.error('お気に入り削除エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}