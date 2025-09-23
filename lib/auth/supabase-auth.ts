import { supabase, supabaseAdmin } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// ユーザー登録
export async function signUp({ email, password, name }: SignUpData) {
  try {
    // Supabase Authでユーザー登録
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (authData.user && supabaseAdmin) {
      // usersテーブルにユーザー情報を保存
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          name: name
        });

      if (dbError) {
        console.error('ユーザー情報の保存に失敗:', dbError);
        // 認証は成功したが、データベース保存に失敗した場合の処理
      }
    }

    return {
      success: true,
      user: authData.user,
      message: '確認メールを送信しました。メール内のリンクをクリックしてアカウントを有効化してください。'
    };
  } catch (error) {
    console.error('サインアップエラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '登録に失敗しました'
    };
  }
}

// ユーザーログイン
export async function signIn({ email, password }: SignInData) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error('サインインエラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ログインに失敗しました'
    };
  }
}

// ユーザーログアウト
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('サインアウトエラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ログアウトに失敗しました'
    };
  }
}

// 現在のユーザーを取得
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(error.message);
    }

    return { success: true, user };
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ユーザー情報の取得に失敗しました'
    };
  }
}

// パスワードリセット
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'パスワードリセット用のメールを送信しました。'
    };
  } catch (error) {
    console.error('パスワードリセットエラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'パスワードリセットに失敗しました'
    };
  }
}

// ユーザー情報の更新
export async function updateUserProfile(updates: { name?: string }) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('認証が必要です');
    }

    // Supabase Authのユーザーメタデータを更新
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        name: updates.name
      }
    });

    if (updateError) {
      throw new Error(updateError.message);
    }

    // usersテーブルの情報も更新
    const { error: dbError } = await supabase
      .from('users')
      .update({
        name: updates.name,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (dbError) {
      console.error('データベース更新エラー:', dbError);
    }

    return { success: true };
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'プロフィールの更新に失敗しました'
    };
  }
}

// セッションの監視
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
}


