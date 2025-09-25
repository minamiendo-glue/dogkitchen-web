import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCloudflareStream } from '@/lib/cloudflare-stream';
import { validateR2Config } from '@/lib/cloudflare-r2';

export async function GET() {
  try {
    const serviceStatus = {
      supabase: {
        connected: false,
        status: '',
        details: null
      },
      cloudflare: {
        r2: {
          connected: false,
          status: '',
          details: null
        },
        stream: {
          connected: false,
          status: '',
          details: null
        }
      }
    };

    // Supabase接続確認
    try {
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('recipes')
          .select('count')
          .limit(1);

        if (!error) {
          serviceStatus.supabase.connected = true;
          serviceStatus.supabase.status = 'データベース接続正常';
          serviceStatus.supabase.details = {
            connection: 'OK',
            query: 'OK'
          };
        } else {
          serviceStatus.supabase.status = `データベース接続エラー: ${error.message}`;
          serviceStatus.supabase.details = { error: error.message };
        }
      } else {
        serviceStatus.supabase.status = 'Supabase Adminクライアントが初期化されていません';
      }
    } catch (error) {
      serviceStatus.supabase.status = `Supabase接続エラー: ${error instanceof Error ? error.message : '不明なエラー'}`;
      serviceStatus.supabase.details = { error: error instanceof Error ? error.message : '不明なエラー' };
    }

    // Cloudflare R2接続確認
    try {
      validateR2Config();
      serviceStatus.cloudflare.r2.connected = true;
      serviceStatus.cloudflare.r2.status = 'R2設定正常';
      serviceStatus.cloudflare.r2.details = {
        config: 'OK',
        bucket: process.env.R2_BUCKET_NAME || '未設定',
        publicUrl: process.env.R2_PUBLIC_URL || '未設定'
      };
    } catch (error) {
      serviceStatus.cloudflare.r2.status = `R2設定エラー: ${error instanceof Error ? error.message : '不明なエラー'}`;
      serviceStatus.cloudflare.r2.details = { error: error instanceof Error ? error.message : '不明なエラー' };
    }

    // Cloudflare Stream接続確認
    try {
      const stream = getCloudflareStream();
      const accountInfo = await stream.getAccount();
      
      if (accountInfo) {
        serviceStatus.cloudflare.stream.connected = true;
        serviceStatus.cloudflare.stream.status = 'Stream API接続正常';
        serviceStatus.cloudflare.stream.details = {
          connection: 'OK',
          accountId: accountInfo.id,
          accountName: accountInfo.name
        };
      } else {
        serviceStatus.cloudflare.stream.status = 'Stream API接続エラー: アカウント情報を取得できません';
      }
    } catch (error) {
      serviceStatus.cloudflare.stream.status = `Stream API接続エラー: ${error instanceof Error ? error.message : '不明なエラー'}`;
      serviceStatus.cloudflare.stream.details = { error: error instanceof Error ? error.message : '不明なエラー' };
    }

    return NextResponse.json({
      success: true,
      ...serviceStatus
    });
  } catch (error) {
    console.error('Service status check error:', error);
    return NextResponse.json(
      { error: 'サービス状態の確認に失敗しました' },
      { status: 500 }
    );
  }
}














