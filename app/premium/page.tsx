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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Header */}
      <Header currentPage="premium" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <section className="text-center mb-20">
          {/* 限定オファーバナー */}
          <div className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg mb-8 animate-pulse">
            <span className="mr-2">🔥</span>
            <span>期間限定！初月無料キャンペーン実施中</span>
            <span className="ml-2">🔥</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              PREMIUM
            </span>
            <br />
            <span className="text-4xl sm:text-5xl font-extrabold text-gray-800">
              で愛犬の健康を
            </span>
            <br />
            <span className="text-4xl sm:text-5xl font-extrabold text-gray-800">
              プロレベルに
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-10 leading-relaxed">
            🐕 獣医師監修の栄養計算 🐕 個別カスタマイズ 🐕 専門家サポート<br />
            愛犬の体重・年齢・健康状態に完全対応した、<strong className="text-red-600">世界で唯一の</strong>手作りご飯サポートサービス
          </p>

          {/* 価格表示 */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <div className="relative">
              <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white px-12 py-6 rounded-3xl text-3xl font-black shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-sm font-bold opacity-90 mb-1">月額</div>
                <div className="text-5xl">500円</div>
                <div className="text-sm font-bold opacity-90 mt-1">初月無料</div>
              </div>
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                50%OFF
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700 line-through mb-1">1,000円</div>
              <div className="text-sm text-green-600 font-bold">→ 500円でお得！</div>
            </div>
          </div>

          {/* CTA ボタン */}
          <div className="space-y-4">
            <Link 
              href={resolvedSearchParams.redirect || '/profile/create'}
              className="inline-block bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white px-12 py-6 rounded-2xl text-2xl font-black shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse"
            >
              🚀 今すぐ無料で始める
            </Link>
            <div className="text-sm text-gray-500">
              ⚡ 30秒で登録完了 ⚡ クレジットカード不要 ⚡ いつでも解約可能
            </div>
          </div>
        </section>

        {/* 機能比較セクション */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              なぜ<span className="text-red-500">プレミアム</span>が必要なのか？
            </h2>
            <p className="text-xl text-gray-600">一般的な手作りご飯との圧倒的な違い</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* 無料版 */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">😐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-700">一般的な手作りご飯</h3>
                <div className="text-3xl font-black text-gray-500 mt-2">無料</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <span className="text-red-500 mr-3">❌</span>
                  <span>適当な分量で作る</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-red-500 mr-3">❌</span>
                  <span>栄養バランスが不安</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-red-500 mr-3">❌</span>
                  <span>愛犬の状態を考慮しない</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-red-500 mr-3">❌</span>
                  <span>専門知識なし</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-red-500 mr-3">❌</span>
                  <span>失敗のリスク大</span>
                </div>
              </div>
            </div>

            {/* プレミアム版 */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl shadow-2xl p-8 border-2 border-red-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  🏆 圧倒的な違い
                </span>
              </div>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">😍</span>
                </div>
                <h3 className="text-2xl font-bold text-red-600">DOG KITCHEN プレミアム</h3>
                <div className="text-3xl font-black text-red-500 mt-2">月額500円</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-3">✅</span>
                  <span className="font-semibold">科学的な分量計算</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-3">✅</span>
                  <span className="font-semibold">獣医師監修の栄養バランス</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-3">✅</span>
                  <span className="font-semibold">個別カスタマイズ対応</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-3">✅</span>
                  <span className="font-semibold">専門家サポート</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-3">✅</span>
                  <span className="font-semibold">100%安全保証</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 機能詳細セクション */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              プレミアム機能の<span className="text-red-500">全貌</span>
            </h2>
            <p className="text-xl text-gray-600">愛犬の健康をプロレベルでサポートする機能群</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 機能1 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🧮</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI栄養計算</h3>
              <p className="text-gray-600 mb-4">
                愛犬の体重・年齢・活動量を入力するだけで、最適な栄養バランスと分量を自動計算
              </p>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-blue-700 font-semibold">💡 効果</div>
                <div className="text-xs text-blue-600">栄養過多・不足を防ぎ、健康的な成長をサポート</div>
              </div>
            </div>

            {/* 機能2 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">個別カスタマイズ</h3>
              <p className="text-gray-600 mb-4">
                アレルギー・病気・体質に合わせた完全オーダーメイドレシピを提供
              </p>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-green-700 font-semibold">💡 効果</div>
                <div className="text-xs text-green-600">愛犬の状態に最適化された食事で健康改善</div>
              </div>
            </div>

            {/* 機能3 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">専門家サポート</h3>
              <p className="text-gray-600 mb-4">
                獣医師・ペットフードアドバイザーによる24時間オンライン相談サービス
              </p>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-sm text-purple-700 font-semibold">💡 効果</div>
                <div className="text-xs text-purple-600">不安や疑問を専門家に直接相談可能</div>
              </div>
            </div>

            {/* 機能4 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">健康管理ダッシュボード</h3>
              <p className="text-gray-600 mb-4">
                体重変化・体調管理・食事記録を一元管理し、健康状態を可視化
              </p>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-sm text-orange-700 font-semibold">💡 効果</div>
                <div className="text-xs text-orange-600">健康状態の変化を早期発見・対応</div>
              </div>
            </div>

            {/* 機能5 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">プロ動画レッスン</h3>
              <p className="text-gray-600 mb-4">
                獣医師監修の調理動画・栄養学講座・愛犬ケア動画を無制限視聴
              </p>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="text-sm text-red-700 font-semibold">💡 効果</div>
                <div className="text-xs text-red-600">専門知識を身につけて愛犬の健康をプロレベルでサポート</div>
              </div>
            </div>

            {/* 機能6 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">限定コンテンツ</h3>
              <p className="text-gray-600 mb-4">
                プレミアム限定の特別レシピ・季節メニュー・イベント情報を優先配信
              </p>
              <div className="bg-pink-50 rounded-lg p-3">
                <div className="text-sm text-pink-700 font-semibold">💡 効果</div>
                <div className="text-xs text-pink-600">常に最新・最高品質の情報にアクセス</div>
              </div>
            </div>
          </div>
        </section>

        {/* 料金プランセクション */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              圧倒的コストパフォーマンス
            </h2>
            <p className="text-xl text-gray-600">他のサービスと比較して、なぜこんなに安いの？</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-3xl shadow-2xl p-12 border-2 border-red-200 relative overflow-hidden">
              {/* 背景装飾 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200 to-orange-200 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-200 to-orange-200 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg mb-6">
                    <span className="mr-2">🏆</span>
                    <span>最強プラン</span>
                    <span className="ml-2">🏆</span>
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 mb-2">プレミアムプラン</h3>
                  <p className="text-gray-600">全ての機能が使い放題</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="text-center">
                    <div className="text-6xl font-black text-red-500 mb-2">500円</div>
                    <div className="text-gray-600 text-lg">月額</div>
                    <div className="text-sm text-green-600 font-bold mt-2">初月無料</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                      <span className="font-semibold">獣医師相談</span>
                      <span className="text-green-600 font-bold">¥3,000/回 → 無料</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                      <span className="font-semibold">栄養計算</span>
                      <span className="text-green-600 font-bold">¥500/回 → 無料</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                      <span className="font-semibold">専門動画</span>
                      <span className="text-green-600 font-bold">¥2,000/月 → 無料</span>
                    </div>
                    <div className="bg-yellow-100 rounded-lg p-4 text-center">
                      <div className="text-yellow-800 font-bold text-lg">月額5,500円相当が</div>
                      <div className="text-red-600 font-black text-2xl">500円で利用可能！</div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link 
                    href={resolvedSearchParams.redirect || '/profile/create'}
                    className="inline-block bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white px-16 py-6 rounded-2xl text-2xl font-black shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    🚀 今すぐ無料で始める
                  </Link>
                  <div className="text-sm text-gray-500 mt-4">
                    ⚡ クレジットカード不要 ⚡ 30秒で登録完了 ⚡ いつでも解約可能
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* お客様の声セクション */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              愛犬家の<span className="text-red-500">声</span>
            </h2>
            <p className="text-xl text-gray-600">実際にプレミアムを利用されている方の体験談</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* レビュー1 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  M
                </div>
                <div>
                  <div className="font-bold text-gray-900">みゆきさん</div>
                  <div className="text-sm text-gray-500">柴犬・3歳</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 italic">
                「栄養計算が正確で安心！愛犬の体重管理がうまくいって、獣医師にも褒められました。月額500円でこのサービスは本当にお得です！」
              </p>
            </div>

            {/* レビュー2 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  T
                </div>
                <div>
                  <div className="font-bold text-gray-900">たかしさん</div>
                  <div className="text-sm text-gray-500">ゴールデンレトリバー・7歳</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 italic">
                「アレルギー対応のレシピが素晴らしい！愛犬の痒みが改善されて、本当に感謝しています。専門家サポートも24時間対応で安心です。」
              </p>
            </div>

            {/* レビュー3 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  A
                </div>
                <div>
                  <div className="font-bold text-gray-900">あいさん</div>
                  <div className="text-sm text-gray-500">トイプードル・5歳</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 italic">
                「動画レッスンが分かりやすくて、初心者の私でもプロレベルの手作りご飯が作れるようになりました。愛犬も喜んで食べてくれます！」
              </p>
            </div>
          </div>
        </section>

        {/* 最終CTAセクション */}
        <section className="text-center">
          <div className="bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 text-white rounded-3xl shadow-2xl p-12 sm:p-16 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-5xl font-black mb-6 leading-tight">
                愛犬の健康管理を<br />
                <span className="text-yellow-200">今すぐ始めませんか？</span>
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                🐕 30秒で登録完了 🐕 初月無料 🐕 いつでも解約可能<br />
                月額500円で、愛犬の健康をプロレベルでサポート。今なら期間限定で初月無料！
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Link 
                  href={resolvedSearchParams.redirect || '/profile/create'}
                  className="bg-white text-red-600 px-12 py-6 rounded-2xl font-black text-2xl hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105"
                >
                  🚀 今すぐ無料で始める
                </Link>
                <div className="text-center">
                  <div className="text-2xl font-black">初月無料</div>
                  <div className="text-sm opacity-90">2ヶ月目から500円/月</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm opacity-90 max-w-2xl mx-auto">
                <div className="flex items-center justify-center">
                  <span className="mr-2">⚡</span>
                  <span>クレジットカード不要</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">🔒</span>
                  <span>完全プライバシー保護</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">📱</span>
                  <span>スマホで簡単管理</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}