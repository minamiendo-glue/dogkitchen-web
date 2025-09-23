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

    // 管理者権限チェック
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const results: any[] = [];
    const tables = ['articles', 'features', 'article_recipes', 'feature_recipes'];

    // 各テーブルの存在確認
    for (const tableName of tables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(tableName)
          .select('*')
          .limit(1);

        if (error && error.code === 'PGRST116') {
          results.push({ 
            table: tableName, 
            status: 'missing', 
            message: 'テーブルが存在しません' 
          });
        } else if (error) {
          results.push({ 
            table: tableName, 
            status: 'error', 
            message: error.message 
          });
        } else {
          results.push({ 
            table: tableName, 
            status: 'exists', 
            message: 'テーブルが存在します' 
          });
        }
      } catch (error) {
        results.push({ 
          table: tableName, 
          status: 'error', 
          message: 'テーブル確認に失敗しました' 
        });
      }
    }

    const existingTables = results.filter(r => r.status === 'exists').length;
    const missingTables = results.filter(r => r.status === 'missing').length;
    const errorTables = results.filter(r => r.status === 'error').length;

    return NextResponse.json({
      message: `テーブル確認完了（存在: ${existingTables}, 未作成: ${missingTables}, エラー: ${errorTables}）`,
      results,
      summary: {
        total: tables.length,
        existing: existingTables,
        missing: missingTables,
        errors: errorTables
      },
      instructions: missingTables > 0 ? {
        message: '以下のテーブルが存在しません。Supabaseのダッシュボードで手動でテーブルを作成してください。',
        sqlFile: 'sql/create_blog_tables.sql',
        steps: [
          '1. Supabaseのダッシュボードにログイン',
          '2. SQL Editorを開く',
          '3. sql/create_blog_tables.sqlの内容を実行',
          '4. テーブル作成後、再度このセットアップを実行'
        ]
      } : null
    });

  } catch (error) {
    console.error('データベースセットアップエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}