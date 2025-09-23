'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { convertR2ImageUrl } from '@/lib/utils/image-url';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fallbackComponent?: React.ReactNode;
}

export function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  className = '',
  priority = false,
  fallbackComponent
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // R2のURLを新しいパブリック開発URLに変換
  const convertedSrc = convertR2ImageUrl(src);

  // 画像の読み込み状態を監視
  useEffect(() => {
    const img = new window.Image();
    
    const handleLoad = () => {
      setIsLoading(false);
    };
    
    const handleError = () => {
      console.warn(`画像の読み込みに失敗しました: ${convertedSrc}`);
      setHasError(true);
      setIsLoading(false);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = convertedSrc;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [convertedSrc]);

  // エラーが発生した場合のフォールバック
  const defaultFallback = (
    <div className={`w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="text-4xl mb-2">🍽️</div>
        <div className="text-gray-500 text-sm font-medium">画像を読み込めません</div>
      </div>
    </div>
  );

  // エラーが発生した場合
  if (hasError) {
    return <>{fallbackComponent || defaultFallback}</>;
  }

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className={`w-full h-full bg-gray-100 animate-pulse flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  return (
    <Image
      src={convertedSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
