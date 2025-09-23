import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
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

    // ユーザーを無効化（メール確認を無効にする）
    const { data: updatedUser, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      email_confirm: false
    });

    if (error) {
      console.error('Error deactivating user:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 無効化されたユーザー情報を整形
    const formattedUser = {
      id: updatedUser.user.id,
      email: updatedUser.user.email,
      name: updatedUser.user.user_metadata?.name || updatedUser.user.user_metadata?.full_name,
      created_at: updatedUser.user.created_at,
      updated_at: updatedUser.user.updated_at,
      last_sign_in_at: updatedUser.user.last_sign_in_at,
      is_active: false, // 無効化されたのでfalse
      role: updatedUser.user.user_metadata?.role || 'user',
      email_confirmed_at: updatedUser.user.email_confirmed_at,
      phone: updatedUser.user.phone,
      avatar_url: updatedUser.user.user_metadata?.avatar_url
    };

    return NextResponse.json({ 
      success: true, 
      user: formattedUser,
      message: 'ユーザーが無効化されました' 
    }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
