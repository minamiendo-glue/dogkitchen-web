-- レシピの表示タイプを追加するためのSQL
-- ステップ動画形式と盛り付け画像形式の2つの表示方法をサポート

-- レシピテーブルに新しいカラムを追加
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS recipe_type TEXT CHECK (recipe_type IN ('video_steps', 'image_plating')) DEFAULT 'video_steps';

-- 盛り付け画像用のカラムを追加
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS plating_images JSONB DEFAULT '[]'::jsonb;

-- 盛り付け画像のコメント用のカラムを追加
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS plating_comments JSONB DEFAULT '[]'::jsonb;

-- インデックスの作成（検索パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_recipes_recipe_type ON recipes(recipe_type);

-- 既存のレシピデータをvideo_steps形式に設定（デフォルト値）
UPDATE recipes 
SET recipe_type = 'video_steps' 
WHERE recipe_type IS NULL;

-- コメント：新しいフィールドの説明
-- recipe_type: 'video_steps' = ステップ動画形式, 'image_plating' = 盛り付け画像形式
-- plating_images: 盛り付け画像のURL配列 [{"url": "image1.jpg", "alt": "完成画像1"}, ...]
-- plating_comments: 各画像に対応するコメント配列 ["コメント1", "コメント2", ...]
