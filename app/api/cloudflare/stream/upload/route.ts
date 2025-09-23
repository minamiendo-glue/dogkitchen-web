import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareStream } from '@/lib/cloudflare-stream';

export async function POST(request: NextRequest) {
  try {
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'main' | 'instruction'
    
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      );
    }

    if (!type || !['main', 'instruction'].includes(type)) {
      return NextResponse.json(
        { error: '無効なファイルタイプです' },
        { status: 400 }
      );
    }

    // ファイル形式の検証
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: '動画ファイルのみアップロード可能です' },
        { status: 400 }
      );
    }

    // ファイルサイズの検証（500MB制限）
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'ファイルサイズが大きすぎます。最大500MBまでです。' },
        { status: 400 }
      );
    }

    // 動画の長さ制限設定
    const maxDurationSeconds = type === 'main' ? 600 : 300; // メイン動画: 10分、手順動画: 5分

    // Cloudflare Streamにアップロード
    const stream = getCloudflareStream();
    const videoResult = await stream.uploadVideo(file, {
      maxDurationSeconds,
      allowedOrigins: ['*'], // 開発環境では全許可、本番では制限
      requireSignedURLs: false // 開発環境では署名不要
    });

    return NextResponse.json({
      success: true,
      video: {
        id: videoResult.uid,
        thumbnail: videoResult.thumbnail,
        playbackUrl: stream.getPlaybackUrl(videoResult.uid),
        iframeUrl: stream.getPlaybackUrl(videoResult.uid, 'iframe'),
        readyToStream: videoResult.readyToStream,
        duration: videoResult.duration,
        meta: videoResult.meta
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Cloudflare Stream upload error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    if (error instanceof Error) {
      // より詳細なエラー情報を返す
      return NextResponse.json(
        { 
          error: error.message,
          details: error.stack,
          type: error.name
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: '動画のアップロードに失敗しました',
        details: String(error)
      },
      { status: 500 }
    );
  }
}
