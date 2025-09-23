'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Supabaseクライアントが利用可能かチェック
    if (!supabase) {
      console.error('Supabase client is not available');
      setLoading(false);
      return;
    }

    // 初期セッションを取得
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Failed to get initial session:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // 認証状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client is not available' };
      }

      // メールアドレスの基本的な検証
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: '有効なメールアドレスを入力してください' };
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          },
          emailRedirectTo: undefined, // メール確認を無効化
          captchaToken: undefined // キャプチャを無効化
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        return { success: false, error: error.message };
      }

      if (data.user) {
        // usersテーブルにユーザー情報を保存（service role keyを使用してRLSをバイパス）
        try {
          const response = await fetch('/api/auth/register-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              name: name
            }),
          });

          if (!response.ok) {
            console.error('ユーザー情報の保存に失敗:', await response.text());
          }
        } catch (error) {
          console.error('ユーザー情報の保存に失敗:', error);
        }

        // 新規登録成功後、自動的にログイン状態にする
        if (data.session) {
          console.log('新規登録成功、自動ログイン完了');
          return { 
            success: true, 
            message: '登録が完了しました。自動的にログインします。',
            autoLogin: true
          };
        } else {
          console.log('新規登録成功、セッションなし');
          return { 
            success: true, 
            message: '登録が完了しました。ログインページでログインしてください。',
            autoLogin: false
          };
        }
      }

      return { 
        success: true, 
        message: '登録が完了しました。ログインページでログインしてください。' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '登録に失敗しました' 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client is not available' };
      }

      // 入力値の基本的な検証を追加
      if (!email || !password) {
        return { success: false, error: 'メールアドレスとパスワードを入力してください' };
      }

      // ログイン試行のタイムアウトを設定
      const loginPromise = supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('ログイン処理がタイムアウトしました')), 10000)
      );

      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Supabase login error:', error);
        
        // エラーメッセージを日本語に変換
        let errorMessage = error.message;
        if (error.message === 'Invalid login credentials') {
          errorMessage = 'メールアドレスまたはパスワードが正しくありません';
        } else if (error.message === 'Email not confirmed') {
          errorMessage = 'メールアドレスが確認されていません。新規登録後、しばらくお待ちください。';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'ログイン試行回数が多すぎます。しばらく時間をおいて再度お試しください。';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'ログイン処理がタイムアウトしました。再度お試しください。';
        }
        
        return { success: false, error: errorMessage };
      }

      console.log('ログイン成功:', data);
      return { success: true };
    } catch (error) {
      console.error('ログインエラー:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'ログインに失敗しました' 
      };
    }
  };

  const signOut = async () => {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase client is not available' };
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'ログアウトに失敗しました' 
      };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
