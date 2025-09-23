-- 既存のトリガーと関数を安全に削除・再作成するスクリプト

-- 既存のトリガーを削除（存在する場合のみ）
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_dog_profiles_updated_at ON dog_profiles;
DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;

-- 既存の関数を削除（存在する場合のみ）
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 更新日時自動更新のトリガー関数を再作成
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガーを再作成
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dog_profiles_updated_at BEFORE UPDATE ON dog_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- nutrition_infoカラムをrecipesテーブルに追加
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS nutrition_info JSONB DEFAULT '{
  "calories": 0,
  "protein": 0,
  "fat": 0,
  "carbs": 0,
  "fiber": 0,
  "calculated_at": null
}'::jsonb;

-- インデックスの作成（栄養情報での検索用）
CREATE INDEX IF NOT EXISTS idx_recipes_nutrition_calories ON recipes USING GIN ((nutrition_info->>'calories'));
CREATE INDEX IF NOT EXISTS idx_recipes_nutrition_protein ON recipes USING GIN ((nutrition_info->>'protein'));










