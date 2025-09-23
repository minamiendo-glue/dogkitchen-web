import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabaseAdmin
      .from('recipes')
      .select('*')
      .eq('status', 'published');

    // カテゴリー別のフィルタリング
    if (category) {
      // タンパク質カテゴリー
      if (['beef', 'chicken', 'pork', 'salmon', 'lamb', 'horse'].includes(category)) {
        query = query.eq('protein_type', category);
      }
      // 体のお悩みカテゴリー
      else if (['weak_stomach', 'diet', 'balanced', 'cold', 'appetite', 'summer_heat', 'heart_care', 'urinary_care', 'diabetes_care', 'kidney_care', 'joint_care', 'fighting_disease'].includes(category)) {
        query = query.contains('health_conditions', [category]);
      }
      // ライフステージカテゴリー
      else if (['puppy', 'junior', 'adult', 'senior', 'elderly'].includes(category)) {
        query = query.eq('life_stage', category);
      }
      // 利用シーンカテゴリー
      else if (category === 'daily') {
        // 日常ご飯は全レシピが対象
      } else if (category === 'snack') {
        query = query.eq('meal_scene', 'snack');
      } else if (category === 'shared') {
        query = query.eq('meal_scene', 'shared');
      } else if (category === 'quick') {
        query = query.lte('cooking_time', 15);
      } else if (category === 'special') {
        query = query.eq('meal_scene', 'special');
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recipes:', error);
      return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
    }

    return NextResponse.json({ recipes: data || [] });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
