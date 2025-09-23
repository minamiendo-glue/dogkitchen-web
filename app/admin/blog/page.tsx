'use client';

import Link from 'next/link';

export default function BlogManagementPage() {
  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">記事管理</h1>
        <p className="mt-2 text-gray-600">
          記事と特集の管理を行います
        </p>
      </div>

      {/* 管理メニュー */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 記事管理 */}
        <Link
          href="/admin/blog/articles"
          className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
              <span className="text-2xl">📝</span>
            </span>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-medium">
              <span className="absolute inset-0" aria-hidden="true" />
              記事管理
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              記事の作成、編集、削除を行います
            </p>
          </div>
          <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
          </span>
        </Link>

        {/* 特集管理 */}
        <Link
          href="/admin/blog/features"
          className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 ring-4 ring-white">
              <span className="text-2xl">⭐</span>
            </span>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-medium">
              <span className="absolute inset-0" aria-hidden="true" />
              特集管理
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              特集記事の作成、編集、削除を行います
            </p>
          </div>
          <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
          </span>
        </Link>

        {/* データベース設定 */}
        <Link
          href="/admin/blog/setup"
          className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
              <span className="text-2xl">⚙️</span>
            </span>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-medium">
              <span className="absolute inset-0" aria-hidden="true" />
              データベース設定
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              記事用テーブルの作成と設定を行います
            </p>
          </div>
          <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
          </span>
        </Link>
      </div>

      {/* クイックアクション */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">クイックアクション</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/blog/articles/create"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="mr-2">➕</span>
            新規記事作成
          </Link>
          <Link
            href="/admin/blog/features/create"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="mr-2">⭐</span>
            新規特集作成
          </Link>
          <Link
            href="/blog/articles"
            target="_blank"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="mr-2">👁️</span>
            記事を表示
          </Link>
          <Link
            href="/admin/blog/articles"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="mr-2">📊</span>
            記事一覧
          </Link>
        </div>
      </div>
    </div>
  );
}
