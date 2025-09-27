import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface FAQOrderUpdate {
  id: string;
  display_order: number;
}

// FAQ表示順一括更新（管理者のみ）
export async function PUT(request: NextRequest) {
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

    const body: { faqs: FAQOrderUpdate[] } = await request.json();
    const { faqs } = body;

    if (!Array.isArray(faqs)) {
      return NextResponse.json(
        { error: '無効なデータ形式です' },
        { status: 400 }
      );
    }

    // 各FAQの表示順を更新
    const updatePromises = faqs.map(async (faqUpdate) => {
      const { data, error } = await supabaseAdmin
        .from('faqs')
        .update({ display_order: faqUpdate.display_order })
        .eq('id', faqUpdate.id)
        .select('id, title, display_order');

      if (error) {
        console.error(`FAQ表示順更新エラー (ID: ${faqUpdate.id}):`, error);
        return { id: faqUpdate.id, error: error.message };
      }

      return { id: faqUpdate.id, success: true, data };
    });

    const results = await Promise.all(updatePromises);
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      message: `${successCount}件のFAQの表示順を更新しました`,
      success: successCount,
      errors: errorCount,
      results
    });

  } catch (error) {
    console.error('FAQ表示順更新エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
