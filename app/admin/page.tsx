'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [r2TestResult, setR2TestResult] = useState<any>(null);
  const [isTestingR2, setIsTestingR2] = useState(false);
  const [streamTestResult, setStreamTestResult] = useState<any>(null);
  const [isTestingStream, setIsTestingStream] = useState(false);
  const [envCheckResult, setEnvCheckResult] = useState<any>(null);
  const [isCheckingEnv, setIsCheckingEnv] = useState(false);
  const [tokenInfoResult, setTokenInfoResult] = useState<any>(null);
  const [isCheckingToken, setIsCheckingToken] = useState(false);
  const [envDebugResult, setEnvDebugResult] = useState<any>(null);
  const [isDebuggingEnv, setIsDebuggingEnv] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // 統計データを取得
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        setStats(result.data);
      } else {
        console.error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const testR2Connection = async () => {
    setIsTestingR2(true);
    try {
      const response = await fetch('/api/test/r2-connection');
      const result = await response.json();
      setR2TestResult(result);
    } catch (error) {
      setR2TestResult({
        success: false,
        error: '接続テストに失敗しました'
      });
    } finally {
      setIsTestingR2(false);
    }
  };

  const testStreamConnection = async () => {
    setIsTestingStream(true);
    try {
      const response = await fetch('/api/test/stream-connection');
      const result = await response.json();
      setStreamTestResult(result);
    } catch (error) {
      setStreamTestResult({
        success: false,
        error: '接続テストに失敗しました'
      });
    } finally {
      setIsTestingStream(false);
    }
  };

  const checkEnvironment = async () => {
    setIsCheckingEnv(true);
    try {
      const response = await fetch('/api/test/env-check');
      const result = await response.json();
      setEnvCheckResult(result);
    } catch (error) {
      setEnvCheckResult({
        success: false,
        error: '環境変数チェックに失敗しました'
      });
    } finally {
      setIsCheckingEnv(false);
    }
  };

  const checkTokenInfo = async () => {
    setIsCheckingToken(true);
    try {
      const response = await fetch('/api/test/cloudflare-token-info');
      const result = await response.json();
      setTokenInfoResult(result);
    } catch (error) {
      setTokenInfoResult({
        success: false,
        error: 'トークン情報チェックに失敗しました'
      });
    } finally {
      setIsCheckingToken(false);
    }
  };

  const debugEnvironment = async () => {
    setIsDebuggingEnv(true);
    try {
      const response = await fetch('/api/test/env-debug');
      const result = await response.json();
      setEnvDebugResult(result);
    } catch (error) {
      setEnvDebugResult({
        success: false,
        error: '環境変数デバッグに失敗しました'
      });
    } finally {
      setIsDebuggingEnv(false);
    }
  };

  // 変更数の色を判定する関数
  const getChangeType = (change: string) => {
    const num = parseInt(change.replace(/[+\-]/g, ''));
    if (change.startsWith('+')) return 'increase';
    if (change.startsWith('-')) return 'decrease';
    return 'neutral';
  };

  // 統計データの構造を定義
  const statsData = stats ? [
    {
      name: '総レシピ数',
      value: stats.totalRecipes.toString(),
      change: stats.changes.totalRecipes,
      changeType: getChangeType(stats.changes.totalRecipes),
      icon: '🍽️'
    },
    {
      name: '今月の新規レシピ',
      value: stats.monthlyRecipes.toString(),
      change: stats.changes.monthlyRecipes,
      changeType: getChangeType(stats.changes.monthlyRecipes),
      icon: '➕'
    },
    {
      name: 'アクティブユーザー',
      value: stats.activeUsers.toString(),
      change: stats.changes.activeUsers,
      changeType: getChangeType(stats.changes.activeUsers),
      icon: '👥'
    },
    {
      name: 'プレミアム会員',
      value: stats.premiumUsers.toString(),
      change: stats.changes.premiumUsers,
      changeType: getChangeType(stats.changes.premiumUsers),
      icon: '💎'
    }
  ] : [];

  const recentRecipes = [
    {
      id: '1',
      title: 'チキンと野菜のヘルシーご飯',
      createdAt: '2024-01-15',
      status: '公開中',
      views: 234
    },
    {
      id: '2',
      title: '牛肉とさつまいものシチュー',
      createdAt: '2024-01-14',
      status: '公開中',
      views: 189
    },
    {
      id: '3',
      title: 'サーモンとブロッコリーのおやつ',
      createdAt: '2024-01-13',
      status: '下書き',
      views: 0
    }
  ];

  return (
    <div className="space-y-8">
        {/* ページヘッダー */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="mt-2 text-gray-600">
            DOG KITCHEN管理画面へようこそ
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoadingStats ? (
            // ローディング状態
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="animate-pulse">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            statsData.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase' 
                            ? 'text-green-600' 
                            : stat.changeType === 'decrease' 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))
          )}
        </div>

        {/* クイックアクション */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">クイックアクション</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/admin/recipes/create"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-red-50 text-red-600 ring-4 ring-white">
                    <span className="text-xl">➕</span>
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    新しいレシピを追加
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    愛犬のための新しいレシピを作成しましょう
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/admin/recipes"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                    <span className="text-xl">📝</span>
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    レシピを管理
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    既存のレシピを編集・削除・公開設定
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/admin/users"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
                    <span className="text-xl">👥</span>
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    ユーザー管理
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    ユーザーアカウントとプレミアム会員の管理
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/admin/blog/articles"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 ring-4 ring-white">
                    <span className="text-xl">📝</span>
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    記事管理
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    記事の作成・編集・公開管理
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/admin/blog/features"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-600 ring-4 ring-white">
                    <span className="text-xl">⭐</span>
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    特集管理
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    特集記事の作成・編集・公開管理
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/test-slug-validation"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-600 ring-4 ring-white">
                    <span className="text-xl">🧪</span>
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    スラッグ重複チェックテスト
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    スラッグの重複チェック機能をテストします
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* R2接続テスト */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">システム設定テスト</h3>
          </div>
          <div className="p-6">
            <div className="mb-4 space-x-4">
              <button
                onClick={testR2Connection}
                disabled={isTestingR2}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestingR2 ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    テスト中...
                  </>
                ) : (
                  'R2接続テスト'
                )}
              </button>
              
              <button
                onClick={testStreamConnection}
                disabled={isTestingStream}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestingStream ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    テスト中...
                  </>
                ) : (
                  'Stream API接続テスト'
                )}
              </button>
              
              <button
                onClick={checkEnvironment}
                disabled={isCheckingEnv}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingEnv ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    チェック中...
                  </>
                ) : (
                  '環境変数チェック'
                )}
              </button>
              
              <button
                onClick={checkTokenInfo}
                disabled={isCheckingToken}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingToken ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    チェック中...
                  </>
                ) : (
                  'トークン情報チェック'
                )}
              </button>
              
              <button
                onClick={debugEnvironment}
                disabled={isDebuggingEnv}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDebuggingEnv ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    デバッグ中...
                  </>
                ) : (
                  '環境変数デバッグ'
                )}
              </button>
            </div>
            
            {r2TestResult && (
              <div className={`p-4 rounded-md ${
                r2TestResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {r2TestResult.success ? (
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      r2TestResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {r2TestResult.success ? 'R2接続成功' : 'R2接続失敗'}
                    </h3>
                    <div className={`mt-2 text-sm ${
                      r2TestResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {r2TestResult.success ? (
                        <div>
                          <p>✅ バケット: {r2TestResult.config?.bucketName}</p>
                          <p>✅ エンドポイント: {r2TestResult.config?.endpoint}</p>
                          {r2TestResult.targetBucketExists && <p>✅ 対象バケットが存在します</p>}
                        </div>
                      ) : (
                        <div>
                          <p>❌ エラー: {r2TestResult.error}</p>
                          {r2TestResult.code && <p>コード: {r2TestResult.code}</p>}
                          {r2TestResult.missingVars && (
                            <p>不足している環境変数: {r2TestResult.missingVars.join(', ')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {streamTestResult && (
              <div className={`p-4 rounded-md mt-4 ${
                streamTestResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {streamTestResult.success ? (
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      streamTestResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {streamTestResult.success ? 'Stream API接続成功' : 'Stream API接続失敗'}
                    </h3>
                    <div className={`mt-2 text-sm ${
                      streamTestResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {streamTestResult.success ? (
                        <div>
                          <p>✅ アカウントID: {streamTestResult.config?.accountId}</p>
                          <p>✅ 動画数: {streamTestResult.videoCount}件</p>
                        </div>
                      ) : (
                        <div>
                          <p>❌ エラー: {streamTestResult.error}</p>
                          {streamTestResult.status && <p>ステータス: {streamTestResult.status}</p>}
                          {streamTestResult.missingVars && (
                            <p>不足している環境変数: {streamTestResult.missingVars.join(', ')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {envCheckResult && (
              <div className={`p-4 rounded-md mt-4 ${
                envCheckResult.success 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {envCheckResult.success ? (
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      envCheckResult.success ? 'text-blue-800' : 'text-red-800'
                    }`}>
                      {envCheckResult.success ? '環境変数チェック完了' : '環境変数チェック失敗'}
                    </h3>
                    <div className={`mt-2 text-sm ${
                      envCheckResult.success ? 'text-blue-700' : 'text-red-700'
                    }`}>
                      {envCheckResult.success ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(envCheckResult.environment).map(([key, value]: [string, any]) => (
                              <div key={key} className={`p-2 rounded ${
                                value.hasValue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                <div className="font-medium">{key}</div>
                                <div>{value.hasValue ? `✅ ${value.prefix}` : '❌ Not set'}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p>❌ エラー: {envCheckResult.error}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {tokenInfoResult && (
              <div className={`p-4 rounded-md mt-4 ${
                tokenInfoResult.success 
                  ? 'bg-orange-50 border border-orange-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {tokenInfoResult.success ? (
                      <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      tokenInfoResult.success ? 'text-orange-800' : 'text-red-800'
                    }`}>
                      {tokenInfoResult.success ? 'トークン情報取得成功' : 'トークン情報取得失敗'}
                    </h3>
                    <div className={`mt-2 text-sm ${
                      tokenInfoResult.success ? 'text-orange-700' : 'text-red-700'
                    }`}>
                      {tokenInfoResult.success ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            <div className="p-2 bg-orange-100 rounded">
                              <div className="font-medium">トークン名: {tokenInfoResult.tokenInfo?.name}</div>
                              <div>ステータス: {tokenInfoResult.tokenInfo?.status}</div>
                              <div>Stream権限: {tokenInfoResult.hasStreamPermission ? '✅ あり' : '❌ なし'}</div>
                              <div>成功した認証方法: {tokenInfoResult.successfulAuthMethod}</div>
                              <div>成功したエンドポイント: {tokenInfoResult.successfulEndpoint}</div>
                            </div>
                            <div className="p-2 bg-orange-100 rounded">
                              <div className="font-medium">権限一覧:</div>
                              <div className="text-xs">
                                {tokenInfoResult.permissions?.map((p: any, index: number) => (
                                  <div key={index} className="truncate">
                                    {p.permission || p.resource || 'Unknown'}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p>❌ エラー: {tokenInfoResult.error}</p>
                          {tokenInfoResult.status && <p>ステータス: {tokenInfoResult.status}</p>}
                          {tokenInfoResult.successfulAuthMethod && <p>試行した認証方法: {tokenInfoResult.successfulAuthMethod}</p>}
                          {tokenInfoResult.successfulEndpoint && <p>試行したエンドポイント: {tokenInfoResult.successfulEndpoint}</p>}
                          {tokenInfoResult.tokenAnalysis && (
                            <div className="mt-2 p-2 bg-red-100 rounded text-xs">
                              <div className="font-medium">トークン分析:</div>
                              <div>長さ: {tokenInfoResult.tokenAnalysis.length}</div>
                              <div>ハイフン: {tokenInfoResult.tokenAnalysis.hasHyphens ? 'あり' : 'なし'}</div>
                              <div>セグメント数: {tokenInfoResult.tokenAnalysis.segments}</div>
                              <div>最初のセグメント: {tokenInfoResult.tokenAnalysis.firstSegment}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {envDebugResult && (
              <div className={`p-4 rounded-md mt-4 ${
                envDebugResult.success 
                  ? 'bg-gray-50 border border-gray-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {envDebugResult.success ? (
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      envDebugResult.success ? 'text-gray-800' : 'text-red-800'
                    }`}>
                      {envDebugResult.success ? '環境変数デバッグ完了' : '環境変数デバッグ失敗'}
                    </h3>
                    <div className={`mt-2 text-sm ${
                      envDebugResult.success ? 'text-gray-700' : 'text-red-700'
                    }`}>
                      {envDebugResult.success ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            <div className="p-2 bg-gray-100 rounded">
                              <div className="font-medium">CLOUDFLARE_STREAM_API_TOKEN</div>
                              <div>存在: {envDebugResult.envInfo?.CLOUDFLARE_STREAM_API_TOKEN?.exists ? '✅' : '❌'}</div>
                              <div>長さ: {envDebugResult.envInfo?.CLOUDFLARE_STREAM_API_TOKEN?.length}</div>
                              <div>形式: {envDebugResult.envInfo?.CLOUDFLARE_STREAM_API_TOKEN?.format}</div>
                              <div>プレフィックス: {envDebugResult.envInfo?.CLOUDFLARE_STREAM_API_TOKEN?.prefix}</div>
                            </div>
                            <div className="p-2 bg-gray-100 rounded">
                              <div className="font-medium">CLOUDFLARE_ACCOUNT_ID</div>
                              <div>存在: {envDebugResult.envInfo?.CLOUDFLARE_ACCOUNT_ID?.exists ? '✅' : '❌'}</div>
                              <div>長さ: {envDebugResult.envInfo?.CLOUDFLARE_ACCOUNT_ID?.length}</div>
                              <div>値: {envDebugResult.envInfo?.CLOUDFLARE_ACCOUNT_ID?.value}</div>
                            </div>
                            <div className="p-2 bg-gray-100 rounded">
                              <div className="font-medium">環境変数統計</div>
                              <div>総数: {envDebugResult.envInfo?.totalEnvVars}</div>
                              <div>Cloudflare関連: {envDebugResult.envInfo?.allCloudflareKeys?.join(', ')}</div>
                              <div>R2関連: {envDebugResult.envInfo?.allR2Keys?.join(', ')}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p>❌ エラー: {envDebugResult.error}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 最近のレシピ */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">最近のレシピ</h3>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    レシピ名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作成日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    閲覧数
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentRecipes.map((recipe) => (
                  <tr key={recipe.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {recipe.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {recipe.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        recipe.status === '公開中' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {recipe.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {recipe.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/recipes/${recipe.id}/edit`}
                        className="text-red-600 hover:text-red-900"
                      >
                        編集
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
