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

CREATE OR REPLACE VIEW analytics_popular_recipes AS
SELECT 
  rv.recipe_id,
  r.title as recipe_title,
  COUNT(*) as view_count,
  COUNT(DISTINCT rv.user_id) as unique_users,
  COUNT(DISTINCT rv.session_id) as unique_sessions,
  AVG(rv.view_duration) as avg_view_duration,
  MAX(rv.created_at) as last_viewed
FROM recipe_views rv
LEFT JOIN recipes r ON rv.recipe_id = r.id
WHERE rv.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY rv.recipe_id, r.title
ORDER BY view_count DESC;

CREATE OR REPLACE VIEW analytics_search_stats AS
SELECT 
  search_query,
  COUNT(*) as search_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(results_count) as avg_results_count,
  MAX(created_at) as last_searched
FROM search_logs
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  AND search_query IS NOT NULL
  AND search_query != ''
GROUP BY search_query
ORDER BY search_count DESC;

CREATE OR REPLACE VIEW analytics_filter_stats AS
SELECT 
  jsonb_object_keys(search_filters) as filter_type,
  search_filters->>jsonb_object_keys(search_filters) as filter_value,
  COUNT(*) as usage_count,
  COUNT(DISTINCT user_id) as unique_users,
  MAX(created_at) as last_used
FROM search_logs
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  AND search_filters IS NOT NULL
  AND search_filters != '{}'
GROUP BY jsonb_object_keys(search_filters), search_filters->>jsonb_object_keys(search_filters)
ORDER BY usage_count DESC;

-- RLS (Row Level Security) の設定
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- 管理者のみアクセス可能にするポリシー
CREATE POLICY "Admin can manage page_views" ON page_views
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can manage recipe_views" ON recipe_views
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can manage search_logs" ON search_logs
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can manage user_actions" ON user_actions
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- 一般ユーザーは自分のデータのみ挿入可能
CREATE POLICY "Users can insert their own page_views" ON page_views
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own recipe_views" ON recipe_views
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own search_logs" ON search_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own user_actions" ON user_actions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- サンプルデータ挿入（テスト用）
INSERT INTO page_views (page_path, page_title, session_id, ip_address, user_agent) VALUES
('/recipes', 'レシピ一覧', 'session_001', '192.168.1.1', 'Mozilla/5.0...'),
('/recipes', 'レシピ一覧', 'session_002', '192.168.1.2', 'Mozilla/5.0...'),
('/blog/articles', '記事一覧', 'session_003', '192.168.1.3', 'Mozilla/5.0...'),
('/faq', 'よくある質問', 'session_004', '192.168.1.4', 'Mozilla/5.0...'),
('/premium', 'プレミアムプラン', 'session_005', '192.168.1.5', 'Mozilla/5.0...');

INSERT INTO recipe_views (recipe_id, session_id, ip_address, user_agent, view_duration) VALUES
('dcc2239b-1072-4d52-9947-ec2f5d01bae1', 'session_001', '192.168.1.1', 'Mozilla/5.0...', 45),
('dcc2239b-1072-4d52-9947-ec2f5d01bae1', 'session_002', '192.168.1.2', 'Mozilla/5.0...', 32),
('0ffc3d88-74ba-42e1-b5c7-e10ab1be234e', 'session_003', '192.168.1.3', 'Mozilla/5.0...', 28),
('0ffc3d88-74ba-42e1-b5c7-e10ab1be234e', 'session_004', '192.168.1.4', 'Mozilla/5.0...', 67),
('41fcf9d0-b446-4cd2-ba88-31b6a03e3da5', 'session_005', '192.168.1.5', 'Mozilla/5.0...', 23);

INSERT INTO search_logs (session_id, search_query, search_filters, results_count, page_path) VALUES
('session_001', 'チキン', '{"protein_type": "chicken"}', 5, '/recipes'),
('session_002', 'シニア', '{"life_stage": "senior"}', 3, '/recipes'),
('session_003', 'サーモン', '{"protein_type": "fish"}', 8, '/recipes'),
('session_004', '', '{"protein_type": "beef", "difficulty": "easy"}', 12, '/recipes'),
('session_005', 'おやつ', '{"meal_scene": "snack"}', 4, '/recipes');

INSERT INTO user_actions (session_id, action_type, target_id, target_type, metadata) VALUES
('session_001', 'recipe_view', 'dcc2239b-1072-4d52-9947-ec2f5d01bae1', 'recipe', '{"view_duration": 45}'),
('session_002', 'recipe_favorite', 'dcc2239b-1072-4d52-9947-ec2f5d01bae1', 'recipe', '{"action": "add"}'),
('session_003', 'search', NULL, 'search', '{"query": "チキン", "filters": {"protein_type": "chicken"}}'),
('session_004', 'filter_apply', NULL, 'filter', '{"filters": {"life_stage": "senior"}}'),
('session_005', 'recipe_share', '0ffc3d88-74ba-42e1-b5c7-e10ab1be234e', 'recipe', '{"platform": "twitter"}');

-- 確認用クエリ
SELECT 'Analytics tables created successfully' as message;
SELECT COUNT(*) as page_views_count FROM page_views;
SELECT COUNT(*) as recipe_views_count FROM recipe_views;
SELECT COUNT(*) as search_logs_count FROM search_logs;
SELECT COUNT(*) as user_actions_count FROM user_actions;
