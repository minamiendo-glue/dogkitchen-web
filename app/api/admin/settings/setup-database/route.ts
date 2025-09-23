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

    // テーブル作成のSQL
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS admin_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // トリガー関数作成のSQL
    const createTriggerFunctionSQL = `
      CREATE OR REPLACE FUNCTION update_admin_settings_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    // トリガー作成のSQL
    const createTriggerSQL = `
      DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON admin_settings;
      CREATE TRIGGER update_admin_settings_updated_at
        BEFORE UPDATE ON admin_settings
        FOR EACH ROW
        EXECUTE FUNCTION update_admin_settings_updated_at();
    `;

    // 初期データ挿入のSQL
    const insertInitialDataSQL = `
      INSERT INTO admin_settings (key, value) VALUES 
      ('system_settings', '{
        "siteName": "DOG KITCHEN",
        "siteDescription": "愛犬のためのヘルシーレシピサイト",
        "maintenanceMode": false,
        "maintenanceMessage": "現在メンテナンス中です。しばらくお待ちください。",
        "maxFileSize": 10,
        "maxVideoSize": 500,
        "sessionTimeout": 30,
        "loginAttempts": 5,
        "enableTwoFactor": false,
        "enableIpRestriction": false,
        "allowedIps": [],
        "featuredVideo": {
          "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
      }'::jsonb)
      ON CONFLICT (key) DO NOTHING;
    `;

    // テーブルが既に存在するかチェック
    const { data: existingData, error: checkError } = await supabaseAdmin
      .from('admin_settings')
      .select('id')
      .limit(1);

    if (existingData && existingData.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'admin_settingsテーブルは既に存在し、データも設定されています'
      });
    }

    // テーブルが存在しない場合、手動で作成する必要があることを通知
    return NextResponse.json({
      success: false,
      message: 'admin_settingsテーブルが存在しません。以下のSQLをSupabaseの管理画面で実行してください：',
      sql: {
        createTable: createTableSQL,
        createTriggerFunction: createTriggerFunctionSQL,
        createTrigger: createTriggerSQL,
        insertData: insertInitialDataSQL
      },
      instructions: [
        '1. Supabase Dashboard (https://supabase.com/dashboard) にアクセス',
        '2. プロジェクトを選択',
        '3. 左サイドバーの「SQL Editor」をクリック',
        '4. 上記のSQLを順番に実行',
        '5. 実行後、このAPIを再度呼び出して確認'
      ]
    });

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      { error: 'データベースセットアップに失敗しました', details: error },
      { status: 500 }
    );
  }
}









