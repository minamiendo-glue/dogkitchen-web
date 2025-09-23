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

    const { id, email, name } = await request.json();

    if (!id || !email || !name) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    // 既存のユーザーをチェック
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    // ユーザーが既に存在する場合は成功として返す
    if (existingUser) {
      console.log('ユーザーは既に存在します:', id);
      return NextResponse.json({ success: true, user: existingUser }, { status: 200 });
    }

    // service role keyを使用してRLSをバイパスしてユーザー情報を保存
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        id: id,
        email: email,
        name: name
      })
      .select()
      .single();

    if (error) {
      console.error('ユーザー情報の保存エラー:', error);
      return NextResponse.json(
        { error: 'ユーザー情報の保存に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: data }, { status: 201 });
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}


