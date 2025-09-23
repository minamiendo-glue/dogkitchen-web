import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

// カテゴリ情報の型定義
interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  type: 'protein' | 'life-stage' | 'health-condition' | 'meal-scene';
}

// タンパク質タイプ
const proteinTypes: CategoryInfo[] = [
  {
    id: 'beef',
    name: '牛肉',
    description: 'ジューシーで旨みたっぷりの牛肉を使ったレシピ',
    icon: '🥩',
    color: 'from-red-500 to-red-600',
    gradient: 'bg-gradient-to-br from-red-500 to-red-600',
    type: 'protein'
  },
  {
    id: 'chicken',
    name: '鶏肉',
    description: 'ヘルシーで使いやすい鶏肉のレシピ',
    icon: '🐔',
    color: 'from-orange-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
    type: 'protein'
  },
  {
    id: 'pork',
    name: '豚肉',
    description: 'コクのある豚肉を使った人気レシピ',
    icon: '🐷',
    color: 'from-pink-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-pink-500 to-pink-600',
    type: 'protein'
  },
  {
    id: 'fish',
    name: '魚',
    description: 'オメガ3豊富な魚を使ったヘルシーレシピ',
    icon: '🐟',
    color: 'from-blue-500 to-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    type: 'protein'
  },
  {
    id: 'horse',
    name: '馬肉',
    description: '低カロリー高タンパクな馬肉レシピ',
    icon: '🐴',
    color: 'from-purple-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
    type: 'protein'
  },
  {
    id: 'kangaroo',
    name: 'カンガルー',
    description: '珍しいカンガルー肉を使ったレシピ',
    icon: '🦘',
    color: 'from-green-500 to-green-600',
    gradient: 'bg-gradient-to-br from-green-500 to-green-600',
    type: 'protein'
  }
];

// ライフステージ
const lifeStages: CategoryInfo[] = [
  {
    id: 'puppy',
    name: '子犬期',
    description: '成長期の子犬に必要な栄養を考えたレシピ',
    icon: '🐕',
    color: 'from-yellow-400 to-yellow-600',
    gradient: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    type: 'life-stage'
  },
  {
    id: 'adult',
    name: '成犬期',
    description: '活発な成犬の健康維持に最適なレシピ',
    icon: '🐕‍🦺',
    color: 'from-blue-500 to-blue-700',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
    type: 'life-stage'
  },
  {
    id: 'senior',
    name: 'シニア期',
    description: '高齢犬の健康サポートに特化したレシピ',
    icon: '🐕‍🦳',
    color: 'from-gray-500 to-gray-700',
    gradient: 'bg-gradient-to-br from-gray-500 to-gray-700',
    type: 'life-stage'
  }
];

// 健康状態
const healthConditions: CategoryInfo[] = [
  {
    id: 'balanced',
    name: 'バランスGood',
    description: '健康維持に最適なバランスの良いレシピ',
    icon: '💚',
    color: 'from-green-500 to-green-700',
    gradient: 'bg-gradient-to-br from-green-500 to-green-700',
    type: 'health-condition'
  },
  {
    id: 'diet',
    name: 'ダイエット',
    description: '体重管理に適した低カロリーレシピ',
    icon: '⚖️',
    color: 'from-purple-500 to-purple-700',
    gradient: 'bg-gradient-to-br from-purple-500 to-purple-700',
    type: 'health-condition'
  },
  {
    id: 'weak_stomach',
    name: 'お腹が弱い',
    description: '消化に優しい胃腸ケアレシピ',
    icon: '🤢',
    color: 'from-orange-500 to-orange-700',
    gradient: 'bg-gradient-to-br from-orange-500 to-orange-700',
    type: 'health-condition'
  },
  {
    id: 'kidney_care',
    name: '腎臓ケア',
    description: '腎臓の負担を軽減する特別レシピ',
    icon: '🫘',
    color: 'from-red-500 to-red-700',
    gradient: 'bg-gradient-to-br from-red-500 to-red-700',
    type: 'health-condition'
  },
  {
    id: 'joint_care',
    name: '関節ケア',
    description: '関節の健康をサポートするレシピ',
    icon: '🦴',
    color: 'from-indigo-500 to-indigo-700',
    gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    type: 'health-condition'
  },
  {
    id: 'heart_care',
    name: '心臓ケア',
    description: '心臓に優しい低ナトリウムレシピ',
    icon: '❤️',
    color: 'from-pink-500 to-pink-700',
    gradient: 'bg-gradient-to-br from-pink-500 to-pink-700',
    type: 'health-condition'
  },
  {
    id: 'skin_care',
    name: '皮膚ケア',
    description: '皮膚と被毛の健康を保つレシピ',
    icon: '✨',
    color: 'from-amber-500 to-amber-700',
    gradient: 'bg-gradient-to-br from-amber-500 to-amber-700',
    type: 'health-condition'
  },
  {
    id: 'appetite',
    name: '嗜好性UP',
    description: '食欲を刺激する美味しいレシピ',
    icon: '😋',
    color: 'from-yellow-500 to-yellow-700',
    gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
    type: 'health-condition'
  }
];

// 利用シーン
const mealScenes: CategoryInfo[] = [
  {
    id: 'daily',
    name: '日常ごはん',
    description: '毎日の健康維持に最適な基本レシピ',
    icon: '🍽️',
    color: 'from-gray-600 to-gray-800',
    gradient: 'bg-gradient-to-br from-gray-600 to-gray-800',
    type: 'meal-scene'
  },
  {
    id: 'snack',
    name: 'おやつ',
    description: '特別な時間を楽しむおやつレシピ',
    icon: '🍪',
    color: 'from-amber-500 to-amber-700',
    gradient: 'bg-gradient-to-br from-amber-500 to-amber-700',
    type: 'meal-scene'
  },
  {
    id: 'special',
    name: '特別な日',
    description: 'お誕生日や記念日にぴったりの特別レシピ',
    icon: '🎉',
    color: 'from-rose-500 to-rose-700',
    gradient: 'bg-gradient-to-br from-rose-500 to-rose-700',
    type: 'meal-scene'
  }
];

// カテゴリセクションコンポーネント
function CategorySection({ 
  title, 
  description, 
  categories, 
  type 
}: { 
  title: string; 
  description: string; 
  categories: CategoryInfo[]; 
  type: string;
}) {
  const getCategoryUrl = (category: CategoryInfo) => {
    switch (category.type) {
      case 'protein':
        return `/recipes/category/${category.id}`;
      case 'life-stage':
        return `/recipes/category/life-stage/${category.id}`;
      case 'health-condition':
        return `/recipes/category/health-condition/${category.id}`;
      case 'meal-scene':
        return `/recipes/category/meal-scene/${category.id}`;
      default:
        return `/recipes/category/${category.id}`;
    }
  };

  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={getCategoryUrl(category)}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            {/* グラデーション背景 */}
            <div className={`absolute inset-0 ${category.gradient} opacity-90`}></div>
            
            {/* コンテンツ */}
            <div className="relative z-10 p-6 text-center">
              <div className="text-5xl mb-3">{category.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {category.name}
              </h3>
              <p className="text-white/90 text-sm leading-relaxed">
                {category.description}
              </p>
            </div>

            {/* ホバーエフェクト */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* ページヘッダー */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            レシピカテゴリ
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            愛犬の年齢、健康状態、好みに合わせて最適なレシピを探してみましょう。
            様々な条件でレシピを絞り込むことができます。
          </p>
        </div>

        {/* ライフステージ */}
        <CategorySection
          title="ライフステージ"
          description="愛犬の年齢に合わせたレシピを探す"
          categories={lifeStages}
          type="life-stage"
        />

        {/* 健康状態 */}
        <CategorySection
          title="健康状態"
          description="愛犬の健康状態に合わせたレシピを探す"
          categories={healthConditions}
          type="health-condition"
        />

        {/* 利用シーン */}
        <CategorySection
          title="利用シーン"
          description="食事の目的やシーンに合わせたレシピを探す"
          categories={mealScenes}
          type="meal-scene"
        />

        {/* タンパク質タイプ */}
        <CategorySection
          title="タンパク質タイプ"
          description="使用するタンパク質の種類でレシピを探す"
          categories={proteinTypes}
          type="protein"
        />

        {/* 戻るボタン */}
        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ホームに戻る
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
