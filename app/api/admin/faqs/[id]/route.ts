import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 個別FAQ取得（管理者のみ）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // FAQを取得
    const { data: faq, error } = await supabaseAdmin
      .from('faqs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'FAQが見つかりません' },
          { status: 404 }
        );
      }
      
      console.error('FAQ取得エラー:', error);
      return NextResponse.json(
        { error: 'FAQの取得に失敗しました', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ faq });

  } catch (error) {
    console.error('FAQ取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// FAQ更新（管理者のみ）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { question, answer, display_order, status } = body;

    // バリデーション
    if (!question || !answer) {
      return NextResponse.json(
        { error: '質問と回答は必須です' },
        { status: 400 }
      );
    }

    // FAQを更新
    const updateData = {
      question: question.trim(),
      answer: answer.trim(),
      display_order: display_order,
      status: status
    };

    const { data: updatedFAQ, error: updateError } = await supabaseAdmin
      .from('faqs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('FAQ更新エラー:', updateError);
      return NextResponse.json(
        { error: 'FAQの更新に失敗しました', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'FAQが正常に更新されました',
      faq: updatedFAQ
    });

  } catch (error) {
    console.error('FAQ更新エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// FAQ削除（管理者のみ）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // FAQを削除
    const { error: deleteError } = await supabaseAdmin
      .from('faqs')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('FAQ削除エラー:', deleteError);
      return NextResponse.json(
        { error: 'FAQの削除に失敗しました', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'FAQが正常に削除されました'
    });

  } catch (error) {
    console.error('FAQ削除エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
