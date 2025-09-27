'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FAQデータの取得
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/faqs');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'FAQの取得に失敗しました');
        }

        setFaqs(data.faqs || []);
      } catch (err) {
        console.error('FAQ取得エラー:', err);
        setError(err instanceof Error ? err.message : 'FAQの取得に失敗しました');
        
        // エラー時はデフォルトのFAQを表示
        setFaqs([
          {
            id: '1',
            question: "DOG KITCHENとは何ですか？",
            answer: "DOG KITCHENは愛犬の健康をサポートする手作りご飯レシピサイトです。ライフステージや体の悩みに合わせた、栄養バランスの良いレシピを提供しています。",
            display_order: 1
          },
          {
            id: '2',
            question: "プレミアム機能にはどのようなものがありますか？",
            answer: "プレミアム機能では、愛犬の体重や年齢を入力するだけで最適な食材量を自動計算する機能や、詳細な栄養情報の表示、専用のレシピ動画などがご利用いただけます。",
            display_order: 2
          },
          {
            id: '3',
            question: "レシピの信頼性はどの程度ですか？",
            answer: "すべてのレシピは獣医師監修のもと、栄養バランスを考慮して作成されています。愛犬の健康を第一に考えた、安全で美味しいレシピをお届けしています。",
            display_order: 3
          },
          {
            id: '4',
            question: "アレルギー対応のレシピはありますか？",
            answer: "はい、アレルギー対応のレシピも豊富にご用意しています。レシピ検索で「アレルギー対応」を選択することで、お探しのレシピを見つけることができます。",
            display_order: 4
          },
          {
            id: '5',
            question: "プレミアムプランの料金はいくらですか？",
            answer: "プレミアムプランは月額500円でご利用いただけます。愛犬の健康管理をサポートする全機能を無制限でご利用いただけます。",
            display_order: 5
          },
          {
            id: '6',
            question: "レシピの保存はできますか？",
            answer: "はい、お気に入り機能でお気に入りのレシピを保存できます。ログイン後、レシピカードのハートマークをクリックして保存してください。",
            display_order: 6
          },
          {
            id: '7',
            question: "動画レシピの再生速度は変更できますか？",
            answer: "はい、動画プレイヤーの速度変更ボタンから、0.5倍速から2倍速までお好みの速度でご覧いただけます。",
            display_order: 7
          },
          {
            id: '8',
            question: "アカウントの削除はできますか？",
            answer: "はい、マイページの設定からアカウントを削除することができます。削除後はデータの復旧ができませんので、ご注意ください。",
            display_order: 8
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="faq" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">❓</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            よくある質問
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            DOG KITCHENに関するよくあるご質問にお答えします。
          </p>
        </div>

        {/* ローディング表示 */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">FAQを読み込み中...</p>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">注意</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{error}</p>
                  <p className="mt-1">デフォルトのFAQを表示しています。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ List */}
        {!loading && (
          <div className="space-y-6">
            {faqs.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">📝</span>
                <p className="text-gray-600">まだFAQがありません。</p>
              </div>
            ) : (
              faqs.map((faq, index) => (
                <div key={faq.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Q{faq.display_order || index + 1}. {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

