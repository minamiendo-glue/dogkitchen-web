-- レシピの画像URLを実際の画像に更新
-- 実際の画像URLまたはプレースホルダー画像を使用

-- まず、既存のレシピに画像URLを追加/更新
UPDATE recipes 
SET thumbnail_url = CASE 
  -- サーモン系のレシピ
  WHEN title LIKE '%サーモン%' OR protein_type = 'fish' THEN 
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center'
  
  -- チキン系のレシピ
  WHEN title LIKE '%チキン%' OR title LIKE '%鶏%' OR protein_type = 'chicken' THEN 
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&crop=center'
  
  -- 牛肉系のレシピ
  WHEN title LIKE '%牛肉%' OR title LIKE '%牛%' OR protein_type = 'beef' THEN 
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop&crop=center'
  
  -- 豚肉系のレシピ
  WHEN title LIKE '%豚肉%' OR title LIKE '%豚%' OR protein_type = 'pork' THEN 
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center'
  
  -- 馬肉系のレシピ
  WHEN title LIKE '%馬肉%' OR title LIKE '%馬%' OR protein_type = 'horse' THEN 
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&crop=center'
  
  -- ラム系のレシピ
  WHEN title LIKE '%ラム%' OR protein_type = 'lamb' THEN 
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center'
  
  -- カンガルー系のレシピ
  WHEN title LIKE '%カンガルー%' OR protein_type = 'kangaroo' THEN 
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&crop=center'
  
  -- アジ・イワシ系のレシピ
  WHEN title LIKE '%アジ%' OR title LIKE '%イワシ%' OR protein_type = 'sardine' THEN 
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center'
  
  -- その他の料理
  WHEN title LIKE '%スープ%' THEN 
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&crop=center'
  
  WHEN title LIKE '%おやつ%' OR title LIKE '%おかし%' THEN 
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
  
  -- デフォルト画像
  ELSE 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=center'
END
WHERE thumbnail_url IS NULL OR thumbnail_url = '' OR thumbnail_url LIKE '%example.com%';

-- 結果を確認
SELECT id, title, protein_type, thumbnail_url 
FROM recipes 
WHERE thumbnail_url IS NOT NULL AND thumbnail_url != '' 
ORDER BY created_at DESC 
LIMIT 10;
