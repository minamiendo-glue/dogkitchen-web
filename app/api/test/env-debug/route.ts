import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 環境変数の詳細情報を取得（セキュリティを考慮して一部のみ表示）
    const envInfo = {
      // Cloudflare関連
      CLOUDFLARE_STREAM_API_TOKEN: {
        exists: !!process.env.CLOUDFLARE_STREAM_API_TOKEN,
        length: process.env.CLOUDFLARE_STREAM_API_TOKEN?.length || 0,
        prefix: process.env.CLOUDFLARE_STREAM_API_TOKEN?.substring(0, 10) + '...',
        suffix: '...' + process.env.CLOUDFLARE_STREAM_API_TOKEN?.substring((process.env.CLOUDFLARE_STREAM_API_TOKEN?.length || 0) - 10),
        format: process.env.CLOUDFLARE_STREAM_API_TOKEN?.startsWith('Bearer ') ? 'Bearer format' : 
                process.env.CLOUDFLARE_STREAM_API_TOKEN?.startsWith('Token ') ? 'Token format' : 
                process.env.CLOUDFLARE_STREAM_API_TOKEN?.includes('-') ? 'Custom format' : 'Unknown format'
      },
      CLOUDFLARE_ACCOUNT_ID: {
        exists: !!process.env.CLOUDFLARE_ACCOUNT_ID,
        length: process.env.CLOUDFLARE_ACCOUNT_ID?.length || 0,
        value: process.env.CLOUDFLARE_ACCOUNT_ID?.substring(0, 10) + '...'
      },
      CLOUDFLARE_EMAIL: {
        exists: !!process.env.CLOUDFLARE_EMAIL,
        length: process.env.CLOUDFLARE_EMAIL?.length || 0,
        value: process.env.CLOUDFLARE_EMAIL?.substring(0, 10) + '...'
      },
      
      // その他の環境変数
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      
      // すべてのCloudflare関連環境変数
      allCloudflareKeys: Object.keys(process.env).filter(key => key.includes('CLOUDFLARE')),
      allR2Keys: Object.keys(process.env).filter(key => key.startsWith('R2_')),
      
      // 環境変数の総数
      totalEnvVars: Object.keys(process.env).length
    };

    return NextResponse.json({
      success: true,
      message: '環境変数デバッグ情報',
      envInfo: envInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Environment debug failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}


















