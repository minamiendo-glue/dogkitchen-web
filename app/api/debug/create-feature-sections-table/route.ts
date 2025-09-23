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

    // feature_sectionsテーブルを作成
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS feature_sections (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        recipe_ids JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_feature_sections_feature_id ON feature_sections(feature_id);
      CREATE INDEX IF NOT EXISTS idx_feature_sections_display_order ON feature_sections(display_order);
      
      ALTER TABLE feature_sections ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "特集小項目は誰でも閲覧可能" ON feature_sections FOR SELECT USING (true);
      CREATE POLICY "特集小項目の管理は全ユーザーに許可" ON feature_sections FOR ALL USING (true);
      
      CREATE TRIGGER update_feature_sections_updated_at
        BEFORE UPDATE ON feature_sections
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;

    const { error } = await supabaseAdmin.rpc('exec_sql', { sql: createTableSQL });

    if (error) {
      console.error('テーブル作成エラー:', error);
      return NextResponse.json(
        { error: 'テーブルの作成に失敗しました', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'feature_sectionsテーブルが正常に作成されました'
    });

  } catch (error) {
    console.error('テーブル作成エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
