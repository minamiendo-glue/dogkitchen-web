import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
// import { mockDogProfiles } from '@/lib/data/mock-dog-profiles'; // Supabaseに移行

export async function DELETE(request: NextRequest) {
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
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // リクエストボディの取得
    const body = await request.json();
    const { id } = body;

    // バリデーション
    if (!id) {
      return NextResponse.json(
        { error: 'プロフィールIDが必要です' },
        { status: 400 }
      );
    }

    // プロフィールの存在確認と所有者確認
    const profileIndex = mockDogProfiles.findIndex(
      profile => profile.id === id && profile.userId === session.user?.email
    );

    if (profileIndex === -1) {
      return NextResponse.json(
        { error: 'プロフィールが見つからないか、削除権限がありません' },
        { status: 404 }
      );
    }

    // プロフィールを削除
    mockDogProfiles.splice(profileIndex, 1);

    return NextResponse.json(
      { message: '愛犬プロフィールが正常に削除されました' },
      { status: 200 }
    );

  } catch (error) {
    console.error('プロフィール削除エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
