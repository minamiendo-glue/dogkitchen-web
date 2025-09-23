import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
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

    const tables = ['articles', 'features', 'article_recipes', 'feature_recipes'];
    const results: any[] = [];

    for (const tableName of tables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          results.push({
            table: tableName,
            exists: false,
            error: error.message
          });
        } else {
          results.push({
            table: tableName,
            exists: true,
            message: 'テーブルが存在します'
          });
        }
      } catch (error) {
        results.push({
          table: tableName,
          exists: false,
          error: 'テーブルが存在しません'
        });
      }
    }

    const existingTables = results.filter(r => r.exists).length;
    const missingTables = results.filter(r => !r.exists).length;

    return NextResponse.json({
      message: `テーブル確認完了（存在: ${existingTables}, 未作成: ${missingTables}）`,
      results,
      summary: {
        total: tables.length,
        existing: existingTables,
        missing: missingTables
      }
    });

  } catch (error) {
    console.error('テーブル確認エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
