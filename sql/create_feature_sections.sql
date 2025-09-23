-- 特集小項目テーブルの作成
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

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_feature_sections_feature_id ON feature_sections(feature_id);
CREATE INDEX IF NOT EXISTS idx_feature_sections_display_order ON feature_sections(display_order);

-- RLS (Row Level Security) を有効化
ALTER TABLE feature_sections ENABLE ROW LEVEL SECURITY;

-- RLSポリシーの作成
CREATE POLICY "特集小項目は誰でも閲覧可能" ON feature_sections FOR SELECT USING (true);
CREATE POLICY "特集小項目の管理は全ユーザーに許可" ON feature_sections FOR ALL USING (true);

-- 更新日時を自動更新するトリガー
CREATE TRIGGER update_feature_sections_updated_at 
  BEFORE UPDATE ON feature_sections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
