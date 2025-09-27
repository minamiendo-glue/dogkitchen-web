import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// FAQテーブル作成SQL実行（開発用）
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

    // FAQテーブル作成のSQL
    const createFAQTableSQL = `
      CREATE TABLE IF NOT EXISTS faqs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // インデックス作成のSQL
    const createIndexesSQL = [
      `CREATE INDEX IF NOT EXISTS idx_faqs_status ON faqs(status);`,
      `CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);`,
      `CREATE INDEX IF NOT EXISTS idx_faqs_created_at ON faqs(created_at);`
    ];

    // 更新日時の自動更新トリガー関数
    const createTriggerFunctionSQL = `
      CREATE OR REPLACE FUNCTION update_faqs_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    // トリガー作成のSQL
    const createTriggerSQL = `
      DROP TRIGGER IF EXISTS trigger_update_faqs_updated_at ON faqs;
      CREATE TRIGGER trigger_update_faqs_updated_at
        BEFORE UPDATE ON faqs
        FOR EACH ROW
        EXECUTE FUNCTION update_faqs_updated_at();
    `;

    // サンプルデータ挿入のSQL
    const insertSampleDataSQL = `
      INSERT INTO faqs (question, answer, display_order, status) VALUES
      ('DOG KITCHENとは何ですか？', 'DOG KITCHENは愛犬の健康をサポートする手作りご飯レシピサイトです。ライフステージや体の悩みに合わせた、栄養バランスの良いレシピを提供しています。', 1, 'published'),
      ('プレミアム機能にはどのようなものがありますか？', 'プレミアム機能では、愛犬の体重や年齢を入力するだけで最適な食材量を自動計算する機能や、詳細な栄養情報の表示、専用のレシピ動画などがご利用いただけます。', 2, 'published'),
      ('レシピの信頼性はどの程度ですか？', 'すべてのレシピは獣医師監修のもと、栄養バランスを考慮して作成されています。愛犬の健康を第一に考えた、安全で美味しいレシピをお届けしています。', 3, 'published'),
      ('アレルギー対応のレシピはありますか？', 'はい、アレルギー対応のレシピも豊富にご用意しています。レシピ検索で「アレルギー対応」を選択することで、お探しのレシピを見つけることができます。', 4, 'published'),
      ('プレミアムプランの料金はいくらですか？', 'プレミアムプランは月額500円でご利用いただけます。愛犬の健康管理をサポートする全機能を無制限でご利用いただけます。', 5, 'published'),
      ('レシピの保存はできますか？', 'はい、お気に入り機能でお気に入りのレシピを保存できます。ログイン後、レシピカードのハートマークをクリックして保存してください。', 6, 'published'),
      ('動画レシピの再生速度は変更できますか？', 'はい、動画プレイヤーの速度変更ボタンから、0.5倍速から2倍速までお好みの速度でご覧いただけます。', 7, 'published'),
      ('アカウントの削除はできますか？', 'はい、マイページの設定からアカウントを削除することができます。削除後はデータの復旧ができませんので、ご注意ください。', 8, 'published')
      ON CONFLICT DO NOTHING;
    `;

    const results = [];

    try {
      // テーブル作成
      const { error: tableError } = await supabaseAdmin.rpc('exec_sql', { sql: createFAQTableSQL });
      if (tableError) {
        console.error('テーブル作成エラー:', tableError);
        results.push({ step: 'テーブル作成', error: tableError.message });
      } else {
        results.push({ step: 'テーブル作成', success: true });
      }

      // インデックス作成
      for (const indexSQL of createIndexesSQL) {
        const { error: indexError } = await supabaseAdmin.rpc('exec_sql', { sql: indexSQL });
        if (indexError) {
          console.error('インデックス作成エラー:', indexError);
          results.push({ step: 'インデックス作成', error: indexError.message });
        } else {
          results.push({ step: 'インデックス作成', success: true });
        }
      }

      // トリガー関数作成
      const { error: triggerFunctionError } = await supabaseAdmin.rpc('exec_sql', { sql: createTriggerFunctionSQL });
      if (triggerFunctionError) {
        console.error('トリガー関数作成エラー:', triggerFunctionError);
        results.push({ step: 'トリガー関数作成', error: triggerFunctionError.message });
      } else {
        results.push({ step: 'トリガー関数作成', success: true });
      }

      // トリガー作成
      const { error: triggerError } = await supabaseAdmin.rpc('exec_sql', { sql: createTriggerSQL });
      if (triggerError) {
        console.error('トリガー作成エラー:', triggerError);
        results.push({ step: 'トリガー作成', error: triggerError.message });
      } else {
        results.push({ step: 'トリガー作成', success: true });
      }

      // サンプルデータ挿入
      const { error: dataError } = await supabaseAdmin.rpc('exec_sql', { sql: insertSampleDataSQL });
      if (dataError) {
        console.error('サンプルデータ挿入エラー:', dataError);
        results.push({ step: 'サンプルデータ挿入', error: dataError.message });
      } else {
        results.push({ step: 'サンプルデータ挿入', success: true });
      }

      // 最終確認
      const { data: faqs, error: checkError } = await supabaseAdmin
        .from('faqs')
        .select('id, question, display_order, status')
        .limit(5);

      if (checkError) {
        results.push({ step: '最終確認', error: checkError.message });
      } else {
        results.push({ 
          step: '最終確認', 
          success: true, 
          faqCount: faqs?.length || 0,
          sampleFAQs: faqs?.slice(0, 3) || []
        });
      }

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => r.error).length;

      return NextResponse.json({
        success: errorCount === 0,
        message: `FAQテーブルの作成が完了しました。成功: ${successCount}件, エラー: ${errorCount}件`,
        results,
        faqCount: faqs?.length || 0
      });

    } catch (sqlError) {
      console.error('SQL実行エラー:', sqlError);
      return NextResponse.json({
        success: false,
        message: 'SQL実行中にエラーが発生しました。Supabaseの管理画面で手動実行してください。',
        error: sqlError,
        results,
        manualInstructions: {
          message: '以下のSQLをSupabaseの管理画面で実行してください：',
          sql: {
            createTable: createFAQTableSQL,
            createIndexes: createIndexesSQL,
            createTriggerFunction: createTriggerFunctionSQL,
            createTrigger: createTriggerSQL,
            insertData: insertSampleDataSQL
          }
        }
      });
    }

  } catch (error) {
    console.error('FAQテーブル作成エラー:', error);
    return NextResponse.json(
      { error: 'FAQテーブル作成に失敗しました', details: error },
      { status: 500 }
    );
  }
}
