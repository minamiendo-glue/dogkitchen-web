import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // 画像付きの拡張テストデータ
    const testRecipes = [
      // 子犬期のレシピ
      {
        id: uuidv4(),
        title: '子犬用チキン粥',
        description: '子犬の成長に必要な栄養をバランス良く含んだチキン粥',
        cooking_time: 15,
        life_stage: 'puppy',
        health_conditions: ['balanced'],
        protein_type: 'chicken',
        meal_scene: 'daily',
        difficulty: 'easy',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        ingredients: [
          { name: '鶏胸肉', amount: '50g' },
          { name: '白米', amount: '30g' }
        ],
        instructions: [
          '鶏胸肉を細かく切る',
          '白米と一緒に煮込む',
          '柔らかくなるまで煮込む'
        ]
      },
      {
        id: uuidv4(),
        title: '子犬用サーモンおやつ',
        description: '子犬の嗜好性を高めるサーモンを使ったおやつ',
        cooking_time: 10,
        life_stage: 'puppy',
        health_conditions: ['appetite'],
        protein_type: 'fish',
        meal_scene: 'snack',
        difficulty: 'easy',
        status: 'published',
        servings: '少量',
        thumbnail_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        ingredients: [
          { name: 'サーモン', amount: '30g' }
        ],
        instructions: [
          'サーモンを細かく切る',
          'そのまま与える'
        ]
      },
      {
        id: uuidv4(),
        title: '子犬用成長サポート',
        description: '子犬の成長をサポートする栄養豊富なレシピ',
        cooking_time: 20,
        life_stage: 'puppy',
        health_conditions: ['balanced', 'weight_gain'],
        protein_type: 'chicken',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
        ingredients: [
          { name: '鶏もも肉', amount: '60g' },
          { name: '野菜', amount: '40g' },
          { name: '白米', amount: '40g' }
        ],
        instructions: [
          '鶏肉を茹でる',
          '野菜を柔らかく煮る',
          '白米と混ぜ合わせる'
        ]
      },
      // 成犬期のレシピ
      {
        id: uuidv4(),
        title: '成犬用牛肉メイン',
        description: '成犬の筋肉維持に最適な牛肉を使ったメインディッシュ',
        cooking_time: 30,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'beef',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        ingredients: [
          { name: '牛肉', amount: '100g' },
          { name: '野菜', amount: '50g' }
        ],
        instructions: [
          '牛肉を焼く',
          '野菜を炒める',
          '一緒に盛り付ける'
        ]
      },
      {
        id: uuidv4(),
        title: '成犬用豚肉ダイエット食',
        description: 'ダイエット中の成犬向け低カロリー豚肉レシピ',
        cooking_time: 25,
        life_stage: 'adult',
        health_conditions: ['diet'],
        protein_type: 'pork',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        ingredients: [
          { name: '豚ヒレ肉', amount: '80g' },
          { name: '低カロリー野菜', amount: '60g' }
        ],
        instructions: [
          '豚肉を茹でる',
          '野菜を蒸す',
          '一緒に盛り付ける'
        ]
      },
      {
        id: uuidv4(),
        title: '成犬用馬肉特別食',
        description: '特別な日の成犬向け馬肉レシピ',
        cooking_time: 45,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'horse',
        meal_scene: 'special',
        difficulty: 'hard',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
        ingredients: [
          { name: '馬肉', amount: '90g' },
          { name: '高級野菜', amount: '50g' }
        ],
        instructions: [
          '馬肉を低温で調理',
          '野菜を美しく盛り付ける',
          '特別な盛り付けで完成'
        ]
      },
      // シニア期のレシピ
      {
        id: uuidv4(),
        title: 'シニア用鶏肉柔らか煮',
        description: 'シニア犬の消化に優しい柔らかく煮た鶏肉',
        cooking_time: 40,
        life_stage: 'senior',
        health_conditions: ['joint_care'],
        protein_type: 'chicken',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        ingredients: [
          { name: '鶏胸肉', amount: '70g' },
          { name: '柔らかい野菜', amount: '40g' }
        ],
        instructions: [
          '鶏肉を長時間煮込む',
          '野菜も柔らかく煮る',
          '消化しやすい状態にする'
        ]
      },
      {
        id: uuidv4(),
        title: 'シニア用魚介スープ',
        description: 'シニア犬の関節ケアに良い魚介を使ったスープ',
        cooking_time: 35,
        life_stage: 'senior',
        health_conditions: ['joint_care', 'cold'],
        protein_type: 'fish',
        meal_scene: 'daily',
        difficulty: 'easy',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        ingredients: [
          { name: '白身魚', amount: '80g' },
          { name: '野菜', amount: '30g' }
        ],
        instructions: [
          '魚を煮る',
          '野菜を加える',
          'スープ状にする'
        ]
      },
      {
        id: uuidv4(),
        title: 'シニア用心臓ケア魚',
        description: 'シニア犬の心臓ケアに良い魚料理',
        cooking_time: 25,
        life_stage: 'senior',
        health_conditions: ['heart_care'],
        protein_type: 'fish',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
        ingredients: [
          { name: '青魚', amount: '75g' },
          { name: '心臓に良い野菜', amount: '35g' }
        ],
        instructions: [
          '青魚を調理する',
          '野菜を加える',
          '心臓に良い調理法で完成'
        ]
      },
      // 健康状態別のテストデータ
      {
        id: uuidv4(),
        title: '腎臓ケア用鶏肉',
        description: '腎臓に優しい低リン鶏肉レシピ',
        cooking_time: 20,
        life_stage: 'adult',
        health_conditions: ['kidney_care'],
        protein_type: 'chicken',
        meal_scene: 'daily',
        difficulty: 'easy',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        ingredients: [
          { name: '鶏胸肉', amount: '70g' },
          { name: '低リン野菜', amount: '40g' }
        ],
        instructions: [
          '鶏肉を茹でる',
          '野菜を加える',
          '柔らかく煮込む'
        ]
      },
      {
        id: uuidv4(),
        title: '心臓ケア用魚料理',
        description: '心臓に良いオメガ3豊富な魚料理',
        cooking_time: 25,
        life_stage: 'adult',
        health_conditions: ['heart_care'],
        protein_type: 'fish',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        ingredients: [
          { name: 'サバ', amount: '80g' },
          { name: '心臓に良い野菜', amount: '45g' }
        ],
        instructions: [
          'サバを調理する',
          '野菜を加える',
          'オメガ3を活かした調理'
        ]
      },
      {
        id: uuidv4(),
        title: '肝臓ケア用馬肉',
        description: '肝臓の回復をサポートする馬肉レシピ',
        cooking_time: 30,
        life_stage: 'adult',
        health_conditions: ['liver_care'],
        protein_type: 'horse',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
        ingredients: [
          { name: '馬肉', amount: '85g' },
          { name: '肝臓に良い野菜', amount: '40g' }
        ],
        instructions: [
          '馬肉を調理する',
          '野菜を加える',
          '肝臓に優しい調理法'
        ]
      },
      {
        id: uuidv4(),
        title: '皮膚ケア用カンガルー',
        description: '皮膚の健康をサポートするカンガルー肉',
        cooking_time: 35,
        life_stage: 'adult',
        health_conditions: ['skin_care'],
        protein_type: 'kangaroo',
        meal_scene: 'daily',
        difficulty: 'hard',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        ingredients: [
          { name: 'カンガルー肉', amount: '90g' },
          { name: '皮膚に良い野菜', amount: '35g' }
        ],
        instructions: [
          'カンガルー肉を調理',
          '野菜を加える',
          '皮膚の健康をサポート'
        ]
      },
      {
        id: uuidv4(),
        title: 'お腹が弱い子用鶏肉',
        description: '消化に優しい柔らか鶏肉レシピ',
        cooking_time: 20,
        life_stage: 'adult',
        health_conditions: ['weak_stomach'],
        protein_type: 'chicken',
        meal_scene: 'daily',
        difficulty: 'easy',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        ingredients: [
          { name: '鶏胸肉', amount: '60g' },
          { name: '消化に良い野菜', amount: '30g' }
        ],
        instructions: [
          '鶏肉を柔らかく煮る',
          '野菜も柔らかくする',
          '消化しやすい状態で完成'
        ]
      },
      {
        id: uuidv4(),
        title: '熱中症対策スープ',
        description: '夏の熱中症対策に最適なスープ',
        cooking_time: 15,
        life_stage: 'adult',
        health_conditions: ['summer_heat'],
        protein_type: 'fish',
        meal_scene: 'daily',
        difficulty: 'easy',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
        ingredients: [
          { name: '白身魚', amount: '50g' },
          { name: '水分豊富な野菜', amount: '40g' }
        ],
        instructions: [
          '魚を煮る',
          '野菜を加える',
          '水分を多く含むスープにする'
        ]
      },
      {
        id: uuidv4(),
        title: '体重増加用高カロリー',
        description: '体重増加が必要な犬向け高カロリーレシピ',
        cooking_time: 30,
        life_stage: 'adult',
        health_conditions: ['weight_gain'],
        protein_type: 'beef',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        ingredients: [
          { name: '牛肉', amount: '120g' },
          { name: '高カロリー野菜', amount: '50g' }
        ],
        instructions: [
          '牛肉を調理する',
          '野菜を加える',
          '高カロリーで栄養豊富に'
        ]
      },
      {
        id: uuidv4(),
        title: '冷え対策温かいスープ',
        description: '体の冷えを改善する温かいスープ',
        cooking_time: 25,
        life_stage: 'adult',
        health_conditions: ['cold'],
        protein_type: 'chicken',
        meal_scene: 'daily',
        difficulty: 'easy',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        ingredients: [
          { name: '鶏肉', amount: '70g' },
          { name: '体を温める野菜', amount: '40g' }
        ],
        instructions: [
          '鶏肉を煮る',
          '温かい野菜を加える',
          '体を温めるスープに'
        ]
      },
      {
        id: uuidv4(),
        title: '嗜好性UPおやつ',
        description: '食欲不振の犬向け嗜好性の高いおやつ',
        cooking_time: 10,
        life_stage: 'adult',
        health_conditions: ['appetite'],
        protein_type: 'fish',
        meal_scene: 'snack',
        difficulty: 'easy',
        status: 'published',
        servings: '少量',
        thumbnail_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
        ingredients: [
          { name: '魚肉', amount: '30g' }
        ],
        instructions: [
          '魚肉を細かく切る',
          'そのまま与える'
        ]
      },
      // タンパク質タイプ別のテストデータ
      {
        id: uuidv4(),
        title: '牛肉ステーキ',
        description: 'ジューシーな牛肉ステーキ',
        cooking_time: 20,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'beef',
        meal_scene: 'special',
        difficulty: 'hard',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        ingredients: [
          { name: '牛肉', amount: '100g' }
        ],
        instructions: [
          '牛肉を焼く',
          '適度な焼き加減で完成'
        ]
      },
      {
        id: uuidv4(),
        title: '豚肉の生姜焼き',
        description: '生姜で臭みを消した豚肉料理',
        cooking_time: 25,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'pork',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        ingredients: [
          { name: '豚肉', amount: '90g' },
          { name: '生姜', amount: '適量' }
        ],
        instructions: [
          '豚肉を焼く',
          '生姜で味付け',
          '臭みを消して完成'
        ]
      },
      {
        id: uuidv4(),
        title: '鶏肉の照り焼き',
        description: '甘辛い照り焼きチキン',
        cooking_time: 20,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'chicken',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
        ingredients: [
          { name: '鶏肉', amount: '80g' },
          { name: '照り焼きソース', amount: '適量' }
        ],
        instructions: [
          '鶏肉を焼く',
          '照り焼きソースで味付け',
          '甘辛く仕上げる'
        ]
      },
      {
        id: uuidv4(),
        title: '馬肉の刺身',
        description: '新鮮な馬肉の刺身',
        cooking_time: 5,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'horse',
        meal_scene: 'special',
        difficulty: 'easy',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        ingredients: [
          { name: '新鮮な馬肉', amount: '60g' }
        ],
        instructions: [
          '馬肉を薄く切る',
          'そのまま盛り付ける'
        ]
      },
      {
        id: uuidv4(),
        title: '魚のムニエル',
        description: 'バター香る魚のムニエル',
        cooking_time: 15,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'fish',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        ingredients: [
          { name: '白身魚', amount: '85g' },
          { name: 'バター', amount: '適量' }
        ],
        instructions: [
          '魚に衣をつける',
          'バターで焼く',
          '香りよく仕上げる'
        ]
      },
      {
        id: uuidv4(),
        title: 'カンガルー肉のロースト',
        description: '低脂肪高タンパクなカンガルー肉のロースト',
        cooking_time: 45,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'kangaroo',
        meal_scene: 'special',
        difficulty: 'hard',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
        ingredients: [
          { name: 'カンガルー肉', amount: '100g' },
          { name: 'ハーブ', amount: '適量' }
        ],
        instructions: [
          'カンガルー肉をロースト',
          'ハーブで香り付け',
          '低脂肪で高タンパクに'
        ]
      },
      // 食事シーン別のテストデータ
      {
        id: uuidv4(),
        title: '日常のご飯',
        description: '毎日の基本となるご飯',
        cooking_time: 20,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'chicken',
        meal_scene: 'daily',
        difficulty: 'easy',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        ingredients: [
          { name: '鶏肉', amount: '80g' },
          { name: '野菜', amount: '50g' },
          { name: '白米', amount: '60g' }
        ],
        instructions: [
          '鶏肉を調理',
          '野菜を加える',
          '白米と一緒に盛り付ける'
        ]
      },
      {
        id: uuidv4(),
        title: 'おやつタイム',
        description: 'おやつとして与える軽食',
        cooking_time: 5,
        life_stage: 'adult',
        health_conditions: ['appetite'],
        protein_type: 'fish',
        meal_scene: 'snack',
        difficulty: 'easy',
        status: 'published',
        servings: '少量',
        thumbnail_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        ingredients: [
          { name: '魚肉', amount: '25g' }
        ],
        instructions: [
          '魚肉を細かく切る',
          'そのまま与える'
        ]
      },
      {
        id: uuidv4(),
        title: '特別な日のごちそう',
        description: '誕生日や記念日の特別料理',
        cooking_time: 60,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'beef',
        meal_scene: 'special',
        difficulty: 'hard',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
        ingredients: [
          { name: '高級牛肉', amount: '120g' },
          { name: '特別な野菜', amount: '60g' }
        ],
        instructions: [
          '牛肉を特別に調理',
          '野菜を美しく盛り付ける',
          '特別な日のごちそうに'
        ]
      },
      // 難易度別のテストデータ
      {
        id: uuidv4(),
        title: '簡単レシピ',
        description: '初心者でも作れる簡単レシピ',
        cooking_time: 10,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'chicken',
        meal_scene: 'daily',
        difficulty: 'easy',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        ingredients: [
          { name: '鶏肉', amount: '70g' }
        ],
        instructions: [
          '鶏肉を茹でる',
          '完成'
        ]
      },
      {
        id: uuidv4(),
        title: '普通のレシピ',
        description: '少し手間のかかる普通のレシピ',
        cooking_time: 30,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'pork',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        ingredients: [
          { name: '豚肉', amount: '85g' },
          { name: '野菜', amount: '45g' }
        ],
        instructions: [
          '豚肉を調理',
          '野菜を加える',
          '味付けして完成'
        ]
      },
      {
        id: uuidv4(),
        title: '難しいレシピ',
        description: '上級者向けの難しいレシピ',
        cooking_time: 90,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'beef',
        meal_scene: 'special',
        difficulty: 'hard',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
        ingredients: [
          { name: '高級牛肉', amount: '110g' },
          { name: '複雑な野菜', amount: '70g' },
          { name: '特別な調味料', amount: '適量' }
        ],
        instructions: [
          '牛肉を複雑に調理',
          '野菜を段階的に加える',
          '特別な調味料で仕上げる',
          '上級者向けの完成度で'
        ]
      },
      // 調理時間別のテストデータ
      {
        id: uuidv4(),
        title: '5分レシピ',
        description: '超時短5分レシピ',
        cooking_time: 5,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'chicken',
        meal_scene: 'daily',
        difficulty: 'easy',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        ingredients: [
          { name: '鶏肉', amount: '60g' }
        ],
        instructions: [
          '鶏肉を電子レンジで加熱',
          '完成'
        ]
      },
      {
        id: uuidv4(),
        title: '30分レシピ',
        description: '30分で完成するレシピ',
        cooking_time: 30,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'fish',
        meal_scene: 'daily',
        difficulty: 'medium',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        ingredients: [
          { name: '魚', amount: '80g' },
          { name: '野菜', amount: '50g' }
        ],
        instructions: [
          '魚を調理',
          '野菜を加える',
          '30分で完成'
        ]
      },
      {
        id: uuidv4(),
        title: '2時間レシピ',
        description: 'じっくり2時間かける本格レシピ',
        cooking_time: 120,
        life_stage: 'adult',
        health_conditions: ['balanced'],
        protein_type: 'beef',
        meal_scene: 'special',
        difficulty: 'hard',
        status: 'published',
        servings: '1食分',
        thumbnail_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
        ingredients: [
          { name: '牛肉', amount: '100g' },
          { name: '野菜', amount: '60g' },
          { name: '特別な調味料', amount: '適量' }
        ],
        instructions: [
          '牛肉を長時間煮込む',
          '野菜を段階的に加える',
          '2時間かけて本格的に仕上げる'
        ]
      }
    ];

    // 既存のテストデータを削除
    await supabase
      .from('recipes')
      .delete()
      .like('title', '子犬用%')
      .or('title.like.成犬用%,title.like.シニア用%,title.like.腎臓ケア%,title.like.心臓ケア%,title.like.肝臓ケア%,title.like.皮膚ケア%,title.like.お腹が弱い%,title.like.熱中症対策%,title.like.体重増加%,title.like.冷え対策%,title.like.嗜好性%,title.like.牛肉ステーキ%,title.like.豚肉の生姜焼き%,title.like.鶏肉の照り焼き%,title.like.馬肉の刺身%,title.like.魚のムニエル%,title.like.カンガルー肉のロースト%,title.like.日常のご飯%,title.like.おやつタイム%,title.like.特別な日のごちそう%,title.like.簡単レシピ%,title.like.普通のレシピ%,title.like.難しいレシピ%,title.like.5分レシピ%,title.like.30分レシピ%,title.like.2時間レシピ%');

    // テストデータを挿入
    const { data, error } = await supabase
      .from('recipes')
      .insert(testRecipes);

    if (error) {
      console.error('テストデータ挿入エラー:', error);
      return NextResponse.json({ error: 'テストデータの挿入に失敗しました', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'テストデータが正常に挿入されました',
      count: testRecipes.length 
    });

  } catch (error) {
    console.error('テストデータ作成エラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // テストデータを削除
    const { error } = await supabase
      .from('recipes')
      .delete()
      .like('title', '子犬用%')
      .or('title.like.成犬用%,title.like.シニア用%,title.like.腎臓ケア%,title.like.心臓ケア%,title.like.肝臓ケア%,title.like.皮膚ケア%,title.like.お腹が弱い%,title.like.熱中症対策%,title.like.体重増加%,title.like.冷え対策%,title.like.嗜好性%,title.like.牛肉ステーキ%,title.like.豚肉の生姜焼き%,title.like.鶏肉の照り焼き%,title.like.馬肉の刺身%,title.like.魚のムニエル%,title.like.カンガルー肉のロースト%,title.like.日常のご飯%,title.like.おやつタイム%,title.like.特別な日のごちそう%,title.like.簡単レシピ%,title.like.普通のレシピ%,title.like.難しいレシピ%,title.like.5分レシピ%,title.like.30分レシピ%,title.like.2時間レシピ%');

    if (error) {
      console.error('テストデータ削除エラー:', error);
      return NextResponse.json({ error: 'テストデータの削除に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ message: 'テストデータが削除されました' });

  } catch (error) {
    console.error('テストデータ削除エラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}