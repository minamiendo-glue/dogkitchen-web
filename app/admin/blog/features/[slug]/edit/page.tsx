"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { SimpleImageUpload } from '@/components/admin/simple-image-upload';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { FeatureSectionEditor } from '@/components/admin/feature-section-editor';
import RecipeSearch from '@/components/admin/recipe-search';
import { Feature, CreateFeatureData, FeatureSection } from '@/types/blog';

interface Recipe {
  id: string;
  title: string;
  thumbnail_url?: string;
  difficulty: string;
  cooking_time: number;
}

export default function EditFeaturePage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feature, setFeature] = useState<Feature | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [sections, setSections] = useState<FeatureSection[]>([]);
  const [formData, setFormData] = useState<CreateFeatureData>({
    title: '',
    slug: '',
    excerpt: '',
    featured_image_url: '',
    status: 'draft',
    recipe_ids: [],
    sections: []
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // 特集データを取得
  const fetchFeature = async () => {
    try {
      const slug = await params.slug;
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/blog/features/${slug}`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setFeature(data.feature);
        // 小項目データを正しく初期化
        const sectionsData = data.feature.sections || [];
        console.log('取得した小項目データ:', sectionsData);
        
        const processedSections = sectionsData.map((section: any) => ({
          ...section,
          recipe_ids: section.recipe_ids || []
        }));
        
        console.log('処理後の小項目データ:', processedSections);
        
        console.log('取得した特集データ:', data.feature);
        console.log('status:', data.feature.status);
        
        setFormData({
          title: data.feature.title,
          slug: data.feature.slug,
          excerpt: data.feature.excerpt,
          featured_image_url: data.feature.featured_image_url,
          status: data.feature.status || 'draft', // デフォルト値を設定
          recipe_ids: data.feature.recipes?.map((r: any) => r.id) || [],
          sections: processedSections
        });
        setSelectedRecipes(data.feature.recipes?.map((r: any) => r.id) || []);
        setSections(processedSections);
      } else {
        console.error('特集取得エラー:', await response.json());
        alert('特集の取得に失敗しました');
        router.push('/admin/blog/features');
      }
    } catch (error) {
      console.error('特集取得エラー:', error);
      alert('特集の取得に失敗しました');
      router.push('/admin/blog/features');
    } finally {
      setLoading(false);
    }
  };

  // レシピ一覧を取得
  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error('レシピ取得エラー:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeature();
      fetchRecipes();
    }
  }, [isAuthenticated, params]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value as 'draft' | 'published' | 'archived'
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      featured_image_url: url
    }));
  };


  const handleRecipeToggle = (recipeId: string) => {
    setSelectedRecipes(prev => {
      const newSelected = prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId];
      
      setFormData(prevForm => ({
        ...prevForm,
        recipe_ids: newSelected
      }));
      
      return newSelected;
    });
  };

  const handleSectionsChange = (newSections: FeatureSection[]) => {
    setSections(newSections);
    setFormData(prev => ({
      ...prev,
      sections: newSections
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug) {
      alert('タイトル、スラッグは必須です');
      return;
    }

    setSaving(true);
    
    try {
      const slug = await params.slug;
      const headers = getAuthHeaders();
      
      // 小項目データを含めて送信
      const submitData = {
        ...formData,
        sections: sections
      };
      
      const response = await fetch(`/api/admin/blog/features/${slug}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(submitData)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('特集更新結果:', result);
        alert('特集が正常に更新されました！');
        router.push('/admin/blog/features');
      } else {
        console.error('特集更新エラー:', result);
        alert(`エラー: ${result.error}`);
      }
    } catch (error) {
      console.error('特集更新エラー:', error);
      alert('特集の更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('この特集を削除しますか？この操作は取り消せません。')) {
      return;
    }

    setDeleting(true);
    
    try {
      const slug = await params.slug;
      const headers = getAuthHeaders();
      const response = await fetch(`/api/blog/features/${slug}`, {
        method: 'DELETE',
        headers
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('特集削除結果:', result);
        alert('特集が正常に削除されました！');
        router.push('/admin/blog/features');
      } else {
        console.error('特集削除エラー:', result);
        alert(`エラー: ${result.error}`);
      }
    } catch (error) {
      console.error('特集削除エラー:', error);
      alert('特集の削除に失敗しました');
    } finally {
      setDeleting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
          <h1 className="text-4xl font-bold">特集を編集</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!feature) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
          <h1 className="text-4xl font-bold">特集を編集</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">特集が見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold">特集を編集</h1>
        <p className="mt-2 text-lg opacity-90">「{feature.title}」の編集</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">基本情報</h2>
          
          <div className="space-y-6">
            {/* タイトル */}
            <div>
              <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">
                特集タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                placeholder="例: 秋の味覚を楽しむ特集"
                required
              />
              <p className="mt-1 text-sm text-gray-500">特集のタイトルを入力してください</p>
            </div>

            {/* スラッグ */}
            <div>
              <label htmlFor="slug" className="block text-lg font-semibold text-gray-700 mb-2">
                URLスラッグ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                placeholder="例: autumn-special"
                required
              />
              <p className="mt-1 text-sm text-gray-500">URLに使用される英数字とハイフンのみの文字列</p>
            </div>

            {/* 概要 */}
            <div>
              <label htmlFor="excerpt" className="block text-lg font-semibold text-gray-700 mb-2">
                特集の概要
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                placeholder="この特集の概要を簡潔に説明してください"
              />
              <p className="mt-1 text-sm text-gray-500">特集の概要を簡潔に説明してください</p>
            </div>
          </div>
        </div>

        {/* ステータス */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">公開設定</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="draft"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={handleStatusChange}
                className="w-5 h-5 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="draft" className="text-lg font-medium text-gray-700">
                下書きとして保存
              </label>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="published"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={handleStatusChange}
                className="w-5 h-5 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="published" className="text-lg font-medium text-gray-700">
                公開中
              </label>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="archived"
                name="status"
                value="archived"
                checked={formData.status === 'archived'}
                onChange={handleStatusChange}
                className="w-5 h-5 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="archived" className="text-lg font-medium text-gray-700">
                アーカイブ
              </label>
            </div>
          </div>
        </div>

        {/* アイキャッチ画像 */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">アイキャッチ画像</h2>
          
          <div className="space-y-4">
            <SimpleImageUpload
              value={formData.featured_image_url}
              onChange={handleImageUpload}
              placeholder="アイキャッチ画像をアップロード"
            />
            <p className="text-sm text-gray-500">
              特集のメイン画像をアップロードしてください。推奨サイズ: 1200x630px
            </p>
          </div>
        </div>

        {/* レシピ検索・選択 */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">レシピの検索・選択</h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">レシピ検索の使い方</p>
                  <p>ライフステージ、健康状態、タンパク質タイプ、利用シーン、調理時間、カロリーなどで絞り込んで、特集に適したレシピを探すことができます。</p>
                </div>
              </div>
            </div>

            <RecipeSearch
              onRecipesChange={setRecipes}
              selectedRecipeIds={selectedRecipes}
              onSelectionChange={setSelectedRecipes}
            />
          </div>
        </div>

        {/* 小項目とレシピ管理 */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">小項目とレシピの管理</h2>
          
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">小項目の使い方</p>
                  <p>特集を複数の小項目に分けて、それぞれにレシピを割り当てることができます。例：「レンジで作る主菜」「炊飯器で作る主食」など。</p>
                </div>
              </div>
            </div>

            <FeatureSectionEditor
              sections={sections}
              onSectionsChange={handleSectionsChange}
              recipes={recipes}
            />
          </div>
        </div>


        {/* アクションボタン */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">操作</h2>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold"
              >
                {saving ? '保存中...' : '変更を保存'}
              </button>
            </div>
            
            {/* 削除ボタン */}
            <div className="border-l border-gray-200 pl-6">
              <p className="text-sm text-gray-500 mb-2">危険な操作</p>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold"
              >
                {deleting ? '削除中...' : '特集を削除'}
              </button>
              <p className="text-xs text-red-600 mt-1">この操作は取り消せません</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
