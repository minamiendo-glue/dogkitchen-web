'use client';

import { useState, useRef } from 'react';
import { useButtonLoading } from '@/lib/utils/button-optimization';

interface R2FileUploadProps {
  onFileUploaded: (url: string, key: string) => void;
  onFileRemoved?: () => void;
  accept: string;
  maxSize: number; // MB
  category: string;
  className?: string;
  preview?: boolean;
  currentUrl?: string;
}

export function R2FileUpload({
  onFileUploaded,
  onFileRemoved,
  accept,
  maxSize,
  category,
  className = '',
  preview = true,
  currentUrl
}: R2FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<{
    url: string;
    key: string;
    name: string;
    size: number;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, executeWithLoading } = useButtonLoading();

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`ファイルサイズが大きすぎます。最大${maxSize}MBまでです。`);
      return;
    }

    await executeWithLoading(async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        const response = await fetch('/api/upload/r2', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setUploadedFile({
            url: result.url,
            key: result.key,
            name: result.fileName,
            size: result.size,
          });
          setPreviewUrl(result.url);
          onFileUploaded(result.url, result.key);
        } else {
          alert(`アップロードに失敗しました: ${result.error}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('アップロード中にエラーが発生しました');
      }
    });
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleRemove = async () => {
    if (uploadedFile) {
      try {
        const response = await fetch('/api/upload/r2', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: uploadedFile.key }),
        });

        if (response.ok) {
          setUploadedFile(null);
          setPreviewUrl(null);
          onFileRemoved?.();
        } else {
          alert('ファイルの削除に失敗しました');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('ファイルの削除中にエラーが発生しました');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ファイル選択エリア */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            <p className="text-gray-600">アップロード中...</p>
          </div>
        ) : uploadedFile || previewUrl ? (
          <div className="space-y-4">
            {preview && previewUrl && (
              <div className="flex justify-center">
                {previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={previewUrl}
                    alt="プレビュー"
                    className="max-w-full max-h-48 rounded-lg shadow-sm"
                  />
                ) : previewUrl.match(/\.(mp4|webm|mov)$/i) ? (
                  <video
                    src={previewUrl}
                    controls
                    className="max-w-full max-h-48 rounded-lg shadow-sm"
                  >
                    お使いのブラウザは動画タグをサポートしていません。
                  </video>
                ) : (
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-600">プレビューを表示できません</p>
                  </div>
                )}
              </div>
            )}
            
            {uploadedFile && (
              <div className="text-sm text-gray-600">
                <p><strong>ファイル名:</strong> {uploadedFile.name}</p>
                <p><strong>サイズ:</strong> {formatFileSize(uploadedFile.size)}</p>
              </div>
            )}
            
            <div className="flex justify-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                別のファイルを選択
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-gray-400">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-gray-600">
              ファイルをドラッグ&ドロップするか、
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-red-500 hover:text-red-600 underline ml-1"
              >
                クリックして選択
              </button>
            </p>
            <p className="text-sm text-gray-500">
              最大サイズ: {maxSize}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
