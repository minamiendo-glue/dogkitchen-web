'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';

export default function TestDataPage() {
  const { isAuthenticated } = useAdminAuth();
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createTestData = async () => {
    setCreateLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/test/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${data.message} (${data.count}件)`);
      } else {
        setMessage(`❌ エラー: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ エラー: ${error}`);
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteTestData = async () => {
    setDeleteLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/test/recipes', {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ エラー: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ エラー: ${error}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">認証が必要です</h1>
          <p className="text-gray-600">管理画面にアクセスするにはログインしてください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">テストデータ管理</h1>
          
          <div className="space-y-6">
            {/* テストデータ作成 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">テストデータ作成</h2>
              <p className="text-blue-800 mb-4">
                絞り込み機能のテスト用に36件のレシピデータを作成します。
                様々な条件の組み合わせでテストできます。
              </p>
              <button
                onClick={createTestData}
                disabled={createLoading}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createLoading ? '作成中...' : 'テストデータを作成'}
              </button>
            </div>

            {/* テストデータ削除 */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-900 mb-4">テストデータ削除</h2>
              <p className="text-red-800 mb-4">
                作成したテストデータを削除します。
              </p>
              <button
                onClick={deleteTestData}
                disabled={deleteLoading}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleteLoading ? '削除中...' : 'テストデータを削除'}
              </button>
            </div>

            {/* メッセージ表示 */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}

            {/* テスト項目一覧 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">テスト項目一覧</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ライフステージ */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">ライフステージ</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 子犬期: 2件</li>
                    <li>• 成犬期: 多数</li>
                    <li>• シニア期: 3件</li>
                  </ul>
                </div>

                {/* 健康状態 */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">健康状態</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• バランスGood: 多数</li>
                    <li>• 腎臓ケア: 2件</li>
                    <li>• 心臓ケア: 2件</li>
                    <li>• 肝臓ケア: 1件</li>
                    <li>• 皮膚ケア: 1件</li>
                    <li>• お腹が弱い: 1件</li>
                    <li>• 熱中症対策: 2件</li>
                    <li>• 体重増加: 1件</li>
                    <li>• 冷え: 1件</li>
                    <li>• 嗜好性UP: 2件</li>
                    <li>• 関節ケア: 3件</li>
                  </ul>
                </div>

                {/* タンパク質タイプ */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">タンパク質タイプ</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 牛: 4件</li>
                    <li>• 豚: 2件</li>
                    <li>• 鶏: 8件</li>
                    <li>• 馬: 4件</li>
                    <li>• 魚: 8件</li>
                    <li>• カンガルー: 2件</li>
                  </ul>
                </div>

                {/* 食事シーン */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">食事シーン</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 日常ごはん: 多数</li>
                    <li>• おやつ: 4件</li>
                    <li>• 特別な日: 4件</li>
                  </ul>
                </div>

                {/* 難易度 */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">難易度</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 簡単: 多数</li>
                    <li>• 普通: 多数</li>
                    <li>• 難しい: 4件</li>
                  </ul>
                </div>

                {/* 調理時間 */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">調理時間</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 5分: 1件</li>
                    <li>• 10分: 3件</li>
                    <li>• 15分: 3件</li>
                    <li>• 20分: 5件</li>
                    <li>• 25分: 3件</li>
                    <li>• 30分: 4件</li>
                    <li>• 45分: 2件</li>
                    <li>• 60分: 1件</li>
                    <li>• 90分: 1件</li>
                    <li>• 120分: 1件</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* テスト手順 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-900 mb-4">テスト手順</h2>
              <ol className="text-yellow-800 space-y-2">
                <li>1. 「テストデータを作成」ボタンをクリック</li>
                <li>2. ホーム画面（<a href="/" className="text-blue-600 underline">http://localhost:3000</a>）で絞り込み機能をテスト</li>
                <li>3. 管理画面の特集作成（<a href="/admin/blog/features/create" className="text-blue-600 underline">http://localhost:3000/admin/blog/features/create</a>）でレシピ検索をテスト</li>
                <li>4. 様々な条件の組み合わせで絞り込みが正常に動作することを確認</li>
                <li>5. テスト完了後、「テストデータを削除」ボタンでクリーンアップ</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
