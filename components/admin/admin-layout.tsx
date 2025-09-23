'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { AdminHeader } from './admin-header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { adminUser, logout, isAuthenticated } = useAdminAuth();
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  // 認証状態の変化を監視
  useEffect(() => {
    if (!isAuthenticated && adminUser === null) {
      setShowSessionExpired(true);
      // 3秒後にログイン画面にリダイレクト
      const timer = setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, adminUser, router]);

  // セッション期限切れ通知
  if (showSessionExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              セッション期限切れ
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              セキュリティのため、24時間後に自動的にログアウトされました。<br />
              再度ログインしてください。
            </p>
            <div className="text-xs text-gray-500">
              3秒後にログイン画面に移動します...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <AdminHeader />

      {/* ユーザー情報とログアウト */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{adminUser?.name}</span>
              <span className="text-gray-400 ml-1">({adminUser?.username})</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>

      {/* ページコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
