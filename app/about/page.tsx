"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VideoPlayer } from '@/components/video-player';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AboutPage() {
  const [aboutVideo, setAboutVideo] = useState({
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "DOG KITCHEN コンセプト動画"
  });

  useEffect(() => {
    async function getAboutVideoSettings() {
      try {
        const response = await fetch('/api/admin/settings', {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        
        const data = await response.json();
        setAboutVideo(data.settings?.aboutVideo || {
          src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          title: "DOG KITCHEN コンセプト動画"
        });
      } catch (error) {
        console.error('Error fetching about video settings:', error);
        setAboutVideo({
          src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          title: "DOG KITCHEN コンセプト動画"
        });
      }
    }

    getAboutVideoSettings();
  }, []);

  useEffect(() => {
    // Instagram埋め込みスクリプトの読み込み
    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // クリーンアップ
      const existingScript = document.querySelector('script[src="//www.instagram.com/embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header currentPage="about" />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ヒーローセクション */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            DOG KITCHENとは
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            愛犬の健康を第一に考えた、手作りご飯レシピプラットフォーム。
            専門知識に基づいた栄養バランスの取れたレシピで、愛犬の毎日をより豊かにします。
          </p>
        </section>

        {/* コンセプト動画 */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto">
            <VideoPlayer
              src={aboutVideo.src}
              title={aboutVideo.title}
              className="rounded-xl shadow-lg"
              aspectRatio="16:9"
            />
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">DOG KITCHENの特徴</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">専門知識に基づくレシピ</h3>
              <p className="text-gray-600 leading-relaxed">
                獣医師監修のもと、愛犬のライフステージや健康状態に合わせた栄養バランスの取れたレシピを提供します。
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">簡単フィルタリング</h3>
              <p className="text-gray-600 leading-relaxed">
                ライフステージ、体の悩み、調理時間、タンパク質の種類などで簡単にレシピを絞り込めます。
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">動画で分かりやすく</h3>
              <p className="text-gray-600 leading-relaxed">
                1:1の動画で調理手順を分かりやすく説明。初心者でも安心して手作りご飯にチャレンジできます。
              </p>
            </div>
          </div>
        </section>


        {/* プレミアム機能 */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">プレミアム機能</h2>
            <p className="text-xl mb-8 opacity-90">
              愛犬の個別情報に基づいた、栄養計算と分量調整
            </p>
            
            {/* 簡単3ステップ */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-8">簡単3ステップ</h3>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
                  <h4 className="text-lg font-semibold mb-4">愛犬の情報を入力</h4>
                  <p className="opacity-90 text-sm">
                    年齢、体重、健康状態などの基本情報を入力します。
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
                  <h4 className="text-lg font-semibold mb-4">レシピを検索・選択</h4>
                  <p className="opacity-90 text-sm">
                    フィルター機能を使って、愛犬にぴったりのレシピを見つけます。
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
                  <h4 className="text-lg font-semibold mb-4">動画を見ながら調理</h4>
                  <p className="opacity-90 text-sm">
                    動画ガイドに従って、美味しい手作りご飯を作ります。
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white bg-opacity-10 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">分量自動調整</h3>
                <p className="opacity-90">
                  各レシピの材料分量を愛犬の必要栄養素に合わせて自動調整します。
                </p>
              </div>
            </div>
            <div className="mt-8">
              <Link 
                href="/premium" 
                className="inline-block bg-white text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                プレミアム機能を詳しく見る
              </Link>
            </div>
          </div>
        </section>

        {/* SNS投稿 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">SNS</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Instagram投稿の埋め込み */}
            <div className="w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Instagram</h3>
              <a 
                href="https://www.instagram.com/paw._._.spoon/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block aspect-square bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="text-center text-white">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <p className="text-lg font-semibold">@paw._._.spoon</p>
                  <p className="text-sm opacity-90">Instagramでフォロー</p>
                </div>
              </a>
            </div>
            
            {/* YouTube動画の埋め込み */}
            <div className="w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">YouTube</h3>
              <div className="relative w-full max-w-md mx-auto aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/nWhWMqBFukY?si=ThzlLoKPqIaaoMZj"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
