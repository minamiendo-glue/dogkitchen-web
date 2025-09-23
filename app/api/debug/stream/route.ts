import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareStream } from '@/lib/cloudflare-stream';

export async function GET(request: NextRequest) {
  try {
    const stream = getCloudflareStream();
    
    // アカウント情報の取得
    const accountInfo = await stream.getAccount();
    
    // 動画一覧の取得
    const videoList = await stream.listVideos();
    
    // 権限の確認
    const hasStreamPermission = accountInfo && videoList !== null;
    
    return NextResponse.json({
      success: true,
      accountInfo: {
        id: accountInfo?.id,
        name: accountInfo?.name,
        hasStreamPermission
      },
      videoCount: videoList?.videos?.length || 0,
      videos: videoList?.videos?.slice(0, 5) || [], // 最初の5件のみ表示
      permissions: {
        stream: hasStreamPermission ? '✅ あり' : '❌ なし'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Stream API debug error:', error);
    
    // エラーの詳細を分析
    let errorType = 'unknown';
    let errorMessage = '不明なエラー';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorType = 'unauthorized';
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        errorType = 'forbidden';
      } else if (error.message.includes('404') || error.message.includes('Not Found')) {
        errorType = 'not_found';
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      errorType,
      permissions: {
        stream: '❌ なし'
      },
      suggestions: {
        unauthorized: 'APIトークンの権限を確認してください',
        forbidden: 'Cloudflare Stream:Edit権限が必要です',
        not_found: 'アカウントIDまたはエンドポイントを確認してください',
        unknown: 'Cloudflareダッシュボードで設定を確認してください'
      }[errorType] || '設定を確認してください'
    }, { status: 500 });
  }
}
