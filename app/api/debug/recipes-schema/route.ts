import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase client is not available' },
        { status: 500 }
      );
    }

    // テーブル構造を確認（直接クエリで確認）
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('recipes')
      .select('*')
      .limit(0); // データは取得せず、構造のみ確認

    // サンプルレシピを1件取得して構造を確認
    const { data: sampleRecipe, error: sampleError } = await supabaseAdmin
      .from('recipes')
      .select('*')
      .limit(1)
      .single();

    return NextResponse.json({
      success: true,
      tableAccessible: !tableError,
      tableError: tableError?.message || null,
      sampleRecipe: sampleRecipe,
      sampleError: sampleError?.message || null,
      hasNutritionInfo: sampleRecipe && 'nutrition_info' in sampleRecipe
    });

  } catch (error) {
    console.error('Schema debug error:', error);
    return NextResponse.json(
      { 
        error: 'スキーマデバッグエラー',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
