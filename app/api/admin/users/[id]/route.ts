import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ユーザーIDが指定されていません' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Supabase Adminクライアントが初期化されていません' }, { status: 500 });
    }

    // 特定のユーザーを取得
    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(id);

    if (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!user.user) {
      return NextResponse.json({ success: false, error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // ユーザー情報を整形
    const formattedUser = {
      id: user.user.id,
      email: user.user.email,
      name: user.user.user_metadata?.name || user.user.user_metadata?.full_name,
      created_at: user.user.created_at,
      updated_at: user.user.updated_at,
      last_sign_in_at: user.user.last_sign_in_at,
      is_active: user.user.email_confirmed_at !== null,
      role: user.user.user_metadata?.role || 'user',
      email_confirmed_at: user.user.email_confirmed_at,
      phone: user.user.phone,
      avatar_url: user.user.user_metadata?.avatar_url
    };

    return NextResponse.json({ success: true, user: formattedUser }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, role, is_active } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ユーザーIDが指定されていません' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Supabase Adminクライアントが初期化されていません' }, { status: 500 });
    }

    // ユーザー情報を更新
    const updateData: any = {
      user_metadata: {
        name,
        role
      }
    };

    // メールアドレスが変更された場合
    if (email) {
      updateData.email = email;
    }

    // アクティブ状態の更新
    if (is_active !== undefined) {
      updateData.email_confirm = is_active;
    }

    const { data: updatedUser, error } = await supabaseAdmin.auth.admin.updateUserById(id, updateData);

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 更新されたユーザー情報を整形
    const formattedUser = {
      id: updatedUser.user.id,
      email: updatedUser.user.email,
      name: updatedUser.user.user_metadata?.name || updatedUser.user.user_metadata?.full_name,
      created_at: updatedUser.user.created_at,
      updated_at: updatedUser.user.updated_at,
      last_sign_in_at: updatedUser.user.last_sign_in_at,
      is_active: updatedUser.user.email_confirmed_at !== null,
      role: updatedUser.user.user_metadata?.role || 'user',
      email_confirmed_at: updatedUser.user.email_confirmed_at,
      phone: updatedUser.user.phone,
      avatar_url: updatedUser.user.user_metadata?.avatar_url
    };

    return NextResponse.json({ success: true, user: formattedUser }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ユーザーIDが指定されていません' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Supabase Adminクライアントが初期化されていません' }, { status: 500 });
    }

    // ユーザーを削除
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'ユーザーが削除されました' }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
