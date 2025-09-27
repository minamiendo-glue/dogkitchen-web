import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 公開用FAQ一覧取得
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // 公開中のFAQのみを取得（表示順でソート）
    const { data: faqs, error } = await supabaseAdmin
      .from('faqs')
      .select('id, question, answer, display_order')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('公開用FAQ取得エラー:', error);
      
      // テーブルが存在しない場合は空配列を返す
      if (error.code === 'PGRST116' || 
          error.message?.includes('relation "faqs" does not exist') ||
          error.message?.includes('Could not find the table')) {
        return NextResponse.json({
          faqs: [],
          message: 'FAQデータがまだ設定されていません'
        });
      }
      
      return NextResponse.json(
        { error: 'FAQの取得に失敗しました', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      faqs: faqs || []
    });

  } catch (error) {
    console.error('公開用FAQ取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
