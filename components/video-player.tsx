'use client';

import { useState, useRef, useEffect } from 'react';
import { convertR2ImageUrl } from '@/lib/utils/image-url';

interface VideoPlayerProps {
  src: string;
  title: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playbackRate?: number;
  aspectRatio?: '16:9' | '1:1' | '4:3' | 'auto';
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export function VideoPlayer({ 
  src, 
  title, 
  poster, 
  className = '', 
  autoPlay = false, 
  muted = true, 
  loop = false,
  playbackRate = 1,
  aspectRatio = '1:1',
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPlaybackRate, setCurrentPlaybackRate] = useState(playbackRate);
  const [showPlaybackRateMenu, setShowPlaybackRateMenu] = useState(false);

  // Cloudflare Streamのiframe URLかどうかを判定
  const isCloudflareStream = src.includes('cloudflarestream.com') || src.includes('iframe') || src.includes('customer-');

  // 動画の読み込み完了
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded');
      setDuration(video.duration);
      setIsLoading(false);
      
      // 動画のサイズを強制的に設定
      if (video) {
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.objectPosition = 'center';
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime, video.duration);
    };

    const handlePlay = () => {
      console.log('Video play event triggered');
      setIsPlaying(true);
      onPlay?.();
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };
    const handleError = (e: Event) => {
      const video = e.target as HTMLVideoElement;
      const error = video.error;
      let message = '動画の読み込みに失敗しました';
      
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            message = '動画の読み込みが中断されました';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            message = 'ネットワークエラーが発生しました';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            message = '動画のデコードに失敗しました';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            message = '動画形式がサポートされていません';
            break;
          default:
            message = `動画エラー (コード: ${error.code})`;
        }
      }
      
      setErrorMessage(message);
      setHasError(true);
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, []);


  // 再生速度メニューの外側クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPlaybackRateMenu) {
        setShowPlaybackRateMenu(false);
      }
    };

    if (showPlaybackRateMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPlaybackRateMenu]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video || e.target !== video && !video.contains(e.target as Node)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          video.volume = Math.min(1, video.volume + 0.1);
          setVolume(video.volume);
          break;
        case 'ArrowDown':
          e.preventDefault();
          video.volume = Math.max(0, video.volume - 0.1);
          setVolume(video.volume);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };


  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = rate;
    setCurrentPlaybackRate(rate);
    setShowPlaybackRateMenu(false);
  };

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // アスペクト比に応じたクラス名を取得
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9':
        return 'aspect-video';
      case '1:1':
        return 'aspect-square';
      case '4:3':
        return 'aspect-[4/3]';
      case 'auto':
        return 'aspect-auto';
      default:
        return 'aspect-square';
    }
  };

  // エラー状態の表示
  if (hasError) {
    return (
      <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
        <div className={getAspectRatioClass()}>
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-center text-gray-600 p-4">
              <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-lg font-medium text-red-600 mb-2">{errorMessage}</p>
              <p className="text-sm text-gray-500 mb-2">{title}</p>
              <p className="text-xs text-gray-400">動画URL: {src}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cloudflare Streamのiframe URLの場合はiframeを表示
  if (isCloudflareStream) {
    return (
      <div className={`relative bg-black rounded-lg overflow-hidden group ${className}`}>
        <div 
          className={`${getAspectRatioClass()} w-full`}
          style={{
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <iframe
            src={src}
            title={title}
            className="w-full h-full"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
            onError={() => {
              setHasError(true);
              setErrorMessage('動画の読み込みに失敗しました');
            }}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
          
          
          {/* エラー時のフォールバック */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-600 p-4">
                <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-lg font-medium text-red-600 mb-2">{errorMessage}</p>
                <p className="text-sm text-gray-500 mb-2">{title}</p>
                <p className="text-xs text-gray-400">動画URL: {src}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      {/* アスペクト比に応じたコンテナ */}
      <div 
        className={`${getAspectRatioClass()} w-full`}
        style={{
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster ? convertR2ImageUrl(poster) : undefined}
          className="w-full h-full object-cover"
          muted={true}
          loop={loop}
          playsInline
          preload="auto"
          aria-label={title}
          role="application"
          tabIndex={0}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />


        {/* ローディング表示 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-sm">読み込み中...</p>
            </div>
          </div>
        )}

        {/* 中央の再生ボタン */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
              aria-label={isPlaying ? '一時停止' : '再生'}
            >
              <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}


        {/* タイトル表示 */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            <p className="text-sm font-medium">{title}</p>
          </div>
        </div>

      </div>

      {/* カスタムスライダーのスタイル */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(239, 68, 68, 0.2);
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(239, 68, 68, 0.3);
        }
        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(239, 68, 68, 0.2);
          transition: all 0.2s ease;
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(239, 68, 68, 0.3);
        }
        
        /* 動画サイズの統一 */
        video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center !important;
          display: block;
        }
        
        /* ポスター画像と動画のサイズ統一 */
        video[poster] {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      `}</style>
    </div>
  );
}
