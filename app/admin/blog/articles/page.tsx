'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/types/blog';
import { useAdminAuth } from '@/contexts/admin-auth-context';

export default function BlogArticlesPage() {
  const { isAuthenticated } = useAdminAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const response = await fetch('/api/admin/blog/articles', {
        headers
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '記事の取得に失敗しました');
      }
      
      setArticles(data.articles || []);
      console.log('取得した記事データ:', data.articles);
      
      // データベースセットアップが必要な場合のメッセージ
      if (data.needsSetup) {
        console.warn(data.message);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : '記事の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string | undefined) => {
    // statusが未定義の場合は公開中として扱う
    const articleStatus = status || 'published';
    
    switch (articleStatus) {
      case 'published':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            公開中
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            下書き
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            アーカイブ
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {articleStatus}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">記事管理</h1>
          <p className="mt-2 text-gray-600">
            記事の作成・編集・公開管理
          </p>
        </div>
        
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">記事管理</h1>
          <p className="mt-2 text-gray-600">
            記事の作成・編集・公開管理
          </p>
        </div>
        
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          
          {/* データベースセットアップが必要な場合の案内 */}
          {error.includes('テーブル') || error.includes('relation') ? (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                データベースセットアップが必要です
              </h3>
              <p className="text-yellow-700 mb-4">
                記事機能を使用するには、まずデータベースにテーブルを作成する必要があります。
              </p>
              <div className="space-y-2 text-sm text-yellow-700">
                <p><strong>手順:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Supabaseのダッシュボードにログイン</li>
                  <li>SQL Editorを開く</li>
                  <li>プロジェクト内の <code className="bg-yellow-100 px-1 rounded">sql/create_blog_tables.sql</code> の内容を実行</li>
                  <li>テーブル作成後、ページを再読み込み</li>
                </ol>
              </div>
            </div>
          ) : (
            <button
              onClick={fetchArticles}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              再試行
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">記事管理</h1>
          <p className="mt-2 text-gray-600">
            記事の作成・編集・公開管理
          </p>
        </div>
        
        <Link
          href="/admin/blog/articles/create"
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
        >
          新しい記事を作成
        </Link>
      </div>

      {/* 記事一覧 */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            記事がまだありません
          </h3>
          <p className="text-gray-500 mb-6">
            最初の記事を作成しましょう
          </p>
          <Link
            href="/admin/blog/articles/create"
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
          >
            記事を作成する
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              記事一覧 ({articles.length}件)
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タイトル
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    公開日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作成日
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article) => {
                  console.log('記事データ:', article); // デバッグ用
                  console.log('記事のslug:', article.slug); // デバッグ用
                  console.log('記事のstatus:', article.status); // デバッグ用
                  console.log('編集ボタンのURL:', `/admin/blog/articles/${article.slug}/edit`); // デバッグ用
                  return (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {article.featured_image_url && (
                            <div className="flex-shrink-0 h-12 w-12 mr-4">
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={article.featured_image_url}
                                alt={article.title}
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {article.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {article.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {article.published_at ? formatDate(article.published_at) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(article.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-3">
                          {/* 編集ボタン - 必ず表示 */}
                          <button
                            onClick={() => {
                              console.log('編集ボタンがクリックされました:', article.slug);
                              window.location.href = `/admin/blog/articles/${article.slug}/edit`;
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            style={{ 
                              display: 'inline-flex !important',
                              visibility: 'visible !important',
                              opacity: '1 !important',
                              minWidth: '80px',
                              minHeight: '36px'
                            }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            編集
                          </button>
                          {/* 表示ボタン */}
                          <button
                            onClick={() => {
                              window.open(`/blog/articles/${article.slug}`, '_blank');
                            }}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            表示
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* データベースセットアップ */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">データベース管理</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">記事テーブル確認</h4>
                <p className="text-sm text-gray-500">記事関連のテーブルが正しく作成されているか確認します</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/admin/blog/check-tables', {
                      headers: getAuthHeaders()
                    });
                    const result = await response.json();
                    alert(JSON.stringify(result, null, 2));
                  } catch (error) {
                    alert('エラーが発生しました: ' + error);
                  }
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
              >
                テーブル確認
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">データベースセットアップ</h4>
                <p className="text-sm text-gray-500">記事関連のテーブルとポリシーを作成します</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/admin/blog/setup-database', {
                      method: 'POST',
                      headers: getAuthHeaders()
                    });
                    const result = await response.json();
                    alert(JSON.stringify(result, null, 2));
                  } catch (error) {
                    alert('エラーが発生しました: ' + error);
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
              >
                セットアップ実行
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
