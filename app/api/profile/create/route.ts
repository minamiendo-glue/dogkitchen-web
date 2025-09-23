import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // リクエストボディの取得
    const body = await request.json();
    const { name, weight, activityLevel, healthConditions, lifeStage, breed, userId } = body;

    // バリデーション
    if (!name || !weight || !activityLevel || !lifeStage || !breed || !userId) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    if (weight <= 0) {
      return NextResponse.json(
        { error: '体重は正の値である必要があります' },
        { status: 400 }
      );
    }

    // 新しいプロフィールを作成
    const profileData = {
      user_id: userId,
      name,
      weight: parseFloat(weight),
      activity_level: activityLevel,
      health_conditions: healthConditions || [],
      life_stage: lifeStage,
      breed
    };

    // Supabaseにプロフィールを保存
    const { data: newProfile, error: insertError } = await supabaseAdmin
      .from('dog_profiles')
      .insert(profileData)
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { error: 'プロフィールの保存に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: '愛犬プロフィールが正常に作成されました',
        profile: newProfile
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('プロフィール作成エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// プロフィール一覧取得（マイページで使用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      );
    }

    // Supabaseからユーザーのプロフィールを取得
    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from('dog_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return NextResponse.json(
        { error: 'プロフィールの取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profiles: profiles || [] });

  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
