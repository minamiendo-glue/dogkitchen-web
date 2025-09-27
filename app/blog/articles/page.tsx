'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BlogListItem } from '@/types/blog';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/blog/articles');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || '記事の取得に失敗しました');
        }
        
        setArticles(data.articles || []);
        
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

    fetchArticles();
  }, []);

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
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="blog" />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">⚠️</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="blog" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* 記事一覧 */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              記事がまだありません
            </h3>
            <p className="text-gray-500">
              新しい記事を準備中です。お楽しみに！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article 
                key={article.id}
                className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <Link href={`/blog/articles/${article.slug}`}>
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {article.featured_image_url ? (
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-orange-100">
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🐕</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-red-600 transition-colors duration-200 leading-tight">
                      {article.title}
                    </h2>
                    
                    {article.excerpt && (
                      <p className="text-gray-600 text-base mb-6 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <time dateTime={article.published_at || article.created_at} className="text-gray-500 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {formatDate(article.published_at || article.created_at)}
                      </time>
                      <span className="text-red-500 font-bold text-lg flex items-center group-hover:translate-x-1 transition-transform duration-200">
                        続きを読む
                        <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* ページネーション（将来の実装用） */}
        {articles.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              さらに多くの記事を準備中です
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

