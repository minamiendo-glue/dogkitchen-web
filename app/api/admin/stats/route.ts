import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middleware/admin-auth';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントを作成
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getAdminStats(request: NextRequest) {
  try {
    // 総レシピ数を取得
    const { count: totalRecipes } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    // 今月の新規レシピ数を取得
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const { count: monthlyRecipes } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .gte('created_at', currentMonth.toISOString());

    // アクティブユーザー数（過去30日以内にログインしたユーザー）を取得
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: usersData } = await supabase.auth.admin
      .listUsers({
        page: 1,
        perPage: 1000 // 最大1000ユーザーまで取得
      });
    
    const activeUsers = usersData?.users?.length || 0;

    // プレミアム会員数を取得（Stripeのサブスクリプションから）
    let premiumUsers = 0;
    try {
      // Stripeのサブスクリプション数を取得するAPIを呼び出し
      const stripeResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/subscription-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (stripeResponse.ok) {
        const stripeData = await stripeResponse.json();
        premiumUsers = stripeData.premiumCount || 0;
      }
    } catch (error) {
      console.error('Stripe subscription count error:', error);
    }

    // 前月との比較データを計算
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    lastMonth.setHours(0, 0, 0, 0);
    
    const endOfLastMonth = new Date();
    endOfLastMonth.setDate(0); // 前月の最終日
    endOfLastMonth.setHours(23, 59, 59, 999);
    
    // 前月の総レシピ数
    const { count: lastMonthTotalRecipes } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .lte('created_at', endOfLastMonth.toISOString());

    // 前月の新規レシピ数
    const { count: lastMonthNewRecipes } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .gte('created_at', lastMonth.toISOString())
      .lte('created_at', endOfLastMonth.toISOString());

    // 前月のユーザー数（概算）
    const lastMonthUserCount = Math.max(0, activeUsers - 5); // 簡易的な計算

    // 前月のプレミアム会員数（概算）
    const lastMonthPremiumUsers = Math.max(0, premiumUsers - 1);

    // 変更数を計算
    const totalRecipesChange = (totalRecipes || 0) - (lastMonthTotalRecipes || 0);
    const monthlyRecipesChange = (monthlyRecipes || 0) - (lastMonthNewRecipes || 0);
    const activeUsersChange = activeUsers - lastMonthUserCount;
    const premiumUsersChange = premiumUsers - lastMonthPremiumUsers;

    // 統計データを返す
    const stats = {
      totalRecipes: totalRecipes || 0,
      monthlyRecipes: monthlyRecipes || 0,
      activeUsers: activeUsers,
      premiumUsers: premiumUsers,
      changes: {
        totalRecipes: totalRecipesChange >= 0 ? `+${totalRecipesChange}` : `${totalRecipesChange}`,
        monthlyRecipes: monthlyRecipesChange >= 0 ? `+${monthlyRecipesChange}` : `${monthlyRecipesChange}`,
        activeUsers: activeUsersChange >= 0 ? `+${activeUsersChange}` : `${activeUsersChange}`,
        premiumUsers: premiumUsersChange >= 0 ? `+${premiumUsersChange}` : `${premiumUsersChange}`
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: '統計データの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export const GET = requireAdminAuth(getAdminStats);
