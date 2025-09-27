'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/admin-auth-context';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  status: 'published' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
}

export default function FAQManagementPage() {
  const { token } = useAuth();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);

  // フォーム状態
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    display_order: 0,
    status: 'published' as 'published' | 'draft' | 'archived'
  });

  // FAQ一覧取得
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/faqs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.needsSetup) {
        setError('FAQテーブルがまだ作成されていません。データベースセットアップを実行してください。');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'FAQの取得に失敗しました');
      }

      setFaqs(data.faqs || []);
    } catch (err) {
      console.error('FAQ取得エラー:', err);
      setError(err instanceof Error ? err.message : 'FAQの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // FAQ作成
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'FAQの作成に失敗しました');
      }

      setShowCreateModal(false);
      setFormData({ question: '', answer: '', display_order: 0, status: 'published' });
      await fetchFAQs();
      alert('FAQが正常に作成されました');
    } catch (err) {
      console.error('FAQ作成エラー:', err);
      alert(err instanceof Error ? err.message : 'FAQの作成に失敗しました');
    }
  };

  // FAQ更新
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingFAQ) return;

    try {
      const response = await fetch(`/api/admin/faqs/${editingFAQ.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'FAQの更新に失敗しました');
      }

      setEditingFAQ(null);
      setFormData({ question: '', answer: '', display_order: 0, status: 'published' });
      await fetchFAQs();
      alert('FAQが正常に更新されました');
    } catch (err) {
      console.error('FAQ更新エラー:', err);
      alert(err instanceof Error ? err.message : 'FAQの更新に失敗しました');
    }
  };

  // FAQ削除
  const handleDelete = async (id: string) => {
    if (!confirm('このFAQを削除しますか？この操作は元に戻せません。')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'FAQの削除に失敗しました');
      }

      await fetchFAQs();
      alert('FAQが正常に削除されました');
    } catch (err) {
      console.error('FAQ削除エラー:', err);
      alert(err instanceof Error ? err.message : 'FAQの削除に失敗しました');
    }
  };

  // 表示順更新
  const updateOrder = async (newFaqs: FAQ[]) => {
    try {
      const orderUpdates = newFaqs.map((faq, index) => ({
        id: faq.id,
        display_order: index + 1
      }));

      const response = await fetch('/api/admin/faqs/update-order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ faqs: orderUpdates })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '表示順の更新に失敗しました');
      }

      setFaqs(newFaqs);
    } catch (err) {
      console.error('表示順更新エラー:', err);
      alert(err instanceof Error ? err.message : '表示順の更新に失敗しました');
      await fetchFAQs(); // 元に戻す
    }
  };

  // ドラッグ&ドロップ処理
  const handleDragStart = (index: number) => {
    setDragStartIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (dragStartIndex === null) return;

    const newFaqs = [...faqs];
    const draggedItem = newFaqs[dragStartIndex];
    
    // ドラッグしたアイテムを削除
    newFaqs.splice(dragStartIndex, 1);
    // 新しい位置に挿入
    newFaqs.splice(dropIndex, 0, draggedItem);
    
    updateOrder(newFaqs);
    setDragStartIndex(null);
  };

  // 編集モーダルを開く
  const openEditModal = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      display_order: faq.display_order,
      status: faq.status
    });
  };

  // モーダルを閉じる
  const closeModal = () => {
    setShowCreateModal(false);
    setEditingFAQ(null);
    setFormData({ question: '', answer: '', display_order: 0, status: 'published' });
  };

  // 初期化
  useEffect(() => {
    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">FAQを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FAQ管理</h1>
              <p className="mt-2 text-gray-600">よくある質問の作成、編集、削除を行えます</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              新しいFAQを作成
            </button>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">エラー</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ一覧 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">FAQ一覧 ({faqs.length}件)</h2>
          </div>
          
          {faqs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <span className="text-4xl mb-4 block">📝</span>
              <p>まだFAQがありません。新しいFAQを作成してください。</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-move"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm font-medium">
                          #{faq.display_order}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          faq.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : faq.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {faq.status === 'published' ? '公開中' : 
                           faq.status === 'draft' ? '下書き' : 'アーカイブ'}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {faq.answer}
                      </p>
                      <div className="mt-3 text-sm text-gray-500">
                        作成日: {new Date(faq.created_at).toLocaleDateString('ja-JP')}
                        {faq.updated_at !== faq.created_at && (
                          <span className="ml-4">
                            更新日: {new Date(faq.updated_at).toLocaleDateString('ja-JP')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEditModal(faq)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 作成モーダル */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">新しいFAQを作成</h2>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    質問 *
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="例: DOG KITCHENとは何ですか？"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    回答 *
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={4}
                    placeholder="質問への回答を入力してください"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    表示順
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0（自動設定）"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ステータス
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="published">公開中</option>
                    <option value="draft">下書き</option>
                    <option value="archived">アーカイブ</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    作成
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 編集モーダル */}
        {editingFAQ && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">FAQを編集</h2>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    質問 *
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    回答 *
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    表示順
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ステータス
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="published">公開中</option>
                    <option value="draft">下書き</option>
                    <option value="archived">アーカイブ</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    更新
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
