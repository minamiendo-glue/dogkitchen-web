'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateArticleData } from '@/types/blog';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { SimpleImageUpload } from '@/components/admin/simple-image-upload';
import { RichTextEditor } from '@/components/admin/rich-text-editor';

export default function CreateArticlePage() {
  const router = useRouter();
  const { isAuthenticated } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateArticleData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    status: 'draft',
    recipe_ids: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content) {
      setError('タイトル、スラッグ、内容は必須です');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/blog/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '記事の作成に失敗しました');
      }

      const result = await response.json();
      console.log('記事作成結果:', result);
      router.push('/admin/blog/articles');
    } catch (err) {
      console.error('記事作成エラー:', err);
      setError(err instanceof Error ? err.message : '記事の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">新しい記事を作成</h1>
        <p className="mt-2 text-gray-600">
          記事の内容を入力してください
        </p>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">エラー</h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="w-full space-y-8">
        {/* 基本情報セクション */}
        <div className="w-full bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="w-full p-8 space-y-8">
            {/* タイトル */}
            <div className="w-full">
              <label htmlFor="title" className="block w-full text-lg font-bold text-gray-900 mb-3">
                記事タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full text-lg border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 px-4 py-4 transition-all duration-200"
                placeholder="魅力的な記事タイトルを入力してください"
                required
              />
              <p className="w-full mt-2 text-sm text-gray-600">
                💡 読者の興味を引く、分かりやすいタイトルにしましょう
              </p>
            </div>

            {/* スラッグ */}
            <div className="w-full">
              <label htmlFor="slug" className="block w-full text-lg font-bold text-gray-900 mb-3">
                URLスラッグ <span className="text-red-500">*</span>
              </label>
              <div className="w-full flex items-center">
                <span className="bg-gray-100 text-gray-600 px-4 py-4 rounded-l-xl border-2 border-r-0 border-gray-300 text-sm font-medium">
                  /blog/articles/
                </span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full flex-1 text-lg border-2 border-gray-300 rounded-r-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 px-4 py-4 transition-all duration-200"
                  placeholder="article-slug"
                  required
                />
              </div>
              <p className="w-full mt-2 text-sm text-gray-600">
                🔗 URLに使用される文字列です。英数字とハイフンのみ使用できます
              </p>
            </div>

            {/* ステータス */}
            <div className="w-full">
              <label htmlFor="status" className="block w-full text-lg font-bold text-gray-900 mb-3">
                公開ステータス
              </label>
              <div className="w-full grid grid-cols-3 gap-4">
                <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.status === 'draft' 
                    ? 'border-orange-300 bg-orange-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      formData.status === 'draft' ? 'border-orange-500 bg-orange-500' : 'border-gray-400'
                    }`}>
                      {formData.status === 'draft' && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">下書き</div>
                      <div className="text-sm text-gray-600">後で公開</div>
                    </div>
                  </div>
                </label>
                <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.status === 'published' 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={formData.status === 'published'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      formData.status === 'published' ? 'border-green-500 bg-green-500' : 'border-gray-400'
                    }`}>
                      {formData.status === 'published' && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">公開</div>
                      <div className="text-sm text-gray-600">すぐに公開</div>
                    </div>
                  </div>
                </label>
                <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.status === 'archived' 
                    ? 'border-gray-300 bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="status"
                    value="archived"
                    checked={formData.status === 'archived'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      formData.status === 'archived' ? 'border-gray-500 bg-gray-500' : 'border-gray-400'
                    }`}>
                      {formData.status === 'archived' && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">アーカイブ</div>
                      <div className="text-sm text-gray-600">非表示</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 抜粋 */}
            <div className="w-full">
              <label htmlFor="excerpt" className="block w-full text-lg font-bold text-gray-900 mb-3">
                記事の抜粋
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={4}
                className="w-full text-lg border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 px-4 py-4 transition-all duration-200"
                placeholder="記事の概要や要点を簡潔にまとめてください"
              />
              <p className="w-full mt-2 text-sm text-gray-600">
                📝 記事一覧で表示される短い説明文です。読者の興味を引く内容にしましょう
              </p>
            </div>

            {/* アイキャッチ画像 */}
            <div className="w-full">
              <label className="block w-full text-lg font-bold text-gray-900 mb-3">
                アイキャッチ画像
              </label>
              <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-red-400 transition-colors duration-200">
                <SimpleImageUpload
                  value={formData.featured_image_url}
                  onChange={(url) => setFormData(prev => ({ ...prev, featured_image_url: url }))}
                  placeholder="アイキャッチ画像をアップロード"
                />
              </div>
              <p className="w-full mt-2 text-sm text-gray-600">
                🖼️ 記事の印象を左右する重要な画像です。高品質な画像を選びましょう
              </p>
            </div>
          </div>
        </div>

        {/* 記事内容セクション */}
        <div className="w-full bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="w-full p-8">
            <div className="w-full">
              <label htmlFor="content" className="block w-full text-lg font-bold text-gray-900 mb-3">
                記事本文 <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="記事の内容を入力してください

ツールバーを使って文字を装飾できます：
- **太字** や *斜体* で強調
- # 見出し で構造化
- - リスト で要点を整理
- > 引用 で重要な部分を強調

段落を分けたい場合は空行を入れてください。"
                rows={25}
              />
              <div className="w-full mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="w-full font-semibold text-blue-900 mb-2">📝 書き方のコツ</h4>
                <ul className="w-full text-sm text-blue-800 space-y-1">
                  <li>• ツールバーを使って文字を装飾しましょう</li>
                  <li>• 見出しを使って記事を構造化しましょう</li>
                  <li>• リストを使って要点を整理しましょう</li>
                  <li>• プレビュー機能で見た目を確認しましょう</li>
                  <li>• 読者の立場に立って分かりやすい文章を心がけましょう</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="w-full bg-white shadow-xl rounded-2xl p-8">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-full text-center sm:text-left">
              <h3 className="w-full text-lg font-bold text-gray-900">記事の作成</h3>
              <p className="w-full text-sm text-gray-600 mt-1">
                内容を確認してから記事を作成してください
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold text-lg flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                キャンセル
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    作成中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    記事を作成
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
