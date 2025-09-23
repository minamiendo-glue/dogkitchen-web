import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
// import { mockDogProfiles, DogProfile } from '@/lib/data/mock-dog-profiles'; // Supabaseに移行

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

    // プロフィールの更新
    const existingProfileIndex = mockDogProfiles.findIndex(profile => profile.id === id);
    
    if (existingProfileIndex === -1) {
      return NextResponse.json(
        { error: 'プロフィールが見つかりません' },
        { status: 404 }
      );
    }

    // プロフィールを更新（既存のuserIdとcreatedAtを保持）
    const existingProfile = mockDogProfiles[existingProfileIndex];
    mockDogProfiles[existingProfileIndex] = {
      id,
      userId: existingProfile.userId,
      name,
      weight,
      activityLevel,
      healthConditions: healthConditions || [],
      lifeStage,
      breed,
      createdAt: existingProfile.createdAt
    };

    console.log(`Updated dog profile for user ${session.user?.email}:`, mockDogProfiles[existingProfileIndex]);

    return NextResponse.json(
      { 
        message: 'プロフィールが正常に更新されました',
        profile: mockDogProfiles[existingProfileIndex]
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
    const userProfiles = mockDogProfiles; // 実際の実装ではユーザーIDでフィルタリング

    return NextResponse.json(
      { profiles: userProfiles },
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

