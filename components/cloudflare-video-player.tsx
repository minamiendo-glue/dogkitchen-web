'use client';

import { useEffect, useRef, useState } from 'react';

interface CloudflareVideoPlayerProps {
  videoId: string;
  accountId: string;
  width?: number | string;
  height?: number | string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  className?: string;
  onReady?: () => void;
  onError?: (error: string) => void;
}

export function CloudflareVideoPlayer({
  videoId,
  accountId,
  width = '100%',
  height = 'auto',
  autoplay = false,
  muted = true,
  controls = true,
  loop = false,
  className = '',
  onReady,
  onError
}: CloudflareVideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoading(false);
      onReady?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.('動画の読み込みに失敗しました');
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [onReady, onError]);

  // パラメータを構築
  const params = new URLSearchParams();
  if (autoplay) params.append('autoplay', 'true');
  if (muted) params.append('muted', 'true');
  if (!controls) params.append('controls', 'false');
  if (loop) params.append('loop', 'true');

  const iframeUrl = `https://customer-${accountId}.cloudflarestream.com/${videoId}/iframe?${params.toString()}`;

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ width, height }}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📹</div>
          <p>動画の読み込みに失敗しました</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
            <p>動画を読み込み中...</p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        width={width}
        height={height}
        frameBorder="0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        className={`rounded-lg ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ width, height }}
      />
    </div>
  );
}

// 軽量な動画プレビューコンポーネント
interface VideoPreviewProps {
  videoId: string;
  accountId: string;
  thumbnailUrl?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  onClick?: () => void;
}

export function VideoPreview({
  videoId,
  accountId,
  thumbnailUrl,
  width = '100%',
  height = '200px',
  className = '',
  onClick
}: VideoPreviewProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  const handleClick = () => {
    setShowPlayer(true);
    onClick?.();
  };

  if (showPlayer) {
    return (
      <CloudflareVideoPlayer
        videoId={videoId}
        accountId={accountId}
        width={width}
        height={height}
        className={className}
        controls={true}
        autoplay={true}
      />
    );
  }

  return (
    <div 
      className={`relative cursor-pointer group ${className}`}
      style={{ width, height }}
      onClick={handleClick}
    >
      {/* サムネイル画像 */}
      <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="動画サムネイル"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">サムネイルなし</span>
          </div>
        )}
        
        {/* 再生ボタンオーバーレイ */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200">
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <svg className="w-8 h-8 text-red-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        {/* 動画アイコン */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          📹 動画
        </div>
      </div>
    </div>
  );
}
