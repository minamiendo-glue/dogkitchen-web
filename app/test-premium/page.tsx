'use client';

import { usePremiumCheck } from '@/hooks/usePremiumCheck';
import { PremiumButton } from '@/components/premium-button';
import { Header } from '@/components/header';

export default function TestPremiumPage() {
  const { isPremium, isLoading, error, user, loading } = usePremiumCheck({ requireAuth: false });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">プレミアム状況を確認中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="test-premium" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">プレミアム機能テストページ</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* ユーザー情報 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ユーザー情報</h2>
            {session ? (
              <div>
                <p className="text-gray-600 mb-2">メール: {session.user?.email}</p>
                <p className="text-gray-600 mb-2">名前: {session.user?.name}</p>
                <p className="text-gray-600">ID: {session.user?.id}</p>
              </div>
            ) : (
              <p className="text-gray-600">ログインしていません</p>
            )}
          </div>

          {/* プレミアム状況 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">プレミアム状況</h2>
            {error ? (
              <div>
                <p className="text-red-600 mb-2">エラー: {error}</p>
                <p className="text-gray-600">モック状態を使用中</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  ステータス: <span className={`font-semibold ${isPremium ? 'text-green-600' : 'text-red-600'}`}>
                    {isPremium ? 'プレミアム' : '通常'}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  {isPremium ? 'プレミアム機能をご利用いただけます' : 'プレミアムプランにご加入ください'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* プレミアム機能ボタンテスト */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">プレミアム機能ボタンテスト</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <PremiumButton 
              variant="primary" 
              size="md"
              premiumFeature="愛犬プロフィール登録"
              onClick={() => {
                alert('愛犬プロフィール登録機能（開発中）');
              }}
            >
              🐕 愛犬プロフィールを作成
            </PremiumButton>
            
            
            <PremiumButton 
              variant="outline" 
              size="md"
              premiumFeature="レシピカスタマイズ"
              onClick={() => {
                alert('レシピカスタマイズ機能（開発中）');
              }}
            >
              🎯 レシピをカスタマイズ
            </PremiumButton>
            
            <PremiumButton 
              variant="primary" 
              size="sm"
              premiumFeature="お気に入り保存"
              onClick={() => {
                alert('お気に入り保存機能（開発中）');
              }}
            >
              ❤️ お気に入り保存
            </PremiumButton>
            
            <PremiumButton 
              variant="secondary" 
              size="sm"
              premiumFeature="詳細検索"
              onClick={() => {
                alert('詳細検索機能（開発中）');
              }}
            >
              🔍 詳細検索
            </PremiumButton>
            
            <PremiumButton 
              variant="outline" 
              size="sm"
              premiumFeature="進捗管理"
              onClick={() => {
                alert('進捗管理機能（開発中）');
              }}
            >
              📈 進捗管理
            </PremiumButton>
          </div>
        </div>

        {/* テスト用の説明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">テスト方法</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• <strong>test@example.com</strong> でログインするとプレミアムユーザーとして扱われます</li>
            <li>• その他のユーザーは未プレミアムとして扱われます</li>
            <li>• プレミアムボタンをクリックすると、未プレミアムの場合はプレミアムページにリダイレクトされます</li>
            <li>• プレミアムユーザーの場合は、各機能の開発中メッセージが表示されます</li>
          </ul>
        </div>
      </div>
    </div>
  );
}




