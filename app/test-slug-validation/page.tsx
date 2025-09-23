'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';

export default function TestSlugValidationPage() {
  const { isAuthenticated } = useAdminAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSlugValidation = async () => {
    if (!isAuthenticated) {
      addResult('❌ 管理者認証が必要です');
      return;
    }

    setLoading(true);
    setTestResults([]);
    
    const token = localStorage.getItem('admin_token');
    if (!token) {
      addResult('❌ 認証トークンが見つかりません');
      setLoading(false);
      return;
    }

    try {
      // 1. 最初の記事を作成
      addResult('📝 テスト記事1を作成中...');
      const article1 = {
        title: 'テスト記事1',
        slug: 'test-article-1',
        content: 'これはテスト記事です。',
        excerpt: 'テスト記事の抜粋',
        status: 'draft'
      };

      const response1 = await fetch('/api/blog/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(article1)
      });

      if (response1.ok) {
        addResult('✅ テスト記事1の作成に成功');
      } else {
        const error1 = await response1.json();
        addResult(`❌ テスト記事1の作成に失敗: ${error1.error}`);
      }

      // 2. 同じスラッグで記事を作成（重複エラーを期待）
      addResult('📝 同じスラッグで記事2を作成中...');
      const article2 = {
        title: 'テスト記事2',
        slug: 'test-article-1', // 同じスラッグ
        content: 'これは2番目のテスト記事です。',
        excerpt: 'テスト記事2の抜粋',
        status: 'draft'
      };

      const response2 = await fetch('/api/blog/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(article2)
      });

      if (response2.ok) {
        addResult('❌ 重複スラッグの記事が作成されてしまいました（予期しない動作）');
      } else {
        const error2 = await response2.json();
        if (error2.error === 'このスラッグは既に使用されています') {
          addResult('✅ スラッグ重複チェックが正常に動作しています');
        } else {
          addResult(`❌ 予期しないエラー: ${error2.error}`);
        }
      }

      // 3. 異なるスラッグで記事を作成
      addResult('📝 異なるスラッグで記事3を作成中...');
      const article3 = {
        title: 'テスト記事3',
        slug: 'test-article-3',
        content: 'これは3番目のテスト記事です。',
        excerpt: 'テスト記事3の抜粋',
        status: 'draft'
      };

      const response3 = await fetch('/api/blog/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(article3)
      });

      if (response3.ok) {
        addResult('✅ 異なるスラッグの記事3の作成に成功');
      } else {
        const error3 = await response3.json();
        addResult(`❌ 記事3の作成に失敗: ${error3.error}`);
      }

    } catch (error) {
      addResult(`❌ テスト中にエラーが発生: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">スラッグ重複チェック機能テスト</h1>
            <p className="mt-2 text-gray-600">
              記事作成時のスラッグ重複チェック機能をテストします
            </p>
          </div>
          
          <div className="p-6">
            {!isAuthenticated ? (
              <div className="text-center py-8">
                <div className="text-red-500 text-6xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  管理者認証が必要です
                </h3>
                <p className="text-gray-600">
                  このテストを実行するには、管理者としてログインしてください。
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <button
                    onClick={testSlugValidation}
                    disabled={loading}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'テスト実行中...' : 'スラッグ重複チェックテストを実行'}
                  </button>
                </div>

                {testResults.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">テスト結果</h3>
                    <div className="space-y-2">
                      {testResults.map((result, index) => (
                        <div key={index} className="text-sm font-mono">
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">テスト内容</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>1. テスト記事1を作成（スラッグ: test-article-1）</li>
                    <li>2. 同じスラッグで記事2を作成（重複エラーを期待）</li>
                    <li>3. 異なるスラッグで記事3を作成（成功を期待）</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
