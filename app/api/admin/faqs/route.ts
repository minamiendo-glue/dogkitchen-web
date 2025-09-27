import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// FAQ型定義
interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  status: 'published' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
}

interface CreateFAQData {
  question: string;
  answer: string;
  display_order?: number;
  status?: 'published' | 'draft' | 'archived';
}

// FAQ一覧取得（管理者のみ）
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // FAQを取得（表示順でソート）
    const { data: faqs, error } = await supabaseAdmin
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('FAQ取得エラー:', error);
      
      // テーブルが存在しない場合の特別な処理
      if (error.code === 'PGRST116' || error.message?.includes('relation "faqs" does not exist')) {
        return NextResponse.json({
          faqs: [],
          message: 'FAQテーブルがまだ作成されていません。管理画面でデータベースセットアップを実行してください。',
          needsSetup: true
        });
      }
      
      return NextResponse.json(
        { error: 'FAQの取得に失敗しました', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      faqs: faqs || [],
      pagination: {
        page,
        limit,
        hasMore: (faqs || []).length === limit
      }
    });

  } catch (error) {
    console.error('FAQ一覧取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// FAQ作成（管理者のみ）
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

    const body: CreateFAQData = await request.json();
    const { question, answer, display_order, status } = body;

    // バリデーション
    if (!question || !answer) {
      return NextResponse.json(
        { error: '質問と回答は必須です' },
        { status: 400 }
      );
    }

    // 表示順が指定されていない場合、最大値+1を設定
    let orderValue = display_order;
    if (!orderValue) {
      const { data: maxOrder } = await supabaseAdmin
        .from('faqs')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .single();
      
      orderValue = (maxOrder?.display_order || 0) + 1;
    }

    // FAQを作成
    const faqData = {
      question: question.trim(),
      answer: answer.trim(),
      display_order: orderValue,
      status: status || 'published'
    };

    const { data: newFAQ, error: insertError } = await supabaseAdmin
      .from('faqs')
      .insert(faqData)
      .select()
      .single();

    if (insertError) {
      console.error('FAQ作成エラー:', insertError);
      return NextResponse.json(
        { error: 'FAQの作成に失敗しました', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'FAQが正常に作成されました',
        faq: newFAQ
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('FAQ作成エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
