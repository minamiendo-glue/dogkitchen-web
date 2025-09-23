'use client';

import { useState } from 'react';

export default function StripeTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testStripeConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/test-connection');
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        success: false,
        error: 'テスト実行エラー',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Stripe連携テスト</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">接続テスト</h2>
          
          <button
            onClick={testStripeConnection}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'テスト中...' : 'Stripe接続をテスト'}
          </button>

          {testResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              testResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.success ? '✅ 接続成功' : '❌ 接続失敗'}
              </h3>
              
              {testResult.success ? (
                <div className="text-green-700">
                  <p className="mb-2">Stripe APIへの接続が正常に確立されました。</p>
                  <div className="bg-white p-3 rounded border">
                    <p><strong>利用可能残高:</strong> {testResult.balance?.available?.[0]?.amount || 0} {testResult.currency?.toUpperCase()}</p>
                    <p><strong>保留中残高:</strong> {testResult.balance?.pending?.[0]?.amount || 0} {testResult.currency?.toUpperCase()}</p>
                  </div>
                </div>
              ) : (
                <div className="text-red-700">
                  <p className="mb-2">Stripe APIへの接続に失敗しました。</p>
                  <div className="bg-white p-3 rounded border">
                    <p><strong>エラー:</strong> {testResult.error}</p>
                    <p><strong>詳細:</strong> {testResult.details}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">設定確認</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">環境変数</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>環境: {process.env.NODE_ENV || 'development'}</li>
                  <li>STRIPE_PUBLISHABLE_KEY: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ 設定済み' : '❌ 未設定'}</li>
                  <li>STRIPE_SECRET_KEY: {process.env.STRIPE_SECRET_KEY ? '✅ 設定済み' : '❌ 未設定'}</li>
                  <li>STRIPE_WEBHOOK_SECRET: {process.env.STRIPE_WEBHOOK_SECRET ? '✅ 設定済み' : '❌ 未設定'}</li>
                  <li>使用中のキータイプ: {process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? '本番キー' : 'テストキー'}</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">次のステップ</h3>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. .env.localにAPIキーを設定</li>
                  <li>2. Stripeで価格設定を作成</li>
                  <li>3. 価格IDをlib/stripe.tsに設定</li>
                  <li>4. Webhookエンドポイントを設定</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
