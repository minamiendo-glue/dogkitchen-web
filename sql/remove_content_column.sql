-- featuresテーブルからcontentカラムを削除
ALTER TABLE features DROP COLUMN IF EXISTS content;
