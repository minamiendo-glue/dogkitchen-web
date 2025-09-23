'use client';

import { useState, useRef } from 'react';
import { VideoPreview } from '@/components/cloudflare-video-player';

interface VideoUploadProps {
  label: string;
  type: 'main' | 'instruction';
  onVideoUploaded: (videoData: {
    id: string;
    playbackUrl: string;
    iframeUrl: string;
    thumbnail: string;
    duration: number;
  }) => void;
  onError: (error: string) => void;
  className?: string;
}

export function VideoUpload({ 
  label, 
  type, 
  onVideoUploaded, 
  onError, 
  className = '' 
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState<{
    id: string;
    playbackUrl: string;
    iframeUrl: string;
    thumbnail: string;
    duration: number;
    readyToStream: boolean;
  } | null>(null);
  const [processingVideo, setProcessingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 動画の処理状況をチェックする関数
  const checkVideoStatus = async (videoId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/cloudflare/stream/status?videoId=${videoId}`);
      const result = await response.json();
      
      if (result.success && result.video) {
        const video = result.video;
        setUploadedVideo(prev => prev ? {
          ...prev,
          readyToStream: video.readyToStream,
          thumbnail: video.thumbnail,
          playbackUrl: video.playbackUrl,
          iframeUrl: video.iframeUrl
        } : null);
        
        return video.readyToStream;
      }
      return false;
    } catch (error) {
      console.error('Video status check error:', error);
      return false;
    }
  };

  // 動画の処理完了を待つ関数
  const waitForVideoProcessing = async (videoId: string) => {
    setProcessingVideo(true);
    
    const maxAttempts = 30; // 最大30回（5分間）
    let attempts = 0;
    
    const checkInterval = setInterval(async () => {
      attempts++;
      const isReady = await checkVideoStatus(videoId);
      
      if (isReady) {
        clearInterval(checkInterval);
        setProcessingVideo(false);
        console.log('Video processing completed');
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        setProcessingVideo(false);
        onError('動画の処理がタイムアウトしました。しばらく時間をおいて再度お試しください。');
      }
    }, 10000); // 10秒間隔でチェック
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイル形式の検証（MIMEタイプと拡張子の両方をチェック）
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const supportedExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'flv', '3gp', '3gpp', 'asf', 'mkv', 'ogv', 'ogg', 'm4v', 'mpeg', 'mpg', 'mpe', 'qt'];
    
    if (!file.type.startsWith('video/') && !supportedExtensions.includes(fileExtension || '')) {
      onError('動画ファイルのみアップロード可能です。対応形式: MP4, WebM, MOV, AVI, WMV, FLV, 3GP, ASF, MKV, OGV, M4V, MPEG等');
      return;
    }

    // ファイルサイズの検証
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      onError('ファイルサイズが大きすぎます。最大500MBまでです。');
      return;
    }

    await uploadVideo(file);
  };

  const uploadVideo = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // 進捗をシミュレート（実際のAPIでは進捗を取得できないため）
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      const response = await fetch('/api/cloudflare/stream/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('Stream upload error response:', errorData);
          errorMessage = errorData.error || errorMessage;
          if (errorData.missingVars) {
            errorMessage += ` (不足している環境変数: ${errorData.missingVars.join(', ')})`;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Stream upload success response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'アップロードに失敗しました');
      }

      const videoData = {
        id: result.video.id,
        playbackUrl: result.video.playbackUrl,
        iframeUrl: result.video.iframeUrl,
        thumbnail: result.video.thumbnail,
        duration: result.video.duration,
        readyToStream: result.video.readyToStream
      };

      setUploadedVideo(videoData);
      
      // 動画がまだ処理中の場合は、処理完了を待つ
      if (!result.video.readyToStream) {
        console.log('Video uploaded but not ready yet, waiting for processing...');
        waitForVideoProcessing(result.video.id);
      }
      
      onVideoUploaded(videoData);

    } catch (error) {
      console.error('Video upload error:', error);
      onError(error instanceof Error ? error.message : 'アップロードに失敗しました');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        uploadVideo(file);
      } else {
        onError('動画ファイルのみアップロード可能です');
      }
    }
  };

  const removeVideo = () => {
    setUploadedVideo(null);
    setProcessingVideo(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {uploadedVideo ? (
        <div className="space-y-3">
          <div className="relative">
            {uploadedVideo.readyToStream ? (
              <VideoPreview
                videoId={uploadedVideo.id}
                accountId={process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || ''}
                thumbnailUrl={uploadedVideo.thumbnail}
                width="100%"
                height="200px"
                className="rounded-lg border border-gray-300"
              />
            ) : (
              <div className="w-full h-[200px] bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                  <p className="text-sm text-gray-600">動画を処理中...</p>
                  <p className="text-xs text-gray-500">しばらくお待ちください</p>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={removeVideo}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <p>動画ID: {uploadedVideo.id}</p>
            <p>再生時間: {Math.round(uploadedVideo.duration)}秒</p>
            <p className={`text-xs ${uploadedVideo.readyToStream ? 'text-green-600' : 'text-yellow-600'}`}>
              状態: {uploadedVideo.readyToStream ? '✅ 再生可能' : '⏳ 処理中'}
            </p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center hover:border-red-400 transition-colors ${
            uploading ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
              <p className="text-sm text-gray-600">アップロード中...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{Math.round(uploadProgress)}%</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-4xl text-gray-400">📹</div>
              <p className="text-sm text-gray-600">
                動画ファイルをドラッグ&ドロップまたは
                <span className="text-red-500 font-medium">クリックして選択</span>
              </p>
              <p className="text-xs text-gray-500">
                対応形式: MP4, WebM, MOV, AVI, WMV, FLV, 3GP, ASF, MKV, OGV, M4V, MPEG等<br />
                最大ファイルサイズ: 500MB<br />
                最大動画時間: {type === 'main' ? '10分' : '5分'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
