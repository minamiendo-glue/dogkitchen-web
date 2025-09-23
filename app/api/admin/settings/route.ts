import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// デフォルト設定
const DEFAULT_SETTINGS = {
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
  },
  aboutVideo: {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "DOG KITCHEN コンセプト動画"
  }
};

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // admin_settingsテーブルが存在するかチェック（直接クエリで確認）
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('admin_settings')
      .select('value')
      .eq('key', 'system_settings')
      .single();

    if (settingsError) {
      // テーブルが存在しないか、データがない場合はデフォルト設定を返す
      console.log('admin_settingsテーブルが存在しないか、データがありません。デフォルト設定を返します。', settingsError.message);
      return NextResponse.json({
        success: true,
        settings: DEFAULT_SETTINGS
      });
    }

    return NextResponse.json({
      success: true,
      settings: settings?.value || DEFAULT_SETTINGS
    });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      { error: '設定の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: '設定データが提供されていません' },
        { status: 400 }
      );
    }

    // 直接テーブルにアクセスして設定を保存

    // 設定を保存（upsert）
    const { data, error } = await supabaseAdmin
      .from('admin_settings')
      .upsert({
        key: 'system_settings',
        value: settings
      }, {
        onConflict: 'key'
      })
      .select()
      .single();

    if (error) {
      console.error('Settings save error:', error);
      // テーブルが存在しない場合のエラーハンドリング
      if (error.code === 'PGRST116' || error.message.includes('relation "admin_settings" does not exist')) {
        console.log('admin_settingsテーブルが存在しません。設定の保存をスキップします。');
        return NextResponse.json({
          success: true,
          message: '設定テーブルが存在しないため、設定の保存をスキップしました',
          settings: DEFAULT_SETTINGS
        });
      }
      return NextResponse.json(
        { error: '設定の保存に失敗しました', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '設定を保存しました',
      settings: data.value
    });
  } catch (error) {
    console.error('Settings save API error:', error);
    return NextResponse.json(
      { error: '設定の保存に失敗しました' },
      { status: 500 }
    );
  }
}