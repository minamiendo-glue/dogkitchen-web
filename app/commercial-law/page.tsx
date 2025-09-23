import Link from 'next/link';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function CommercialLawPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="commercial-law" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">特定商取引法に基づく表記</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">事業者情報</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">事業者名</dt>
                  <dd className="text-gray-900">DOG KITCHEN</dd>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">運営責任者</dt>
                  <dd className="text-gray-900">DOG KITCHEN運営チーム</dd>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">所在地</dt>
                  <dd className="text-gray-900">〒000-0000 東京都渋谷区</dd>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">電話番号</dt>
                  <dd className="text-gray-900">03-0000-0000</dd>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">メールアドレス</dt>
                  <dd className="text-gray-900">info@dogkitchen.com</dd>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">サービス内容</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">サービス名</dt>
                  <dd className="text-gray-900">DOG KITCHEN - 愛犬の手作りご飯レシピサイト</dd>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">サービス内容</dt>
                  <dd className="text-gray-900">愛犬のための手作りご飯レシピの提供、栄養計算、プレミアム機能の提供</dd>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">料金・支払い方法</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">料金</dt>
                  <dd className="text-gray-900">基本機能: 無料<br />プレミアム機能: 月額980円（税込）</dd>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">支払い方法</dt>
                  <dd className="text-gray-900">クレジットカード決済（Stripe）</dd>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">支払い時期</dt>
                  <dd className="text-gray-900">サービス利用開始時、および毎月の更新日</dd>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">キャンセル・返金</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">キャンセル</dt>
                  <dd className="text-gray-900">いつでもキャンセル可能。次回更新日から適用</dd>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">返金</dt>
                  <dd className="text-gray-900">サービス開始後7日以内であれば全額返金可能</dd>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">その他</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">サービス提供期間</dt>
                  <dd className="text-gray-900">24時間365日</dd>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">利用規約</dt>
                  <dd className="text-gray-900">
                    <Link href="/terms" className="text-red-500 hover:text-red-600 underline">
                      利用規約
                    </Link>
                    をご確認ください
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-medium text-gray-700 w-32 sm:w-40">プライバシーポリシー</dt>
                  <dd className="text-gray-900">
                    <Link href="/privacy" className="text-red-500 hover:text-red-600 underline">
                      プライバシーポリシー
                    </Link>
                    をご確認ください
                  </dd>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              最終更新日: 2024年1月1日
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


