import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // ユーザー数を取得
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    const userCount = users?.users?.length || 0;

    // レシピ数を取得
    const { count: recipeCount, error: recipeError } = await supabaseAdmin
      .from('recipes')
      .select('*', { count: 'exact', head: true });

    // 今日の日付を取得
    const today = new Date().toISOString().split('T')[0];

    // 今日作成されたレシピ数
    const { count: todayRecipes, error: todayRecipesError } = await supabaseAdmin
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lte('created_at', `${today}T23:59:59.999Z`);

    // 今日登録されたユーザー数
    const todayUsers = users?.users?.filter(user => 
      user.created_at.startsWith(today)
    ).length || 0;

    // 公開中のレシピ数
    const { count: publishedRecipes, error: publishedError } = await supabaseAdmin
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    // 下書きのレシピ数
    const { count: draftRecipes, error: draftError } = await supabaseAdmin
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft');

    // エラーが発生した場合の処理
    if (usersError || recipeError) {
      console.error('Stats fetch error:', { usersError, recipeError });
    }

    const stats = {
      totalUsers: userCount,
      totalRecipes: recipeCount || 0,
      publishedRecipes: publishedRecipes || 0,
      draftRecipes: draftRecipes || 0,
      todayRecipes: todayRecipes || 0,
      todayUsers: todayUsers,
      systemHealth: {
        database: !usersError && !recipeError ? 'healthy' : 'error',
        lastChecked: new Date().toISOString()
      }
    };

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: '統計データの取得に失敗しました' },
      { status: 500 }
    );
  }
}














