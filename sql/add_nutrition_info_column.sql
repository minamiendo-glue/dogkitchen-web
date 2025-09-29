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

















