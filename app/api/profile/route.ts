import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
    const { data: profile, error } = await supabase
      .from('dog_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return NextResponse.json(
        { error: 'プロフィールの取得に失敗しました' },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json({
        profile: null,
        message: 'プロフィールが登録されていません'
      });
    }

    // プロフィールデータを整形
    const formattedProfile = {
      id: profile.id,
      name: profile.name,
      weight: profile.weight,
      lifeStage: profile.life_stage,
      activityLevel: profile.activity_level,
      healthConditions: profile.health_conditions || [],
      breed: profile.breed
    };

    return NextResponse.json({
      profile: formattedProfile
    });

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
