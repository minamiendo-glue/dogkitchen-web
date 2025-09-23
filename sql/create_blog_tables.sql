-- 記事テーブル
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 特集テーブル
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 記事とレシピの紐づけテーブル
CREATE TABLE IF NOT EXISTS article_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, recipe_id)
);

-- 特集とレシピの紐づけテーブル
CREATE TABLE IF NOT EXISTS feature_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(feature_id, recipe_id)
);

-- 特集の小項目テーブル
CREATE TABLE IF NOT EXISTS feature_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  recipe_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを作成
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_features_slug ON features(slug);
CREATE INDEX IF NOT EXISTS idx_features_status ON features(status);
CREATE INDEX IF NOT EXISTS idx_features_published_at ON features(published_at);
CREATE INDEX IF NOT EXISTS idx_article_recipes_article_id ON article_recipes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_recipes_recipe_id ON article_recipes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_feature_recipes_feature_id ON feature_recipes(feature_id);
CREATE INDEX IF NOT EXISTS idx_feature_recipes_recipe_id ON feature_recipes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_feature_sections_feature_id ON feature_sections(feature_id);
CREATE INDEX IF NOT EXISTS idx_feature_sections_display_order ON feature_sections(display_order);

-- RLS (Row Level Security) を有効化
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_sections ENABLE ROW LEVEL SECURITY;

-- 記事のRLSポリシー
CREATE POLICY "記事は誰でも閲覧可能" ON articles FOR SELECT USING (status = 'published');
-- 管理者権限はAPIレベルで制御するため、RLSでは全ユーザーに許可
CREATE POLICY "記事の管理は全ユーザーに許可" ON articles FOR ALL USING (true);

-- 特集のRLSポリシー
CREATE POLICY "特集は誰でも閲覧可能" ON features FOR SELECT USING (status = 'published');
-- 管理者権限はAPIレベルで制御するため、RLSでは全ユーザーに許可
CREATE POLICY "特集の管理は全ユーザーに許可" ON features FOR ALL USING (true);

-- 記事レシピ紐づけのRLSポリシー
CREATE POLICY "記事レシピ紐づけは誰でも閲覧可能" ON article_recipes FOR SELECT USING (true);
-- 管理者権限はAPIレベルで制御するため、RLSでは全ユーザーに許可
CREATE POLICY "記事レシピ紐づけの管理は全ユーザーに許可" ON article_recipes FOR ALL USING (true);

-- 特集レシピ紐づけのRLSポリシー
CREATE POLICY "特集レシピ紐づけは誰でも閲覧可能" ON feature_recipes FOR SELECT USING (true);
-- 管理者権限はAPIレベルで制御するため、RLSでは全ユーザーに許可
CREATE POLICY "特集レシピ紐づけの管理は全ユーザーに許可" ON feature_recipes FOR ALL USING (true);

-- 特集小項目のRLSポリシー
CREATE POLICY "特集小項目は誰でも閲覧可能" ON feature_sections FOR SELECT USING (true);
-- 管理者権限はAPIレベルで制御するため、RLSでは全ユーザーに許可
CREATE POLICY "特集小項目の管理は全ユーザーに許可" ON feature_sections FOR ALL USING (true);

-- 更新日時を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 記事の更新日時トリガー
CREATE TRIGGER update_articles_updated_at 
  BEFORE UPDATE ON articles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 特集の更新日時トリガー
CREATE TRIGGER update_features_updated_at 
  BEFORE UPDATE ON features 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 特集小項目の更新日時トリガー
CREATE TRIGGER update_feature_sections_updated_at 
  BEFORE UPDATE ON feature_sections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

