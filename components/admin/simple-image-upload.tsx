'use client';

import { useState, useRef } from 'react';

interface SimpleImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export function SimpleImageUpload({ value, onChange, placeholder = "画像をアップロード" }: SimpleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック（10MB制限）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('ファイルサイズが大きすぎます（最大10MB）');
      return;
    }

    // ファイルタイプチェック
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('サポートされていないファイル形式です。対応形式: JPG, PNG, GIF, WebP');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'blog');

      const response = await fetch('/api/upload/r2', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'アップロードに失敗しました');
      }

      onChange(result.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* 現在の画像表示 */}
      {value && (
        <div className="w-full relative">
          <img
            src={value}
            alt="アップロードされた画像"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
          >
            ×
          </button>
        </div>
      )}

      {/* アップロードボタン */}
      <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-sm text-gray-600">アップロード中...</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <div className="space-y-2">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm font-medium">{placeholder}</p>
              <p className="text-xs text-gray-500">JPG, PNG, GIF, WebP（最大10MB）</p>
            </div>
          </button>
        )}
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 rounded-md p-3">
          <p className="w-full text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* URL入力フィールド（手動入力用） */}
      <div className="w-full space-y-2">
        <label className="block w-full text-sm font-medium text-gray-700">
          または、画像URLを直接入力
        </label>
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
        />
      </div>
    </div>
  );
}
