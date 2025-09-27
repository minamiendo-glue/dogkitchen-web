import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    // レシピの画像URLを更新
    const imageUpdates = [
      // サーモン系のレシピ
      { condition: "title ILIKE '%サーモン%' OR protein_type = 'fish'", 
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center' },
      
      // チキン系のレシピ
      { condition: "title ILIKE '%チキン%' OR title ILIKE '%鶏%' OR protein_type = 'chicken'", 
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&crop=center' },
      
      // 牛肉系のレシピ
      { condition: "title ILIKE '%牛肉%' OR title ILIKE '%牛%' OR protein_type = 'beef'", 
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop&crop=center' },
      
      // 豚肉系のレシピ
      { condition: "title ILIKE '%豚肉%' OR title ILIKE '%豚%' OR protein_type = 'pork'", 
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center' },
      
      // 馬肉系のレシピ
      { condition: "title ILIKE '%馬肉%' OR title ILIKE '%馬%' OR protein_type = 'horse'", 
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&crop=center' },
      
      // ラム系のレシピ
      { condition: "title ILIKE '%ラム%' OR protein_type = 'lamb'", 
        image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center' },
      
      // カンガルー系のレシピ
      { condition: "title ILIKE '%カンガルー%' OR protein_type = 'kangaroo'", 
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&crop=center' },
      
      // アジ・イワシ系のレシピ
      { condition: "title ILIKE '%アジ%' OR title ILIKE '%イワシ%' OR protein_type = 'sardine'", 
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center' },
      
      // スープ系のレシピ
      { condition: "title ILIKE '%スープ%'", 
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&crop=center' },
      
      // おやつ系のレシピ
      { condition: "title ILIKE '%おやつ%' OR title ILIKE '%おかし%'", 
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center' }
    ];

    let totalUpdated = 0;

    // 各条件で画像URLを更新
    for (const update of imageUpdates) {
      const { data, error } = await supabase
        .from('recipes')
        .update({ thumbnail_url: update.image })
        .or(update.condition);

      if (error) {
        console.error(`画像更新エラー (${update.condition}):`, error);
        continue;
      }

      totalUpdated += (data as unknown as any[])?.length || 0;
    }

    // 残りのレシピにデフォルト画像を設定
    const { data: defaultUpdate, error: defaultError } = await supabase
      .from('recipes')
      .update({ 
        thumbnail_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=center'
      })
      .or('thumbnail_url.is.null,thumbnail_url.eq.,thumbnail_url.like.%example.com%');

    if (defaultError) {
      console.error('デフォルト画像更新エラー:', defaultError);
    } else {
      totalUpdated += (defaultUpdate as unknown as any[])?.length || 0;
    }

    // 更新されたレシピを取得して確認
    const { data: updatedRecipes, error: fetchError } = await supabase
      .from('recipes')
      .select('id, title, protein_type, thumbnail_url')
      .not('thumbnail_url', 'is', null)
      .not('thumbnail_url', 'eq', '')
      .order('created_at', { ascending: false })
      .limit(10);

    if (fetchError) {
      console.error('レシピ取得エラー:', fetchError);
    }

    return NextResponse.json({
      success: true,
      message: `${totalUpdated}件のレシピの画像URLを更新しました`,
      updatedRecipes: updatedRecipes || []
    });

  } catch (error) {
    console.error('画像更新処理エラー:', error);
    return NextResponse.json({
      success: false,
      error: '画像更新処理中にエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
