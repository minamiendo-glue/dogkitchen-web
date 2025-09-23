'use client';

import { useState } from 'react';
import { VideoPlayer } from './video-player';

interface VideoItem {
  src: string;
  title: string;
  poster?: string;
  thumbnail?: string;
}

interface VideoGalleryProps {
  videos: VideoItem[];
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  aspectRatio?: '16:9' | '1:1' | '4:3' | 'auto';
}

export function VideoGallery({ 
  videos, 
  className = '', 
  autoPlay = false, 
  muted = true, 
  loop = false,
  aspectRatio = '1:1'
}: VideoGalleryProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentVideo = videos[currentVideoIndex];

  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const selectVideo = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
  };

  const nextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">動画がありません</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg overflow-hidden ${className}`}>
      {/* メイン動画プレーヤー */}
      <div className="relative">
        <VideoPlayer
          src={currentVideo.src}
          title={currentVideo.title}
          poster={currentVideo.poster}
          className="w-full"
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          aspectRatio={aspectRatio}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleVideoEnd}
        />

        {/* ナビゲーションボタン */}
        {videos.length > 1 && (
          <>
            {/* 前の動画ボタン */}
            {currentVideoIndex > 0 && (
              <button
                onClick={prevVideo}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all duration-200"
                aria-label="前の動画"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
            )}

            {/* 次の動画ボタン */}
            {currentVideoIndex < videos.length - 1 && (
              <button
                onClick={nextVideo}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all duration-200"
                aria-label="次の動画"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            )}
          </>
        )}

        {/* 動画インディケーター */}
        {videos.length > 1 && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
            {currentVideoIndex + 1} / {videos.length}
          </div>
        )}
      </div>

      {/* サムネイル一覧 */}
      {videos.length > 1 && (
        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex gap-3 overflow-x-auto">
            {videos.map((video, index) => (
              <button
                key={index}
                onClick={() => selectVideo(index)}
                className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-300 group ${
                  index === currentVideoIndex
                    ? 'ring-2 ring-red-500 scale-105 shadow-lg'
                    : 'hover:scale-105 hover:shadow-md'
                }`}
                style={{ width: '100px', height: '56px' }}
              >
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                )}
                
                {/* 再生中インジケーター */}
                {index === currentVideoIndex && isPlaying && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* ホバー時の再生アイコン */}
                {index !== currentVideoIndex && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                    <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                )}

                {/* 動画番号 */}
                <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 動画情報 */}
      {videos.length > 1 && (
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
              動画 {currentVideoIndex + 1} / {videos.length}
            </span>
            {isPlaying && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                再生中
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
