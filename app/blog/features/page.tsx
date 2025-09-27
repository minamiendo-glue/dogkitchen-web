"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Feature } from '@/types/blog';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/blog/features');
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.needsSetup) {
          setError('記事機能がまだセットアップされていません。');
          return;
        }
        throw new Error(errorData.error || '特集の取得に失敗しました');
      }

      const data = await response.json();
      setFeatures(data.features || []);
    } catch (err) {
      console.error('Error fetching features:', err);
      setError(err instanceof Error ? err.message : '特集の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
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
      <>
        <Header currentPage="features" />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header currentPage="features" />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h2 className="text-xl font-semibold text-red-800 mb-2">エラーが発生しました</h2>
              <p className="text-red-600 mb-4">{error}</p>
              {error.includes('セットアップ') && (
                <div className="text-sm text-red-500">
                  <p>管理者に記事機能のセットアップを依頼してください。</p>
                </div>
              )}
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                ホームに戻る
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header currentPage="features" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white mb-8">
            <h1 className="text-4xl font-bold mb-4">特集</h1>
            <p className="text-xl opacity-90">
              厳選されたレシピの組み合わせで、特別な料理体験をお楽しみください
            </p>
          </div>

          {features.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">特集がありません</h2>
              <p className="text-gray-600">現在公開されている特集はありません。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Link
                  key={feature.id}
                  href={`/blog/features/${feature.slug}`}
                  className="group block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                >
                  {feature.featured_image_url && (
                    <div className="aspect-video w-full">
                      <img
                        src={feature.featured_image_url}
                        alt={feature.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        特集
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                      {feature.title}
                    </h2>
                    
                    {feature.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {feature.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{feature.published_at ? formatDate(feature.published_at) : '未公開'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 戻るボタン */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}