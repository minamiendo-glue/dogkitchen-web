-- DOG KITCHEN データベーススキーマ
-- Supabase PostgreSQL用

-- 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ユーザーテーブル（Supabase Authと連携）
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 愛犬プロフィールテーブル
CREATE TABLE IF NOT EXISTS dog_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  activity_level TEXT CHECK (activity_level IN ('low', 'medium', 'high')) NOT NULL,
  health_conditions TEXT[] DEFAULT '{}',
  life_stage TEXT CHECK (life_stage IN ('puppy', 'adult', 'senior')) NOT NULL,
  breed TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- レシピテーブル
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cooking_time INTEGER NOT NULL,
  servings TEXT NOT NULL,
  life_stage TEXT NOT NULL,
  protein_type TEXT NOT NULL,
  meal_scene TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  health_conditions TEXT[] DEFAULT '{}',
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  thumbnail_url TEXT,
  main_video_id TEXT,
  main_video_url TEXT,
  nutrition_info JSONB DEFAULT '{
    "calories": 0,
    "protein": 0,
    "fat": 0,
    "carbs": 0,
    "fiber": 0,
    "calculated_at": null
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- お気に入りレシピテーブル
CREATE TABLE IF NOT EXISTS favorite_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_dog_profiles_user_id ON dog_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);
CREATE INDEX IF NOT EXISTS idx_recipes_life_stage ON recipes(life_stage);
CREATE INDEX IF NOT EXISTS idx_recipes_protein_type ON recipes(protein_type);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_scene ON recipes(meal_scene);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_favorite_recipes_user_id ON favorite_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_recipes_recipe_id ON favorite_recipes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipes_nutrition_calories ON recipes USING GIN ((nutrition_info->>'calories'));
CREATE INDEX IF NOT EXISTS idx_recipes_nutrition_protein ON recipes USING GIN ((nutrition_info->>'protein'));

-- 更新日時自動更新のトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガーの作成（既存の場合は削除してから作成）
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dog_profiles_updated_at ON dog_profiles;
CREATE TRIGGER update_dog_profiles_updated_at BEFORE UPDATE ON dog_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) の有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dog_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_recipes ENABLE ROW LEVEL SECURITY;

-- RLSポリシーの作成

-- users テーブル
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- dog_profiles テーブル
CREATE POLICY "Users can view own dog profiles" ON dog_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own dog profiles" ON dog_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own dog profiles" ON dog_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own dog profiles" ON dog_profiles
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- recipes テーブル
CREATE POLICY "Anyone can view published recipes" ON recipes
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view own recipes" ON recipes
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own recipes" ON recipes
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own recipes" ON recipes
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own recipes" ON recipes
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- favorite_recipes テーブル
CREATE POLICY "Users can view own favorites" ON favorite_recipes
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own favorites" ON favorite_recipes
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own favorites" ON favorite_recipes
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- サンプルデータの挿入（開発用）
INSERT INTO users (id, email, name) VALUES 
    ('00000000-0000-0000-0000-000000000001', 'test@example.com', 'テストユーザー')
ON CONFLICT (email) DO NOTHING;

INSERT INTO dog_profiles (user_id, name, weight, activity_level, health_conditions, life_stage, breed) VALUES 
    ('00000000-0000-0000-0000-000000000001', 'ポチ', 5.5, 'medium', ARRAY['特になし'], 'adult', '柴犬'),
    ('00000000-0000-0000-0000-000000000001', 'タロウ', 8.2, 'low', ARRAY['関節炎'], 'senior', 'ゴールデンレトリバー')
ON CONFLICT DO NOTHING;

INSERT INTO recipes (user_id, title, description, cooking_time, servings, life_stage, protein_type, meal_scene, difficulty, health_conditions, ingredients, instructions, status) VALUES 
    ('00000000-0000-0000-0000-000000000001', 'チキンと野菜のヘルシーご飯', '栄養バランス抜群のチキンと野菜を使ったヘルシーなご飯です。', 25, '1食分', 'adult', 'chicken', 'daily', '簡単', ARRAY['balanced', 'diet'], 
     '[{"name": "鶏むね肉", "amount": "100g"}, {"name": "にんじん", "amount": "30g"}]',
     '[{"step": 1, "text": "鶏むね肉を一口大に切る。にんじんは薄い輪切りにする。"}, {"step": 2, "text": "フライパンで炒める。"}]',
     'published')
ON CONFLICT DO NOTHING;


