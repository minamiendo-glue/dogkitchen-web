import Link from 'next/link';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 mt-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* サイト情報 */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🐕</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                DOG KITCHEN
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              愛犬の健康をサポートする手作りご飯レシピサイト。ライフステージや体の悩みに合わせたレシピを提供します。
            </p>
          </div>

          {/* サイトナビゲーション */}
          <div>
            <h4 className="text-lg font-semibold mb-6">サイトナビゲーション</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                  当サイトについて
                </Link>
              </li>
              <li>
                <Link href="/premium" className="text-gray-300 hover:text-white transition-colors duration-200">
                  プレミアムページ
                </Link>
              </li>
              <li>
                <Link href="/mypage" className="text-gray-300 hover:text-white transition-colors duration-200">
                  マイページ
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="text-gray-300 hover:text-white transition-colors duration-200">
                  レシピ一覧
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-300 hover:text-white transition-colors duration-200">
                  レシピ検索
                </Link>
              </li>
            </ul>
          </div>

          {/* アカウント */}
          <div>
            <h4 className="text-lg font-semibold mb-6">アカウント</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/register" className="text-gray-300 hover:text-white transition-colors duration-200">
                  新規会員登録
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors duration-200">
                  ログイン
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="text-gray-300 hover:text-white transition-colors duration-200">
                  パスワードを忘れた方
                </Link>
              </li>
              <li>
                <Link href="/profile/create" className="text-gray-300 hover:text-white transition-colors duration-200">
                  プロフィール作成
                </Link>
              </li>
            </ul>
          </div>

          {/* サポート */}
          <div>
            <h4 className="text-lg font-semibold mb-6">サポート</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-200">
                  よくあるご質問
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 著作権表示 */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 DOG KITCHEN. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}


