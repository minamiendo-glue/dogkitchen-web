import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // テスト用の設定データ
    const testSettings = {
      siteName: 'DOG KITCHEN',
      siteDescription: '愛犬のためのヘルシーレシピサイト',
      maintenanceMode: false,
      maintenanceMessage: '現在メンテナンス中です。しばらくお待ちください。',
      maxFileSize: 10,
      maxVideoSize: 500,
      sessionTimeout: 30,
      loginAttempts: 5,
      enableTwoFactor: false,
      enableIpRestriction: false,
      allowedIps: [],
      featuredVideo: {
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      }
    };

    // 設定を保存（upsert）
    const { data, error } = await supabaseAdmin
      .from('admin_settings')
      .upsert({
        key: 'system_settings',
        value: testSettings
      })
      .select()
      .single();

    if (error) {
      console.error('Test save error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: '設定の保存に失敗しました', 
          details: error.message,
          code: error.code
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '設定の保存テストが成功しました',
      data: data
    });

  } catch (error) {
    console.error('Test save API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '設定の保存テストに失敗しました',
        details: error
      },
      { status: 500 }
    );
  }
}
















