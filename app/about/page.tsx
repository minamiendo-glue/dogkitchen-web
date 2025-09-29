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
              
              {/* Instagram投稿の埋め込みブロック */}
              <div className="space-y-4">
                {/* Instagram投稿の埋め込み */}
                <div className="w-full max-w-sm mx-auto">
                  <blockquote 
                    className="instagram-media" 
                    data-instgrm-permalink="https://www.instagram.com/paw._._.spoon/"
                    data-instgrm-version="14"
                    style={{
                      background: '#FFF',
                      border: '0',
                      borderRadius: '3px',
                      boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                      margin: '1px',
                      maxWidth: '540px',
                      minWidth: '280px',
                      padding: '0',
                      width: '100%'
                    }}
                  >
                    <div style={{ padding: '16px' }}>
                      <a 
                        href="https://www.instagram.com/paw._._.spoon/" 
                        style={{
                          background: '#FFFFFF',
                          lineHeight: 0,
                          padding: '0 0',
                          textAlign: 'center',
                          textDecoration: 'none',
                          width: '100%'
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <div style={{
                            backgroundColor: '#F4F4F4',
                            borderRadius: '50%',
                            flexGrow: 0,
                            height: '40px',
                            marginRight: '14px',
                            width: '40px'
                          }}></div>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            justifyContent: 'center'
                          }}>
                            <div style={{
                              backgroundColor: '#F4F4F4',
                              borderRadius: '4px',
                              flexGrow: 0,
                              height: '14px',
                              marginBottom: '6px',
                              width: '100px'
                            }}></div>
                            <div style={{
                              backgroundColor: '#F4F4F4',
                              borderRadius: '4px',
                              flexGrow: 0,
                              height: '14px',
                              width: '60px'
                            }}></div>
                          </div>
                        </div>
                        <div style={{ padding: '19% 0' }}></div>
                        <div style={{
                          display: 'block',
                          height: '50px',
                          margin: '0 auto 12px',
                          width: '50px'
                        }}>
                          <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink">
                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                              <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                                <g>
                                  <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </div>
                        <div style={{ paddingTop: '8px' }}>
                          <div style={{
                            color: '#3897f0',
                            fontFamily: 'Arial,sans-serif',
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: '550',
                            lineHeight: '18px'
                          }}>
                            paw._._.spoon (@paw._._.spoon) • Instagram photos and videos
                          </div>
                        </div>
                        <div style={{ padding: '12.5% 0' }}></div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'row',
                          marginBottom: '14px',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{
                              backgroundColor: '#F4F4F4',
                              borderRadius: '50%',
                              height: '12.5px',
                              width: '12.5px',
                              transform: 'translateX(0px) translateY(7px)'
                            }}></div>
                            <div style={{
                              backgroundColor: '#F4F4F4',
                              height: '12.5px',
                              transform: 'rotate(-45deg) translateX(3px) translateY(1px)',
                              width: '12.5px',
                              flexGrow: 0,
                              marginRight: '14px',
                              marginLeft: '2px'
                            }}></div>
                            <div style={{
                              backgroundColor: '#F4F4F4',
                              borderRadius: '50%',
                              height: '12.5px',
                              width: '12.5px',
                              transform: 'translateX(9px) translateY(-18px)'
                            }}></div>
                          </div>
                          <div style={{
                            marginLeft: '8px'
                          }}>
                            <div style={{
                              backgroundColor: '#F4F4F4',
                              borderRadius: '50%',
                              flexGrow: 0,
                              height: '20px',
                              width: '20px'
                            }}></div>
                            <div style={{
                              width: '0',
                              height: '0',
                              borderTop: '2px solid transparent',
                              borderLeft: '6px solid #f4f4f4',
                              borderBottom: '2px solid transparent',
                              transform: 'translateX(16px) translateY(-4px) rotate(30deg)'
                            }}></div>
                          </div>
                          <div style={{
                            marginLeft: 'auto'
                          }}>
                            <div style={{
                              width: '0px',
                              borderTop: '8px solid #F4F4F4',
                              borderRight: '8px solid transparent',
                              transform: 'translateY(16px)'
                            }}></div>
                            <div style={{
                              backgroundColor: '#F4F4F4',
                              flexGrow: 0,
                              height: '12px',
                              width: '16px',
                              transform: 'translateY(-4px)'
                            }}></div>
                            <div style={{
                              width: '0',
                              height: '0',
                              borderTop: '8px solid #F4F4F4',
                              borderLeft: '8px solid transparent',
                              transform: 'translateY(-4px) translateX(8px)'
                            }}></div>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          flexGrow: 1,
                          justifyContent: 'center'
                        }}>
                          <div style={{
                            backgroundColor: '#F4F4F4',
                            borderRadius: '4px',
                            flexGrow: 0,
                            height: '14px',
                            marginBottom: '6px',
                            width: '224px'
                          }}></div>
                          <div style={{
                            backgroundColor: '#F4F4F4',
                            borderRadius: '4px',
                            flexGrow: 0,
                            height: '14px',
                            width: '144px'
                          }}></div>
                        </div>
                      </a>
                      <p style={{
                        color: '#c9c8cd',
                        fontFamily: 'Arial,sans-serif',
                        fontSize: '14px',
                        lineHeight: '17px',
                        marginBottom: '0',
                        marginTop: '8px',
                        overflow: 'hidden',
                        padding: '8px 0 7px',
                        textAlign: 'center',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        <a href="https://www.instagram.com/paw._._.spoon/" style={{
                          color: '#c9c8cd',
                          fontFamily: 'Arial,sans-serif',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 'normal',
                          lineHeight: '17px',
                          textDecoration: 'none'
                        }} target="_blank" rel="noopener noreferrer">
                          paw._._.spoon (@paw._._.spoon) • Instagram photos and videos
                        </a>
                      </p>
                    </div>
                  </blockquote>
                </div>

                {/* フォローリンク */}
                <div className="text-center">
                  <a 
                    href="https://www.instagram.com/paw._._.spoon/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagramでフォロー
                  </a>
                </div>
              </div>
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
