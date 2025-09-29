-- nutrition_infoカラムのみを追加する最小限のスクリプト
-- トリガーエラーを避けるため、カラム追加のみに限定

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

















