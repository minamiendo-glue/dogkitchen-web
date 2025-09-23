import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareStream } from '@/lib/cloudflare-stream';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    
    if (!videoId) {
      return NextResponse.json(
        { error: '動画IDが必要です' },
        { status: 400 }
      );
    }

    // 環境変数の事前チェック
    const requiredEnvVars = ['CLOUDFLARE_STREAM_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      return NextResponse.json(
        { 
          error: 'Stream API設定が不完全です',
          missingVars: missingVars
        },
        { status: 500 }
      );
    }

    // Cloudflare Streamから動画情報を取得
    const stream = getCloudflareStream();
    const videoInfo = await stream.getVideo(videoId);
    
    // 処理状況をチェック
    const progress = await stream.checkUploadProgress(videoId);

    return NextResponse.json({
      success: true,
      video: {
        id: videoInfo.uid,
        readyToStream: videoInfo.readyToStream,
        status: videoInfo.status,
        thumbnail: videoInfo.thumbnail,
        duration: videoInfo.duration,
        playbackUrl: stream.getPlaybackUrl(videoInfo.uid),
        iframeUrl: stream.getPlaybackUrl(videoInfo.uid, 'iframe'),
        progress: progress
      }
    });

  } catch (error) {
    console.error('Cloudflare Stream status check error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '動画の状態確認に失敗しました'
      },
      { status: 500 }
    );
  }
}
