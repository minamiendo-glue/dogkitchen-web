import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/auth/supabase-auth';
import { handleApiError, validateRequiredFields, validateEmail } from '@/lib/utils/error-handler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // バリデーション
    validateRequiredFields(body, ['email', 'password']);

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      );
    }

    // Supabaseでログイン
    const result = await signIn({ email, password });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'ログインに成功しました',
      user: result.user,
      session: result.session
    });

  } catch (error) {
    return handleApiError(error);
  }
}


