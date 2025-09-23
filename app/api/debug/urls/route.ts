import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'image' or 'video'
    const id = searchParams.get('id');
    
    if (!type || !id) {
      return NextResponse.json(
        { error: 'type と id パラメータが必要です' },
        { status: 400 }
      );
    }

    let url = '';
    let debugInfo = {};

    if (type === 'image') {
      // R2画像URLの生成
      const r2PublicUrl = process.env.R2_PUBLIC_URL;
      const r2AccountId = process.env.R2_ACCOUNT_ID;
      const r2BucketName = process.env.R2_BUCKET_NAME;
      
      url = `${r2PublicUrl}/${id}`;
      
      debugInfo = {
        r2PublicUrl,
        r2AccountId,
        r2BucketName,
        generatedUrl: url,
        envVars: {
          R2_PUBLIC_URL: !!r2PublicUrl,
          R2_ACCOUNT_ID: !!r2AccountId,
          R2_BUCKET_NAME: !!r2BucketName,
          R2_ACCESS_KEY_ID: !!process.env.R2_ACCESS_KEY_ID,
          R2_SECRET_ACCESS_KEY: !!process.env.R2_SECRET_ACCESS_KEY
        }
      };
    } else if (type === 'video') {
      // Cloudflare Stream動画URLの生成
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      const publicAccountId = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
      
      url = `https://customer-${accountId || publicAccountId}.cloudflarestream.com/${id}/iframe`;
      
      debugInfo = {
        accountId,
        publicAccountId,
        usedAccountId: accountId || publicAccountId,
        generatedUrl: url,
        envVars: {
          CLOUDFLARE_ACCOUNT_ID: !!accountId,
          NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID: !!publicAccountId,
          CLOUDFLARE_STREAM_API_TOKEN: !!process.env.CLOUDFLARE_STREAM_API_TOKEN
        }
      };
    }

    return NextResponse.json({
      success: true,
      type,
      id,
      url,
      debugInfo
    });

  } catch (error) {
    console.error('URL debug error:', error);
    return NextResponse.json(
      { error: 'URL生成エラーが発生しました' },
      { status: 500 }
    );
  }
}
