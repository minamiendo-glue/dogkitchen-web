'use client';

import React, { useState } from 'react';
import { R2FileUpload } from './r2-file-upload';

interface Instruction {
  step: number;
  text: string;
  videoFile?: File;
  videoUrl?: string;
}

interface InstructionInputProps {
  instructions: Instruction[];
  onChange: (instructions: Instruction[]) => void;
}

export function InstructionInput({ instructions, onChange }: InstructionInputProps) {
  // デフォルトで2手順分の空の手順を初期化
  React.useEffect(() => {
    if (instructions.length === 0) {
      const defaultInstructions: Instruction[] = [
        { step: 1, text: '', videoFile: undefined, videoUrl: '' },
        { step: 2, text: '', videoFile: undefined, videoUrl: '' }
      ];
      onChange(defaultInstructions);
    }
  }, []);

  const addInstruction = () => {
    const newStep = instructions.length + 1;
    const newInstruction: Instruction = {
      step: newStep,
      text: '',
      videoFile: undefined,
      videoUrl: ''
    };
    onChange([...instructions, newInstruction]);
  };

  const removeLastInstruction = () => {
    if (instructions.length > 2) { // 最低2手順は保持
      const newInstructions = instructions
        .slice(0, -1)
        .map((instruction, i) => ({ ...instruction, step: i + 1 }));
      onChange(newInstructions);
    }
  };

  const updateInstruction = (index: number, field: keyof Instruction, value: string | File | undefined) => {
    const newInstructions = instructions.map((instruction, i) => 
      i === index ? { ...instruction, [field]: value } : instruction
    );
    onChange(newInstructions);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium text-gray-900">作り方の手順</h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={removeLastInstruction}
            disabled={instructions.length <= 2}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <span>➖</span>
            <span>手順を削除</span>
          </button>
          <button
            onClick={addInstruction}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>手順を追加</span>
          </button>
        </div>
      </div>

      {instructions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>まだ手順が追加されていません。</p>
          <p className="text-sm">「手順を追加」ボタンから手順を追加してください。</p>
        </div>
      )}

      <div className="space-y-6">
        {instructions.map((instruction, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {instruction.step}
              </div>
              <h5 className="text-lg font-medium text-gray-900">手順 {instruction.step}</h5>
            </div>

            {/* 手順テキスト */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手順の説明 *
              </label>
              <textarea
                value={instruction.text}
                onChange={(e) => updateInstruction(index, 'text', e.target.value)}
                placeholder="手順の詳細な説明を入力してください"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>

            {/* 動画アップロード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手順動画（任意）
              </label>
              <R2FileUpload
                accept="video/*"
                maxSize={50} // 50MB
                category="recipes/instructions"
                onFileUploaded={(url, key) => {
                  const newInstructions = [...instructions];
                  newInstructions[index] = {
                    ...newInstructions[index],
                    videoUrl: url
                  };
                  onChange(newInstructions);
                }}
                onFileRemoved={() => {
                  const newInstructions = [...instructions];
                  newInstructions[index] = {
                    ...newInstructions[index],
                    videoUrl: ''
                  };
                  onChange(newInstructions);
                }}
                preview={true}
                currentUrl={instruction.videoUrl}
                className="max-w-md"
              />
              
              {/* 動画URL入力（代替） */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  または動画URL
                </label>
                <input
                  type="url"
                  value={instruction.videoUrl || ''}
                  onChange={(e) => updateInstruction(index, 'videoUrl', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
            </div>

            {/* プレビュー */}
            {instruction.videoFile && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  アップロード済み動画
                </label>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{instruction.videoFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {Math.round(instruction.videoFile.size / (1024 * 1024))}MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
