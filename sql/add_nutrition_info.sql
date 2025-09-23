-- 栄養情報フィールドをrecipesテーブルに追加
-- このSQLをSupabaseのSQL Editorで実行してください

-- nutrition_infoカラムを追加（JSONB形式）
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS nutrition_info JSONB DEFAULT '{
  "calories": 0,
  "protein": 0,
  "fat": 0,
  "carbs": 0,
  "fiber": 0,
  "calculated_at": null
}'::jsonb;

-- インデックスを追加（栄養情報での検索を高速化）
CREATE INDEX IF NOT EXISTS idx_recipes_nutrition_calories ON recipes USING GIN ((nutrition_info->>'calories'));
CREATE INDEX IF NOT EXISTS idx_recipes_nutrition_protein ON recipes USING GIN ((nutrition_info->>'protein'));

-- 既存のレシピにデフォルトの栄養情報を設定
UPDATE recipes 
SET nutrition_info = '{
  "calories": 0,
  "protein": 0,
  "fat": 0,
  "carbs": 0,
  "fiber": 0,
  "calculated_at": null
}'::jsonb
WHERE nutrition_info IS NULL;

-- コメントを追加
COMMENT ON COLUMN recipes.nutrition_info IS 'レシピの栄養情報（カロリー、タンパク質、脂質、炭水化物、食物繊維）';
