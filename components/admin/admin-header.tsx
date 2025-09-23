'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminHeader() {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/admin',
      label: 'ダッシュボード',
      icon: '📊',
      description: '管理画面の概要'
    },
    {
      href: '/admin/recipes',
      label: 'レシピ管理',
      icon: '🍽️',
      description: 'レシピの一覧・編集'
    },
    {
      href: '/admin/recipes/create',
      label: 'レシピ追加',
      icon: '➕',
      description: '新しいレシピを作成'
    },
    {
      href: '/admin/blog/articles',
      label: '記事管理',
      icon: '📝',
      description: '記事の管理'
    },
    {
      href: '/admin/blog/features',
      label: '特集管理',
      icon: '✨',
      description: '特集の管理'
    },
    {
      href: '/admin/users',
      label: 'ユーザー管理',
      icon: '👥',
      description: 'ユーザー情報の管理'
    },
    {
      href: '/admin/settings',
      label: '設定',
      icon: '⚙️',
      description: 'システム設定'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ・タイトル */}
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🐕</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DOG KITCHEN</h1>
                <p className="text-sm text-gray-500">管理画面</p>
              </div>
            </Link>
          </div>

          {/* ナビゲーション - 常に表示 */}
          <nav className="flex items-center space-x-1 overflow-x-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative group px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  isActive(item.href)
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                
                {/* ツールチップ */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  {item.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </Link>
            ))}
          </nav>

          {/* 右側のボタン群 */}
          <div className="flex items-center space-x-3">
            {/* サイトに戻るボタン */}
            <Link
              href="/"
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <span className="text-lg">🏠</span>
              <span className="font-medium text-sm">サイトに戻る</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
