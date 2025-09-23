'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/supabase-provider';
import { useButtonLoading, getErrorMessage, buttonStyles, LoadingSpinner, useDebounce } from '@/lib/utils/button-optimization';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { isLoading, executeWithLoading } = useButtonLoading();
  const { signIn } = useAuth();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    await executeWithLoading(async () => {
      try {
        const result = await signIn(email, password);

        if (!result.success) {
          setError(result.error || 'ログインに失敗しました');
        } else {
          router.push('/');
        }
      } catch (error) {
        setError(getErrorMessage(error));
      }
    });
  }, [email, password, executeWithLoading, signIn, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐕</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                DOG KITCHEN
              </h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-red-500 font-medium transition-colors duration-200">レシピ</Link>
              <Link href="/about" className="text-gray-700 hover:text-red-500 font-medium transition-colors duration-200">DOG KITCHENとは</Link>
              <Link href="/premium" className="text-gray-700 hover:text-red-500 font-medium transition-colors duration-200">プレミアム</Link>
              <Link href="/login" className="text-red-500 font-medium transition-colors duration-200">ログイン</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            アカウントをお持ちでない方は{' '}
            <Link href="/register" className="font-medium text-red-600 hover:text-red-500">
              新規登録
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="your@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="パスワード"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  ログイン状態を保持する
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-red-600 hover:text-red-500">
                  パスワードを忘れた方
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center gap-2 ${buttonStyles.base} ${buttonStyles.primary} ${buttonStyles.sizes.md}`}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    ログイン中...
                  </>
                ) : (
                  'ログイン'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">テストアカウント</span>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600 mb-2">テスト用のログイン情報：</p>
              <p className="text-sm text-gray-800">メールアドレス: test@example.com</p>
              <p className="text-sm text-gray-800">パスワード: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




