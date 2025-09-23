import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 環境変数の存在確認（値は表示しない）
    const envCheck = {
      // R2設定
      R2_ACCOUNT_ID: !!process.env.R2_ACCOUNT_ID,
      R2_ACCESS_KEY_ID: !!process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: !!process.env.R2_SECRET_ACCESS_KEY,
      R2_BUCKET_NAME: !!process.env.R2_BUCKET_NAME,
      R2_PUBLIC_URL: !!process.env.R2_PUBLIC_URL,
      
      // Cloudflare Stream設定
      CLOUDFLARE_ACCOUNT_ID: !!process.env.CLOUDFLARE_ACCOUNT_ID,
      NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID: !!process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID,
      CLOUDFLARE_STREAM_API_TOKEN: !!process.env.CLOUDFLARE_STREAM_API_TOKEN,
      
      // Supabase設定
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    // 設定値の一部を表示（機密情報は除く）
    const configValues = {
      R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
      R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
      NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    };

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      envCheck,
      configValues,
      missingVars: Object.entries(envCheck)
        .filter(([key, exists]) => !exists)
        .map(([key]) => key)
    });

  } catch (error) {
    console.error('Environment debug error:', error);
    return NextResponse.json(
      { error: '環境変数の確認中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
