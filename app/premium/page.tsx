import Link from 'next/link';
import { VideoPlayer } from '@/components/video-player';
import { PaymentButton } from '@/components/payment-button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { redirect } from 'next/navigation';

export default async function PremiumPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  
  // サーバーコンポーネントではawaitを使用
  const resolvedSearchParams = await searchParams;
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="premium" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            プレミアム機能で<br className="sm:hidden" />
            愛犬の健康管理を<br className="hidden sm:block" />
            もっと簡単に
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            愛犬の体重や年齢に合わせた食材量の自動計算、
            ペットフードアドバイザーへのLINE相談など、愛犬の健康をサポートする機能が満載です。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg">
              月額 500円
            </div>
            <div className="text-sm text-gray-500">
              ※初回登録時のみ
            </div>
          </div>
          
          <div className="mt-8">
            <PaymentButton size="lg" variant="primary">
              今すぐプレミアムにアップグレード
            </PaymentButton>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">プレミアム機能の詳細</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-800">愛犬プロフィール登録</h4>
              </div>
              <p className="text-gray-600 mb-4">
                愛犬の体重、年齢、活動量、健康状態、名前を登録することで、
                より専門的なサービスをご利用いただけます。
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 体重・年齢による適切な栄養量の計算</li>
                <li>• 活動量に応じたカロリー調整</li>
                <li>• 健康状態に配慮したレシピ提案</li>
              </ul>
            </div>


          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">料金プラン</h3>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-red-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  おすすめ
                </span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">プレミアムプラン</h4>
              <div className="mb-6">
                <span className="text-4xl font-bold text-red-500">500円</span>
                <span className="text-gray-600 ml-2">/月</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  愛犬プロフィール登録
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  分量自動調整
                </li>
              </ul>
              <Link 
                href={resolvedSearchParams.redirect || '/profile/create'} 
                className="block w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors font-medium text-lg text-center"
              >
                今すぐ始める
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">よくある質問</h3>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Q. 解約はいつでもできますか？</h4>
              <p className="text-gray-600">A. はい、いつでも解約可能です。解約後は翌月から料金の請求は停止されます。</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Q. 分量調整の精度はどの程度ですか？</h4>
              <p className="text-gray-600">A. 科学的な栄養計算アルゴリズムを使用しており、愛犬の体重・年齢・活動量に基づいて正確に計算します。</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Q. 複数の犬を登録できますか？</h4>
              <p className="text-gray-600">A. はい、1つのアカウントで複数の愛犬のプロフィールを登録・管理できます。</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl shadow-lg p-8 sm:p-12">
            <h3 className="text-3xl font-bold mb-4">愛犬の健康管理を始めませんか？</h3>
            <p className="text-lg mb-8 opacity-90">
              月額500円で、愛犬の健康をサポートする全ての機能をご利用いただけます。
              今すぐプレミアムプランに登録して、愛犬との時間をより豊かにしましょう。
            </p>
            <div className="flex justify-center">
              <Link 
                href={resolvedSearchParams.redirect || '/profile/create'} 
                className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md text-lg"
              >
                プレミアムプランを始める
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
