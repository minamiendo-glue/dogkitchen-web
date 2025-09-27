import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface DogProfile {
  id: string;
  name: string;
  weight: number;
  activityLevel: 'low' | 'medium' | 'high';
  healthConditions?: string[];
  lifeStage: 'puppy' | 'adult' | 'senior';
  breed: string;
}

export async function POST(request: NextRequest) {
  try {
    // セッション確認
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // リクエストボディの取得
    const body = await request.json();
    const {
      id,
      name,
      weight,
      activityLevel,
      healthConditions,
      lifeStage,
      breed
    }: DogProfile = body;

    // バリデーション
    if (!name || !weight || !activityLevel || !lifeStage || !breed) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    if (weight <= 0 || weight > 100) {
      return NextResponse.json(
        { error: '体重は0.1kg以上100kg以下で入力してください' },
        { status: 400 }
      );
    }

    if (!['low', 'medium', 'high'].includes(activityLevel)) {
      return NextResponse.json(
        { error: '活動量の値が無効です' },
        { status: 400 }
      );
    }

    if (!['puppy', 'adult', 'senior'].includes(lifeStage)) {
      return NextResponse.json(
        { error: 'ライフステージの値が無効です' },
        { status: 400 }
      );
    }

    // プロフィールの存在確認と所有者確認
    const { data: existingProfile, error: fetchError } = await supabase
      .from('dog_profiles')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();
    
    if (fetchError || !existingProfile) {
      return NextResponse.json(
        { error: 'プロフィールが見つからないか、更新権限がありません' },
        { status: 404 }
      );
    }

    // プロフィールを更新
    const { data: updatedProfile, error: updateError } = await supabase
      .from('dog_profiles')
      .update({
        name,
        weight,
        activity_level: activityLevel,
        health_conditions: healthConditions || [],
        life_stage: lifeStage,
        breed
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (updateError) {
      console.error('プロフィール更新エラー:', updateError);
      return NextResponse.json(
        { error: 'プロフィールの更新に失敗しました' },
        { status: 500 }
      );
    }

    console.log(`Updated dog profile for user ${session.user?.email}:`, updatedProfile);

    return NextResponse.json(
      { 
        message: 'プロフィールが正常に更新されました',
        profile: updatedProfile
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// プロフィール取得用のGETエンドポイント
export async function GET(request: NextRequest) {
  try {
    // セッション確認
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // ユーザーの愛犬プロフィールを取得
    const { data: userProfiles, error: fetchError } = await supabase
      .from('dog_profiles')
      .select('*')
      .eq('user_id', session.user.id);

    if (fetchError) {
      console.error('プロフィール取得エラー:', fetchError);
      return NextResponse.json(
        { error: 'プロフィールの取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { profiles: userProfiles || [] },
      { status: 200 }
    );

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

