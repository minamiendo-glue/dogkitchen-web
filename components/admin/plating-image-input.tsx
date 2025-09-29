'use client';

import React from 'react';
import { R2FileUpload } from './r2-file-upload';

interface PlatingImage {
  url: string;
  comment: string;
}

interface PlatingImageInputProps {
  platingImages: PlatingImage[];
  onChange: (platingImages: PlatingImage[]) => void;
}

export function PlatingImageInput({ platingImages, onChange }: PlatingImageInputProps) {
  const addImage = () => {
    const newImage: PlatingImage = {
      url: '',
      comment: ''
    };
    onChange([...platingImages, newImage]);
  };

  const removeImage = (index: number) => {
    const newImages = platingImages.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const updateImage = (index: number, field: keyof PlatingImage, value: string) => {
    const newImages = platingImages.map((image, i) => 
      i === index ? { ...image, [field]: value } : image
    );
    onChange(newImages);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium text-gray-900">盛り付け画像</h4>
        <button
          onClick={addImage}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>画像を追加</span>
        </button>
      </div>

      {platingImages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>まだ盛り付け画像が追加されていません。</p>
          <p className="text-sm">「画像を追加」ボタンから盛り付け画像を追加してください。</p>
        </div>
      )}

      <div className="space-y-6">
        {platingImages.map((image, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-medium text-gray-900">画像 {index + 1}</h5>
              {platingImages.length > 1 && (
                <button
                  onClick={() => removeImage(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  削除
                </button>
              )}
            </div>

            {/* 画像アップロード */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                盛り付け画像 *
              </label>
              <R2FileUpload
                accept="image/*"
                maxSize={10}
                category="recipes/plating"
                onFileUploaded={(url) => {
                  updateImage(index, 'url', url);
                }}
                onFileRemoved={() => {
                  updateImage(index, 'url', '');
                }}
                preview={true}
                currentUrl={image.url}
                className="max-w-md"
              />
            </div>

            {/* コメント */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                コメント *
              </label>
              <textarea
                value={image.comment}
                onChange={(e) => updateImage(index, 'comment', e.target.value)}
                placeholder="画像の説明やポイントを入力してください"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
