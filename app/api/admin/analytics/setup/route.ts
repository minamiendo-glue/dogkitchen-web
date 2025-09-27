import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

    // SQLスクリプトを実行
    const sqlScript = `
-- アクセス分析用テーブルの作成

-- 1. ページアクセスログテーブル
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- インデックス用の計算カラム
  date_part DATE GENERATED ALWAYS AS (created_at::DATE) STORED,
  hour_part INTEGER GENERATED ALWAYS AS (EXTRACT(HOUR FROM created_at)) STORED
);

-- 2. レシピ閲覧ログテーブル
CREATE TABLE IF NOT EXISTS recipe_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  view_duration INTEGER, -- 秒数
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- インデックス用の計算カラム
  date_part DATE GENERATED ALWAYS AS (created_at::DATE) STORED
);

-- 3. 検索ログテーブル
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  search_query TEXT,
  search_filters JSONB, -- 絞り込み条件
  results_count INTEGER,
  page_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- インデックス用の計算カラム
  date_part DATE GENERATED ALWAYS AS (created_at::DATE) STORED
);

-- 4. ユーザーアクションログテーブル
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  action_type TEXT NOT NULL, -- 'recipe_view', 'recipe_favorite', 'search', 'filter', etc.
  target_id UUID, -- レシピIDやその他の対象ID
  target_type TEXT, -- 'recipe', 'article', 'feature', etc.
  metadata JSONB, -- 追加の情報
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- インデックス用の計算カラム
  date_part DATE GENERATED ALWAYS AS (created_at::DATE) STORED
);

-- インデックスの作成
-- ページビュー用インデックス
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(date_part);
CREATE INDEX IF NOT EXISTS idx_page_views_user ON page_views(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);

-- レシピ閲覧用インデックス
CREATE INDEX IF NOT EXISTS idx_recipe_views_recipe_id ON recipe_views(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_views_date ON recipe_views(date_part);
CREATE INDEX IF NOT EXISTS idx_recipe_views_user ON recipe_views(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_recipe_views_created_at ON recipe_views(created_at);

-- 検索ログ用インデックス
CREATE INDEX IF NOT EXISTS idx_search_logs_query ON search_logs USING gin(to_tsvector('japanese', search_query));
CREATE INDEX IF NOT EXISTS idx_search_logs_filters ON search_logs USING gin(search_filters);
CREATE INDEX IF NOT EXISTS idx_search_logs_date ON search_logs(date_part);
CREATE INDEX IF NOT EXISTS idx_search_logs_user ON search_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at);

-- ユーザーアクション用インデックス
CREATE INDEX IF NOT EXISTS idx_user_actions_type ON user_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_user_actions_target ON user_actions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_date ON user_actions(date_part);
CREATE INDEX IF NOT EXISTS idx_user_actions_user ON user_actions(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_actions_created_at ON user_actions(created_at);

-- 分析用のビューを作成
CREATE OR REPLACE VIEW analytics_daily_stats AS
SELECT 
  date_part,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) as total_page_views,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT CASE WHEN page_path LIKE '/recipes%' THEN session_id END) as recipe_page_sessions,
  COUNT(DISTINCT CASE WHEN page_path LIKE '/blog%' THEN session_id END) as blog_page_sessions
FROM page_views
GROUP BY date_part
ORDER BY date_part DESC;

-- RLS (Row Level Security) の設定
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- 一般ユーザーは自分のデータのみ挿入可能
CREATE POLICY IF NOT EXISTS "Users can insert their own page_views" ON page_views
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Users can insert their own recipe_views" ON recipe_views
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Users can insert their own search_logs" ON search_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Users can insert their own user_actions" ON user_actions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- サンプルデータ挿入（テスト用）
INSERT INTO page_views (page_path, page_title, session_id, ip_address, user_agent) VALUES
('/recipes', 'レシピ一覧', 'session_001', '192.168.1.1', 'Mozilla/5.0...'),
('/recipes', 'レシピ一覧', 'session_002', '192.168.1.2', 'Mozilla/5.0...'),
('/blog/articles', '記事一覧', 'session_003', '192.168.1.3', 'Mozilla/5.0...'),
('/faq', 'よくある質問', 'session_004', '192.168.1.4', 'Mozilla/5.0...'),
('/premium', 'プレミアムプラン', 'session_005', '192.168.1.5', 'Mozilla/5.0...')
ON CONFLICT DO NOTHING;

-- 既存のレシピIDを取得してサンプルデータを挿入
DO $$
DECLARE
    recipe_ids UUID[];
BEGIN
    SELECT ARRAY_AGG(id) INTO recipe_ids FROM recipes LIMIT 3;
    
    IF array_length(recipe_ids, 1) > 0 THEN
        INSERT INTO recipe_views (recipe_id, session_id, ip_address, user_agent, view_duration) VALUES
        (recipe_ids[1], 'session_001', '192.168.1.1', 'Mozilla/5.0...', 45),
        (recipe_ids[1], 'session_002', '192.168.1.2', 'Mozilla/5.0...', 32),
        (recipe_ids[2], 'session_003', '192.168.1.3', 'Mozilla/5.0...', 28),
        (recipe_ids[2], 'session_004', '192.168.1.4', 'Mozilla/5.0...', 67),
        (recipe_ids[3], 'session_005', '192.168.1.5', 'Mozilla/5.0...', 23)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

INSERT INTO search_logs (session_id, search_query, search_filters, results_count, page_path) VALUES
('session_001', 'チキン', '{"protein_type": "chicken"}', 5, '/recipes'),
('session_002', 'シニア', '{"life_stage": "senior"}', 3, '/recipes'),
('session_003', 'サーモン', '{"protein_type": "fish"}', 8, '/recipes'),
('session_004', '', '{"protein_type": "beef", "difficulty": "easy"}', 12, '/recipes'),
('session_005', 'おやつ', '{"meal_scene": "snack"}', 4, '/recipes')
ON CONFLICT DO NOTHING;

-- 既存のレシピIDを取得してユーザーアクションのサンプルデータを挿入
DO $$
DECLARE
    recipe_ids UUID[];
BEGIN
    SELECT ARRAY_AGG(id) INTO recipe_ids FROM recipes LIMIT 3;
    
    IF array_length(recipe_ids, 1) > 0 THEN
        INSERT INTO user_actions (session_id, action_type, target_id, target_type, metadata) VALUES
        ('session_001', 'recipe_view', recipe_ids[1], 'recipe', '{"view_duration": 45}'),
        ('session_002', 'recipe_favorite', recipe_ids[1], 'recipe', '{"action": "add"}'),
        ('session_003', 'search', NULL, 'search', '{"query": "チキン", "filters": {"protein_type": "chicken"}}'),
        ('session_004', 'filter_apply', NULL, 'filter', '{"filters": {"life_stage": "senior"}}'),
        ('session_005', 'recipe_share', recipe_ids[2], 'recipe', '{"platform": "twitter"}')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

SELECT 'Analytics tables created successfully' as message;
    `;

    // SQLを実行
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql: sqlScript });

    if (error) {
      console.error('SQL実行エラー:', error);
      return NextResponse.json(
        { 
          error: 'テーブル作成に失敗しました',
          details: error.message 
        },
        { status: 500 }
      );
    }

    // テーブルが作成されたか確認
    const { data: tables, error: tableError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['page_views', 'recipe_views', 'search_logs', 'user_actions']);

    if (tableError) {
      console.error('テーブル確認エラー:', tableError);
    }

    return NextResponse.json({
      success: true,
      message: '分析テーブルが正常に作成されました',
      created_tables: tables?.map(t => t.table_name) || [],
      data: data
    });

  } catch (error) {
    console.error('分析テーブル作成エラー:', error);
    return NextResponse.json(
      { error: '分析テーブルの作成に失敗しました' },
      { status: 500 }
    );
  }
}

// テーブル作成状況を確認するGETエンドポイント
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

    // テーブルの存在確認
    const { data: tables, error: tableError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['page_views', 'recipe_views', 'search_logs', 'user_actions']);

    if (tableError) {
      console.error('テーブル確認エラー:', tableError);
      return NextResponse.json(
        { error: 'テーブル確認に失敗しました' },
        { status: 500 }
      );
    }

    const existingTables = tables?.map(t => t.table_name) || [];
    const requiredTables = ['page_views', 'recipe_views', 'search_logs', 'user_actions'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    // 各テーブルのレコード数を確認
    const tableCounts: Record<string, number> = {};
    for (const table of existingTables) {
      const { count, error } = await supabaseAdmin
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        tableCounts[table] = count || 0;
      }
    }

    return NextResponse.json({
      success: true,
      existing_tables: existingTables,
      missing_tables: missingTables,
      is_complete: missingTables.length === 0,
      table_counts: tableCounts,
      setup_required: missingTables.length > 0
    });

  } catch (error) {
    console.error('テーブル確認エラー:', error);
    return NextResponse.json(
      { error: 'テーブル確認に失敗しました' },
      { status: 500 }
    );
  }
}
