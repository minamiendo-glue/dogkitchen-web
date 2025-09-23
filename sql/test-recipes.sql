-- 絞り込み機能テスト用のレシピデータ
-- 様々な条件の組み合わせでテストできるように作成

-- 既存のテストデータをクリア（必要に応じて）
-- DELETE FROM recipes WHERE title LIKE '%テスト%';

-- ライフステージ別のテストデータ
INSERT INTO recipes (
  id, title, slug, description, cooking_time_minutes, life_stage, 
  health_conditions, protein_type, meal_scene, difficulty, 
  video_url, thumbnail_url, calories, created_at, updated_at
) VALUES 
-- 子犬期のレシピ
('test-puppy-1', '子犬用チキン粥', 'puppy-chicken-porridge', '子犬の成長に必要な栄養をバランス良く含んだチキン粥', 15, 'puppy', 
 '["balanced"]', 'chicken', 'daily', 'easy', 
 'https://example.com/video1', 'https://example.com/thumb1.jpg', 120, NOW(), NOW()),

('test-puppy-2', '子犬用サーモンおやつ', 'puppy-salmon-treat', '子犬の嗜好性を高めるサーモンを使ったおやつ', 10, 'puppy', 
 '["appetite"]', 'fish', 'snack', 'easy', 
 'https://example.com/video2', 'https://example.com/thumb2.jpg', 80, NOW(), NOW()),

-- 成犬期のレシピ
('test-adult-1', '成犬用牛肉メイン', 'adult-beef-main', '成犬の筋肉維持に最適な牛肉を使ったメインディッシュ', 30, 'adult', 
 '["balanced"]', 'beef', 'daily', 'medium', 
 'https://example.com/video3', 'https://example.com/thumb3.jpg', 200, NOW(), NOW()),

('test-adult-2', '成犬用豚肉ダイエット食', 'adult-pork-diet', 'ダイエット中の成犬向け低カロリー豚肉レシピ', 25, 'adult', 
 '["diet"]', 'pork', 'daily', 'medium', 
 'https://example.com/video4', 'https://example.com/thumb4.jpg', 150, NOW(), NOW()),

('test-adult-3', '成犬用馬肉特別食', 'adult-horse-special', '特別な日の成犬向け馬肉レシピ', 45, 'adult', 
 '["balanced"]', 'horse', 'special', 'hard', 
 'https://example.com/video5', 'https://example.com/thumb5.jpg', 180, NOW(), NOW()),

-- シニア期のレシピ
('test-senior-1', 'シニア用鶏肉柔らか煮', 'senior-chicken-soft', 'シニア犬の消化に優しい柔らかく煮た鶏肉', 40, 'senior', 
 '["joint_care"]', 'chicken', 'daily', 'medium', 
 'https://example.com/video6', 'https://example.com/thumb6.jpg', 160, NOW(), NOW()),

('test-senior-2', 'シニア用魚介スープ', 'senior-fish-soup', 'シニア犬の関節ケアに良い魚介を使ったスープ', 35, 'senior', 
 '["joint_care", "cold"]', 'fish', 'daily', 'easy', 
 'https://example.com/video7', 'https://example.com/thumb7.jpg', 100, NOW(), NOW()),

-- 健康状態別のテストデータ
('test-health-1', '腎臓ケア用鶏肉', 'kidney-care-chicken', '腎臓に優しい低リン鶏肉レシピ', 20, 'adult', 
 '["kidney_care"]', 'chicken', 'daily', 'easy', 
 'https://example.com/video8', 'https://example.com/thumb8.jpg', 140, NOW(), NOW()),

('test-health-2', '心臓ケア用魚料理', 'heart-care-fish', '心臓に良いオメガ3豊富な魚料理', 25, 'adult', 
 '["heart_care"]', 'fish', 'daily', 'medium', 
 'https://example.com/video9', 'https://example.com/thumb9.jpg', 170, NOW(), NOW()),

('test-health-3', '肝臓ケア用馬肉', 'liver-care-horse', '肝臓の回復をサポートする馬肉レシピ', 30, 'adult', 
 '["liver_care"]', 'horse', 'daily', 'medium', 
 'https://example.com/video10', 'https://example.com/thumb10.jpg', 190, NOW(), NOW()),

('test-health-4', '皮膚ケア用カンガルー', 'skin-care-kangaroo', '皮膚の健康をサポートするカンガルー肉', 35, 'adult', 
 '["skin_care"]', 'kangaroo', 'daily', 'hard', 
 'https://example.com/video11', 'https://example.com/thumb11.jpg', 160, NOW(), NOW()),

('test-health-5', 'お腹が弱い子用鶏肉', 'weak-stomach-chicken', '消化に優しい柔らか鶏肉レシピ', 20, 'adult', 
 '["weak_stomach"]', 'chicken', 'daily', 'easy', 
 'https://example.com/video12', 'https://example.com/thumb12.jpg', 130, NOW(), NOW()),

('test-health-6', '熱中症対策スープ', 'heat-stroke-soup', '夏の熱中症対策に最適なスープ', 15, 'adult', 
 '["summer_heat"]', 'fish', 'daily', 'easy', 
 'https://example.com/video13', 'https://example.com/thumb13.jpg', 90, NOW(), NOW()),

('test-health-7', '体重増加用高カロリー', 'weight-gain-high-cal', '体重増加が必要な犬向け高カロリーレシピ', 30, 'adult', 
 '["weight_gain"]', 'beef', 'daily', 'medium', 
 'https://example.com/video14', 'https://example.com/thumb14.jpg', 300, NOW(), NOW()),

('test-health-8', '冷え対策温かいスープ', 'cold-warm-soup', '体の冷えを改善する温かいスープ', 25, 'adult', 
 '["cold"]', 'chicken', 'daily', 'easy', 
 'https://example.com/video15', 'https://example.com/thumb15.jpg', 120, NOW(), NOW()),

('test-health-9', '嗜好性UPおやつ', 'appetite-treat', '食欲不振の犬向け嗜好性の高いおやつ', 10, 'adult', 
 '["appetite"]', 'fish', 'snack', 'easy', 
 'https://example.com/video16', 'https://example.com/thumb16.jpg', 60, NOW(), NOW()),

-- タンパク質タイプ別のテストデータ
('test-protein-1', '牛肉ステーキ', 'beef-steak', 'ジューシーな牛肉ステーキ', 20, 'adult', 
 '["balanced"]', 'beef', 'special', 'hard', 
 'https://example.com/video17', 'https://example.com/thumb17.jpg', 250, NOW(), NOW()),

('test-protein-2', '豚肉の生姜焼き', 'pork-ginger', '生姜で臭みを消した豚肉料理', 25, 'adult', 
 '["balanced"]', 'pork', 'daily', 'medium', 
 'https://example.com/video18', 'https://example.com/thumb18.jpg', 200, NOW(), NOW()),

('test-protein-3', '鶏肉の照り焼き', 'chicken-teriyaki', '甘辛い照り焼きチキン', 20, 'adult', 
 '["balanced"]', 'chicken', 'daily', 'medium', 
 'https://example.com/video19', 'https://example.com/thumb19.jpg', 180, NOW(), NOW()),

('test-protein-4', '馬肉の刺身', 'horse-sashimi', '新鮮な馬肉の刺身', 5, 'adult', 
 '["balanced"]', 'horse', 'special', 'easy', 
 'https://example.com/video20', 'https://example.com/thumb20.jpg', 160, NOW(), NOW()),

('test-protein-5', '魚のムニエル', 'fish-meuniere', 'バター香る魚のムニエル', 15, 'adult', 
 '["balanced"]', 'fish', 'daily', 'medium', 
 'https://example.com/video21', 'https://example.com/thumb21.jpg', 140, NOW(), NOW()),

('test-protein-6', 'カンガルー肉のロースト', 'kangaroo-roast', '低脂肪高タンパクなカンガルー肉のロースト', 45, 'adult', 
 '["balanced"]', 'kangaroo', 'special', 'hard', 
 'https://example.com/video22', 'https://example.com/thumb22.jpg', 120, NOW(), NOW()),

-- 食事シーン別のテストデータ
('test-meal-1', '日常のご飯', 'daily-rice', '毎日の基本となるご飯', 20, 'adult', 
 '["balanced"]', 'chicken', 'daily', 'easy', 
 'https://example.com/video23', 'https://example.com/thumb23.jpg', 150, NOW(), NOW()),

('test-meal-2', 'おやつタイム', 'snack-time', 'おやつとして与える軽食', 5, 'adult', 
 '["appetite"]', 'fish', 'snack', 'easy', 
 'https://example.com/video24', 'https://example.com/thumb24.jpg', 50, NOW(), NOW()),

('test-meal-3', '特別な日のごちそう', 'special-feast', '誕生日や記念日の特別料理', 60, 'adult', 
 '["balanced"]', 'beef', 'special', 'hard', 
 'https://example.com/video25', 'https://example.com/thumb25.jpg', 300, NOW(), NOW()),

-- 難易度別のテストデータ
('test-difficulty-1', '簡単レシピ', 'easy-recipe', '初心者でも作れる簡単レシピ', 10, 'adult', 
 '["balanced"]', 'chicken', 'daily', 'easy', 
 'https://example.com/video26', 'https://example.com/thumb26.jpg', 100, NOW(), NOW()),

('test-difficulty-2', '普通のレシピ', 'medium-recipe', '少し手間のかかる普通のレシピ', 30, 'adult', 
 '["balanced"]', 'pork', 'daily', 'medium', 
 'https://example.com/video27', 'https://example.com/thumb27.jpg', 180, NOW(), NOW()),

('test-difficulty-3', '難しいレシピ', 'hard-recipe', '上級者向けの難しいレシピ', 90, 'adult', 
 '["balanced"]', 'beef', 'special', 'hard', 
 'https://example.com/video28', 'https://example.com/thumb28.jpg', 250, NOW(), NOW()),

-- 調理時間別のテストデータ
('test-time-1', '5分レシピ', '5min-recipe', '超時短5分レシピ', 5, 'adult', 
 '["balanced"]', 'chicken', 'daily', 'easy', 
 'https://example.com/video29', 'https://example.com/thumb29.jpg', 80, NOW(), NOW()),

('test-time-2', '30分レシピ', '30min-recipe', '30分で完成するレシピ', 30, 'adult', 
 '["balanced"]', 'fish', 'daily', 'medium', 
 'https://example.com/video30', 'https://example.com/thumb30.jpg', 160, NOW(), NOW()),

('test-time-3', '2時間レシピ', '2hour-recipe', 'じっくり2時間かける本格レシピ', 120, 'adult', 
 '["balanced"]', 'beef', 'special', 'hard', 
 'https://example.com/video31', 'https://example.com/thumb31.jpg', 400, NOW(), NOW()),

-- 複合条件のテストデータ
('test-complex-1', '子犬用腎臓ケア鶏肉', 'puppy-kidney-chicken', '子犬の腎臓ケアに特化した鶏肉レシピ', 20, 'puppy', 
 '["kidney_care"]', 'chicken', 'daily', 'easy', 
 'https://example.com/video32', 'https://example.com/thumb32.jpg', 120, NOW(), NOW()),

('test-complex-2', 'シニア用心臓ケア魚', 'senior-heart-fish', 'シニア犬の心臓ケアに良い魚料理', 25, 'senior', 
 '["heart_care"]', 'fish', 'daily', 'medium', 
 'https://example.com/video33', 'https://example.com/thumb33.jpg', 140, NOW(), NOW()),

('test-complex-3', 'ダイエット用馬肉おやつ', 'diet-horse-snack', 'ダイエット中の犬向け低カロリー馬肉おやつ', 15, 'adult', 
 '["diet"]', 'horse', 'snack', 'easy', 
 'https://example.com/video34', 'https://example.com/thumb34.jpg', 60, NOW(), NOW()),

('test-complex-4', '特別な日の関節ケア', 'special-joint-care', '特別な日の関節ケアに良いカンガルー肉', 50, 'senior', 
 '["joint_care"]', 'kangaroo', 'special', 'hard', 
 'https://example.com/video35', 'https://example.com/thumb35.jpg', 180, NOW(), NOW()),

('test-complex-5', '熱中症対策簡単スープ', 'heat-easy-soup', '熱中症対策の簡単スープ', 10, 'adult', 
 '["summer_heat"]', 'fish', 'daily', 'easy', 
 'https://example.com/video36', 'https://example.com/thumb36.jpg', 70, NOW(), NOW());
