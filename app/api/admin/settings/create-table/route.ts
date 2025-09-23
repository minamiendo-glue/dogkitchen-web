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

    // admin_settingsテーブルが既に存在するかチェック
    const { data: tableExists, error: tableError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'admin_settings')
      .single();

    if (tableExists) {
      return NextResponse.json({
        success: true,
        message: 'admin_settingsテーブルは既に存在します'
      });
    }

    // テーブル作成SQL
    const createTableSQL = `
      -- 管理設定テーブルの作成
      CREATE TABLE IF NOT EXISTS admin_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- 更新日時を自動更新するトリガー関数
      CREATE OR REPLACE FUNCTION update_admin_settings_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- トリガーの作成
      DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON admin_settings;
      CREATE TRIGGER update_admin_settings_updated_at
        BEFORE UPDATE ON admin_settings
        FOR EACH ROW
        EXECUTE FUNCTION update_admin_settings_updated_at();

      -- 初期設定データを挿入
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

    // テーブル作成を個別のクエリで実行
    try {
      // 1. テーブル作成
      const { error: createError } = await supabaseAdmin
        .from('admin_settings')
        .select('*')
        .limit(0); // テーブルが存在しない場合はエラーになる

      if (createError && createError.code === 'PGRST116') {
        // テーブルが存在しない場合、手動で作成する必要があります
        return NextResponse.json({
          success: false,
          message: 'テーブルが存在しません。Supabaseの管理画面でSQLを実行してください。',
          sql: createTableSQL
        });
      }

      // テーブルが既に存在する場合
      return NextResponse.json({
        success: true,
        message: 'admin_settingsテーブルは既に存在します'
      });

    } catch (error) {
      console.error('Table check error:', error);
      return NextResponse.json({
        success: false,
        message: 'テーブルの確認に失敗しました。Supabaseの管理画面でSQLを実行してください。',
        sql: createTableSQL
      });
    }

  } catch (error) {
    console.error('Table creation API error:', error);
    return NextResponse.json(
      { error: 'テーブルの作成に失敗しました' },
      { status: 500 }
    );
  }
}
