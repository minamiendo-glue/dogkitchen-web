import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const envVars = {
      // Supabase
      SUPABASE_URL: {
        value: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasValue: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0
      },
      SUPABASE_ANON_KEY: {
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasValue: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
      },
      SUPABASE_SERVICE_ROLE_KEY: {
        value: process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasValue: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
      },
      
      // Cloudflare
      CLOUDFLARE_ACCOUNT_ID: {
        value: process.env.CLOUDFLARE_ACCOUNT_ID,
        hasValue: !!process.env.CLOUDFLARE_ACCOUNT_ID,
        length: process.env.CLOUDFLARE_ACCOUNT_ID?.length || 0
      },
      CLOUDFLARE_API_TOKEN: {
        value: process.env.CLOUDFLARE_API_TOKEN,
        hasValue: !!process.env.CLOUDFLARE_API_TOKEN,
        length: process.env.CLOUDFLARE_API_TOKEN?.length || 0
      },
      CLOUDFLARE_EMAIL: {
        value: process.env.CLOUDFLARE_EMAIL,
        hasValue: !!process.env.CLOUDFLARE_EMAIL,
        length: process.env.CLOUDFLARE_EMAIL?.length || 0
      },
      CLOUDFLARE_STREAM_API_TOKEN: {
        value: process.env.CLOUDFLARE_STREAM_API_TOKEN,
        hasValue: !!process.env.CLOUDFLARE_STREAM_API_TOKEN,
        length: process.env.CLOUDFLARE_STREAM_API_TOKEN?.length || 0
      },
      
      // R2
      R2_ACCOUNT_ID: {
        value: process.env.R2_ACCOUNT_ID,
        hasValue: !!process.env.R2_ACCOUNT_ID,
        length: process.env.R2_ACCOUNT_ID?.length || 0
      },
      R2_ACCESS_KEY_ID: {
        value: process.env.R2_ACCESS_KEY_ID,
        hasValue: !!process.env.R2_ACCESS_KEY_ID,
        length: process.env.R2_ACCESS_KEY_ID?.length || 0
      },
      R2_SECRET_ACCESS_KEY: {
        value: process.env.R2_SECRET_ACCESS_KEY,
        hasValue: !!process.env.R2_SECRET_ACCESS_KEY,
        length: process.env.R2_SECRET_ACCESS_KEY?.length || 0
      },
      R2_BUCKET_NAME: {
        value: process.env.R2_BUCKET_NAME,
        hasValue: !!process.env.R2_BUCKET_NAME,
        length: process.env.R2_BUCKET_NAME?.length || 0
      },
      R2_PUBLIC_URL: {
        value: process.env.R2_PUBLIC_URL,
        hasValue: !!process.env.R2_PUBLIC_URL,
        length: process.env.R2_PUBLIC_URL?.length || 0
      },
      
      // Admin
      ADMIN_JWT_SECRET: {
        value: process.env.ADMIN_JWT_SECRET,
        hasValue: !!process.env.ADMIN_JWT_SECRET,
        length: process.env.ADMIN_JWT_SECRET?.length || 0
      },
      ADMIN_USERNAME: {
        value: process.env.ADMIN_USERNAME,
        hasValue: !!process.env.ADMIN_USERNAME,
        length: process.env.ADMIN_USERNAME?.length || 0
      },
      ADMIN_PASSWORD_HASH: {
        value: process.env.ADMIN_PASSWORD_HASH,
        hasValue: !!process.env.ADMIN_PASSWORD_HASH,
        length: process.env.ADMIN_PASSWORD_HASH?.length || 0
      }
    };

    // セキュリティのため、実際の値は表示しない
    const safeEnvVars = Object.entries(envVars).reduce((acc, [key, value]) => {
      acc[key] = {
        hasValue: value.hasValue,
        length: value.length,
        prefix: value.value ? value.value.substring(0, 10) + '...' : 'Not set'
      };
      return acc;
    }, {} as any);

    return NextResponse.json({
      success: true,
      environment: safeEnvVars,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Environment check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

















