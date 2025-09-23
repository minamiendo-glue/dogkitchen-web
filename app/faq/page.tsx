'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function FAQPage() {
  const faqs = [
    {
      id: 1,
      question: "DOG KITCHENとは何ですか？",
      answer: "DOG KITCHENは愛犬の健康をサポートする手作りご飯レシピサイトです。ライフステージや体の悩みに合わせた、栄養バランスの良いレシピを提供しています。"
    },
    {
      id: 2,
      question: "プレミアム機能にはどのようなものがありますか？",
      answer: "プレミアム機能では、愛犬の体重や年齢を入力するだけで最適な食材量を自動計算する機能や、詳細な栄養情報の表示、専用のレシピ動画などがご利用いただけます。"
    },
    {
      id: 3,
      question: "レシピの信頼性はどの程度ですか？",
      answer: "すべてのレシピは獣医師監修のもと、栄養バランスを考慮して作成されています。愛犬の健康を第一に考えた、安全で美味しいレシピをお届けしています。"
    },
    {
      id: 4,
      question: "アレルギー対応のレシピはありますか？",
      answer: "はい、アレルギー対応のレシピも豊富にご用意しています。レシピ検索で「アレルギー対応」を選択することで、お探しのレシピを見つけることができます。"
    },
    {
      id: 5,
      question: "プレミアムプランの料金はいくらですか？",
      answer: "プレミアムプランは月額500円でご利用いただけます。愛犬の健康管理をサポートする全機能を無制限でご利用いただけます。"
    },
    {
      id: 6,
      question: "レシピの保存はできますか？",
      answer: "はい、お気に入り機能でお気に入りのレシピを保存できます。ログイン後、レシピカードのハートマークをクリックして保存してください。"
    },
    {
      id: 7,
      question: "動画レシピの再生速度は変更できますか？",
      answer: "はい、動画プレイヤーの速度変更ボタンから、0.5倍速から2倍速までお好みの速度でご覧いただけます。"
    },
    {
      id: 8,
      question: "アカウントの削除はできますか？",
      answer: "はい、マイページの設定からアカウントを削除することができます。削除後はデータの復旧ができませんので、ご注意ください。"
    }
  ];

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

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Q{faq.id}. {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-3xl">💌</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4">
            まだお答えが見つかりませんか？
          </h3>
          <p className="text-lg mb-6 opacity-90">
            その他のご質問やご不明点がございましたら、お気軽にお問い合わせください。
          </p>
          <button className="bg-white text-red-500 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            お問い合わせ
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

