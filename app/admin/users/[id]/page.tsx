'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  is_active: boolean;
  role: string;
  email_confirmed_at?: string;
  phone?: string;
  avatar_url?: string;
}

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const resolvedParams = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'user',
    is_active: true
  });

  useEffect(() => {
    fetchUser();
  }, [resolvedParams.id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${resolvedParams.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'ユーザーの取得に失敗しました');
      }
      
      setUser(data.user);
      setEditForm({
        name: data.user.name || '',
        email: data.user.email || '',
        role: data.user.role || 'user',
        is_active: data.user.is_active
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラー');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/admin/users/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'ユーザーの更新に失敗しました');
      }
      
      setUser(data.user);
      setIsEditing(false);
      alert('ユーザー情報を更新しました');
    } catch (err) {
      alert(`更新に失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm('このユーザーを削除しますか？この操作は取り消せません。')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'ユーザーの削除に失敗しました');
      }
      
      alert('ユーザーを削除しました');
      window.location.href = '/admin/users';
    } catch (err) {
      alert(`削除に失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('このユーザーを無効化しますか？ログインできなくなります。')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${resolvedParams.id}/deactivate`, {
        method: 'POST',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'ユーザーの無効化に失敗しました');
      }
      
      setUser(data.user);
      alert('ユーザーを無効化しました');
    } catch (err) {
      alert(`無効化に失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '未設定';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '無効な日付';
      }
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '日付エラー';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
            管理者
          </span>
        );
      case 'user':
        return (
          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
            一般ユーザー
          </span>
        );
      default:
        return (
          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
            {role}
          </span>
        );
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
        アクティブ
      </span>
    ) : (
      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
        非アクティブ
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">エラー: {error || 'ユーザーが見つかりません'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/admin/users" className="text-gray-400 hover:text-gray-500">
                  ユーザー管理
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">ユーザー詳細</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{user.name || '名前未設定'}</h1>
        </div>
        <div className="flex space-x-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                編集
              </button>
              {user.is_active && (
                <button
                  onClick={handleDeactivate}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  無効化
                </button>
              )}
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                削除
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                保存
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                キャンセル
              </button>
            </>
          )}
        </div>
      </div>

      {/* ユーザー情報 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">基本情報</h3>
        </div>
        <div className="px-6 py-4 space-y-6">
          {/* アバターとステータス */}
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 text-2xl font-medium">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                {getStatusBadge(user.is_active)}
                {getRoleBadge(user.role)}
              </div>
            </div>
          </div>

          {/* 編集フォーム */}
          {isEditing ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  名前
                </label>
                <input
                  type="text"
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  ロール
                </label>
                <select
                  id="role"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                >
                  <option value="user">一般ユーザー</option>
                  <option value="admin">管理者</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  アクティブ
                </label>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">名前</label>
                <p className="mt-1 text-sm text-gray-900">{user.name || '未設定'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ロール</label>
                <div className="mt-1">
                  {getRoleBadge(user.role)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ステータス</label>
                <div className="mt-1">
                  {getStatusBadge(user.is_active)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* アカウント情報 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">アカウント情報</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">ユーザーID</label>
              <p className="mt-1 text-sm text-gray-900 font-mono">{user.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">登録日時</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(user.created_at)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">最終更新日時</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(user.updated_at)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">最終ログイン</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(user.last_sign_in_at)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">メール確認状況</label>
              <p className="mt-1 text-sm text-gray-900">
                {user.email_confirmed_at ? '確認済み' : '未確認'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 危険な操作 */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-800 mb-4">危険な操作</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-red-700">ユーザー無効化</h4>
            <p className="text-sm text-red-600">
              ユーザーを無効化すると、ログインできなくなります。データは保持されます。
            </p>
            {user.is_active && (
              <button
                onClick={handleDeactivate}
                className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                ユーザーを無効化
              </button>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-700">ユーザー削除</h4>
            <p className="text-sm text-red-600">
              ユーザーを完全に削除します。この操作は取り消せません。関連するデータも削除されます。
            </p>
            <button
              onClick={handleDelete}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              ユーザーを削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
