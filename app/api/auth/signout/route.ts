import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/lib/auth/supabase-auth';

export async function POST(request: NextRequest) {
  try {
    // Supabaseでログアウト
    const result = await signOut();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'ログアウトしました'
    });

  } catch (error) {
    console.error('サインアウトエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}


