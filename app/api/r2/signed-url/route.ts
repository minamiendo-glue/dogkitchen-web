import { NextRequest, NextResponse } from 'next/server';
import { getSignedUrlForR2 } from '@/lib/cloudflare-r2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const expiresIn = parseInt(searchParams.get('expiresIn') || '3600'); // デフォルト1時間

    if (!key) {
      return NextResponse.json({
        success: false,
        error: 'keyパラメータが必要です'
      }, { status: 400 });
    }

    // 署名付きURLを生成
    const signedUrl = await getSignedUrlForR2(key, expiresIn);
    
    return NextResponse.json({
      success: true,
      signedUrl: signedUrl,
      expiresIn: expiresIn,
      key: key
    });

  } catch (error: any) {
    console.error('Signed URL generation failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || '署名付きURLの生成に失敗しました'
    }, { status: 500 });
  }
}
