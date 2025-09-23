'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Article } from '@/types/blog';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/articles/${slug}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '記事の取得に失敗しました');
      }
      
      setArticle(data.article);
    } catch (err) {
      console.error('Error fetching article:', err);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="blog" />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="blog" />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">📝</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || '記事が見つかりません'}
            </h1>
            <p className="text-gray-600 mb-6">
              {error?.includes('テーブル') ? 
                '記事機能のセットアップが必要です。' : 
                'お探しの記事は存在しないか、削除された可能性があります。'
              }
            </p>
            
            {/* データベースセットアップが必要な場合の案内 */}
            {error?.includes('テーブル') && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  データベースセットアップが必要です
                </h3>
                <p className="text-yellow-700 mb-4">
                  記事機能を使用するには、まずデータベースにテーブルを作成する必要があります。
                </p>
                <div className="space-y-2 text-sm text-yellow-700">
                  <p><strong>手順:</strong></p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>管理画面にログイン</li>
                    <li>「記事管理」ページに移動</li>
                    <li>「データベースセットアップ」を実行</li>
                    <li>または、SupabaseのSQL Editorで <code className="bg-yellow-100 px-1 rounded">sql/create_blog_tables.sql</code> を実行</li>
                  </ol>
                </div>
              </div>
            )}
            
            <div className="mt-6 space-x-4">
              <Link
                href="/blog/articles"
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
              >
                記事一覧に戻る
              </Link>
              {error?.includes('テーブル') && (
                <Link
                  href="/admin/blog/articles"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                >
                  管理画面へ
                </Link>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="blog" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずリスト */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-red-500 transition-colors duration-200">
                ホーム
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/blog/articles" className="hover:text-red-500 transition-colors duration-200">
                記事
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900">{article.title}</span>
            </li>
          </ol>
        </nav>

        {/* 記事ヘッダー */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* アイキャッチ画像 */}
          {article.featured_image_url && (
            <div className="aspect-video bg-gray-200 relative overflow-hidden">
              <img
                src={article.featured_image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* タイトル */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* メタ情報 */}
            <div className="flex items-center justify-between text-base text-gray-600 mb-8">
              <div className="flex items-center space-x-6">
                <time dateTime={article.published_at || article.created_at}>
                  {formatDate(article.published_at || article.created_at)}
                </time>
                {article.updated_at !== article.created_at && (
                  <span className="text-sm">
                    更新: {formatDate(article.updated_at)}
                  </span>
                )}
              </div>
            </div>

            {/* 抜粋 */}
            {article.excerpt && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
                <p className="text-gray-800 text-xl leading-relaxed font-medium">
                  {article.excerpt}
                </p>
              </div>
            )}

            {/* 記事内容 */}
            <div className="prose prose-xl max-w-none">
              <div 
                className="text-gray-900 leading-relaxed text-lg whitespace-pre-wrap"
                style={{
                  lineHeight: '1.8',
                  fontSize: '1.125rem'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: article.content
                    .replace(/\n\n/g, '</p><p class="mb-6">')
                    .replace(/\n/g, '<br>')
                    .replace(/^/, '<p class="mb-6">')
                    .replace(/$/, '</p>')
                }}
              />
            </div>

            {/* 関連レシピ */}
            {article.recipes && article.recipes.length > 0 && (
              <div className="mt-16 pt-8 border-t-2 border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                  <svg className="w-8 h-8 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  関連レシピ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {article.recipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      href={`/recipes/${recipe.id}`}
                      className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-red-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {recipe.thumbnail_url && (
                        <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                          <img
                            src={recipe.thumbnail_url}
                            alt={recipe.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-red-600 transition-colors duration-200">
                        {recipe.title}
                      </h3>
                      {recipe.description && (
                        <p className="text-gray-600 leading-relaxed line-clamp-3">
                          {recipe.description}
                        </p>
                      )}
                      <div className="mt-4 flex items-center text-red-500 font-medium">
                        <span>レシピを見る</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* ナビゲーション */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/blog/articles"
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
          >
            記事一覧に戻る
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
