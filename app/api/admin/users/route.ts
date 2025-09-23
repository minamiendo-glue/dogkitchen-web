import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // Supabaseからユーザー一覧を取得
    // auth.usersテーブルからユーザー情報を取得
    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();

    if (fetchError) {
      console.error('Supabase users fetch error:', fetchError);
      return NextResponse.json(
        { error: 'ユーザーの取得に失敗しました' },
        { status: 500 }
      );
    }

    // ユーザー情報を整形
    const formattedUsers = users?.users?.map(user => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.user_metadata?.full_name,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_sign_in_at: user.last_sign_in_at,
      is_active: user.email_confirmed_at !== null,
      role: user.user_metadata?.role || 'user'
    })) || [];
    
    return NextResponse.json({
      success: true,
      users: formattedUsers
    });
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    return NextResponse.json(
      { error: 'ユーザーの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password, name, role = 'user' } = body;

    // バリデーション
    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードは必須です' },
        { status: 400 }
      );
    }

    // 新しいユーザーを作成
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        role
      },
      email_confirm: true // メール確認をスキップ
    });

    if (createError) {
      console.error('Supabase user creation error:', createError);
      return NextResponse.json(
        { error: 'ユーザーの作成に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        name: newUser.user.user_metadata?.name,
        role: newUser.user.user_metadata?.role || 'user',
        created_at: newUser.user.created_at,
        is_active: true
      },
      message: 'ユーザーが正常に作成されました'
    });

  } catch (error) {
    console.error('ユーザー作成エラー:', error);
    return NextResponse.json(
      { error: 'ユーザーの作成に失敗しました' },
      { status: 500 }
    );
  }
}
