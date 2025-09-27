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

    // 管理者権限チェック
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7'; // デフォルト7日間
    const metric = searchParams.get('metric') || 'overview'; // overview, recipes, searches, filters

    // 期間の計算
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    switch (metric) {
      case 'overview':
        return await getOverviewStats(startDate);
      case 'recipes':
        return await getRecipeStats(startDate);
      case 'searches':
        return await getSearchStats(startDate);
      case 'filters':
        return await getFilterStats(startDate);
      case 'daily':
        return await getDailyStats(startDate);
      default:
        return await getOverviewStats(startDate);
    }

  } catch (error) {
    console.error('分析データ取得エラー:', error);
    return NextResponse.json(
      { error: '分析データの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 概要統計を取得
async function getOverviewStats(startDate: Date) {
  try {
    // 総ページビュー数
    const { data: totalViews, error: viewsError } = await supabaseAdmin
      .from('page_views')
      .select('id', { count: 'exact' })
      .gte('created_at', startDate.toISOString());

    // ユニークセッション数
    const { data: uniqueSessions, error: sessionsError } = await supabaseAdmin
      .from('page_views')
      .select('session_id')
      .gte('created_at', startDate.toISOString());

    const sessionCount = new Set(uniqueSessions?.map((s: any) => s.session_id)).size;

    // レシピ閲覧数
    const { data: recipeViews, error: recipeViewsError } = await supabaseAdmin
      .from('recipe_views')
      .select('id', { count: 'exact' })
      .gte('created_at', startDate.toISOString());

    // 検索数
    const { data: searches, error: searchesError } = await supabaseAdmin
      .from('search_logs')
      .select('id', { count: 'exact' })
      .gte('created_at', startDate.toISOString());

    // 人気ページ（上位10）
    const { data: popularPages, error: pagesError } = await supabaseAdmin
      .rpc('get_popular_pages', { start_date: startDate.toISOString() });

    if (viewsError || sessionsError || recipeViewsError || searchesError || pagesError) {
      console.error('概要統計取得エラー:', { viewsError, sessionsError, recipeViewsError, searchesError, pagesError });
    }

    return NextResponse.json({
      success: true,
      data: {
        total_page_views: totalViews?.length || 0,
        unique_sessions: sessionCount,
        total_recipe_views: recipeViews?.length || 0,
        total_searches: searches?.length || 0,
        popular_pages: popularPages || [],
        period_days: Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      }
    });

  } catch (error) {
    console.error('概要統計取得エラー:', error);
    throw error;
  }
}

// レシピ統計を取得
async function getRecipeStats(startDate: Date) {
  try {
    // 人気レシピ（閲覧数順）
    const { data: popularRecipes, error: recipesError } = await supabaseAdmin
      .from('recipe_views')
      .select(`
        recipe_id,
        recipes!inner(title),
        created_at
      `)
      .gte('created_at', startDate.toISOString());

    // レシピ別統計を計算
    const recipeStats: Record<string, any> = {};
    popularRecipes?.forEach((view: any) => {
      const recipeId = view.recipe_id;
      if (!recipeStats[recipeId]) {
        recipeStats[recipeId] = {
          recipe_id: recipeId,
          title: view.recipes?.title || '不明なレシピ',
          view_count: 0,
          unique_sessions: new Set(),
          last_viewed: view.created_at
        };
      }
      recipeStats[recipeId].view_count++;
      recipeStats[recipeId].unique_sessions.add(view.session_id);
      if (new Date(view.created_at) > new Date(recipeStats[recipeId].last_viewed)) {
        recipeStats[recipeId].last_viewed = view.created_at;
      }
    });

    // 配列に変換してソート
    const sortedRecipes = Object.values(recipeStats)
      .map(stat => ({
        ...stat,
        unique_sessions: stat.unique_sessions.size
      }))
      .sort((a: any, b: any) => b.view_count - a.view_count)
      .slice(0, 20);

    if (recipesError) {
      console.error('レシピ統計取得エラー:', recipesError);
    }

    return NextResponse.json({
      success: true,
      data: {
        popular_recipes: sortedRecipes,
        total_recipe_views: popularRecipes?.length || 0
      }
    });

  } catch (error) {
    console.error('レシピ統計取得エラー:', error);
    throw error;
  }
}

// 検索統計を取得
async function getSearchStats(startDate: Date) {
  try {
    const { data: searches, error: searchesError } = await supabaseAdmin
      .from('search_logs')
      .select('search_query, results_count, created_at, session_id')
      .gte('created_at', startDate.toISOString())
      .not('search_query', 'is', null)
      .neq('search_query', '');

    if (searchesError) {
      console.error('検索統計取得エラー:', searchesError);
    }

    // 検索クエリ別統計を計算
    const queryStats: Record<string, any> = {};
    searches?.forEach((search: any) => {
      const query = search.search_query;
      if (!queryStats[query]) {
        queryStats[query] = {
          query,
          search_count: 0,
          unique_sessions: new Set(),
          avg_results_count: 0,
          results_sum: 0,
          last_searched: search.created_at
        };
      }
      queryStats[query].search_count++;
      queryStats[query].unique_sessions.add(search.session_id);
      queryStats[query].results_sum += search.results_count || 0;
      if (new Date(search.created_at) > new Date(queryStats[query].last_searched)) {
        queryStats[query].last_searched = search.created_at;
      }
    });

    // 配列に変換してソート
    const sortedQueries = Object.values(queryStats)
      .map(stat => ({
        ...stat,
        unique_sessions: stat.unique_sessions.size,
        avg_results_count: Math.round(stat.results_sum / stat.search_count)
      }))
      .sort((a: any, b: any) => b.search_count - a.search_count)
      .slice(0, 20);

    return NextResponse.json({
      success: true,
      data: {
        popular_searches: sortedQueries,
        total_searches: searches?.length || 0
      }
    });

  } catch (error) {
    console.error('検索統計取得エラー:', error);
    throw error;
  }
}

// フィルター統計を取得
async function getFilterStats(startDate: Date) {
  try {
    const { data: searches, error: searchesError } = await supabaseAdmin
      .from('search_logs')
      .select('search_filters, created_at, session_id')
      .gte('created_at', startDate.toISOString())
      .not('search_filters', 'is', null);

    if (searchesError) {
      console.error('フィルター統計取得エラー:', searchesError);
    }

    // フィルター使用統計を計算
    const filterStats: Record<string, any> = {};
    searches?.forEach((search: any) => {
      const filters = search.search_filters;
      if (filters && typeof filters === 'object') {
        Object.entries(filters).forEach(([key, value]: [string, any]) => {
          const filterKey = `${key}:${value}`;
          if (!filterStats[filterKey]) {
            filterStats[filterKey] = {
              filter_type: key,
              filter_value: value,
              usage_count: 0,
              unique_sessions: new Set(),
              last_used: search.created_at
            };
          }
          filterStats[filterKey].usage_count++;
          filterStats[filterKey].unique_sessions.add(search.session_id);
          if (new Date(search.created_at) > new Date(filterStats[filterKey].last_used)) {
            filterStats[filterKey].last_used = search.created_at;
          }
        });
      }
    });

    // 配列に変換してソート
    const sortedFilters = Object.values(filterStats)
      .map(stat => ({
        ...stat,
        unique_sessions: stat.unique_sessions.size
      }))
      .sort((a: any, b: any) => b.usage_count - a.usage_count)
      .slice(0, 30);

    return NextResponse.json({
      success: true,
      data: {
        popular_filters: sortedFilters,
        total_filter_usage: searches?.length || 0
      }
    });

  } catch (error) {
    console.error('フィルター統計取得エラー:', error);
    throw error;
  }
}

// 日別統計を取得
async function getDailyStats(startDate: Date) {
  try {
    const { data: dailyStats, error: dailyError } = await supabaseAdmin
      .from('analytics_daily_stats')
      .select('*')
      .gte('date_part', startDate.toISOString().split('T')[0])
      .order('date_part', { ascending: false });

    if (dailyError) {
      console.error('日別統計取得エラー:', dailyError);
    }

    return NextResponse.json({
      success: true,
      data: {
        daily_stats: dailyStats || []
      }
    });

  } catch (error) {
    console.error('日別統計取得エラー:', error);
    throw error;
  }
}
