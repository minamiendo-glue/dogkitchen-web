// app/recipes/page.tsx
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { SafeImage } from "@/components/safe-image";
import { convertR2ImageUrl } from "@/lib/utils/image-url";
import { Footer } from "@/components/footer";

// ビルド時に外部WPを叩かず、実行時ISRで取得する
export const dynamic = "force-dynamic"; // 人気順ソートのため動的生成に変更
export const revalidate = 300; // 5分ごとに再生成（適宜調整）

interface Recipe {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  status: string;
  created_at: string;
  favorite_count?: number;
}

async function getRecipes(sortBy: string = 'newest'): Promise<Recipe[]> {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin client is not available');
      return [];
    }

    if (sortBy === 'popular') {
      // 人気順（お気に入り数順）で取得
      const { data: allRecipes, error: allError } = await supabaseAdmin
        .from('recipes')
        .select('id, title, description, thumbnail_url, status, created_at')
        .eq('status', 'published')
        .limit(12);

      if (allError) {
        console.error('Supabase fetch error:', allError);
        return [];
      }

      // お気に入り数を取得してソート
      const recipesWithFavorites = await Promise.all(
        (allRecipes || []).map(async (recipe: Recipe) => {
          const { count } = await supabaseAdmin
            .from('favorite_recipes')
            .select('*', { count: 'exact', head: true })
            .eq('recipe_id', recipe.id);

          return {
            ...recipe,
            favorite_count: count || 0
          };
        })
      );

      // お気に入り数でソート
      return recipesWithFavorites.sort((a, b) => b.favorite_count - a.favorite_count);
    } else {
      // 新着順で取得
      const { data: recipes, error } = await supabaseAdmin
        .from('recipes')
        .select('id, title, description, thumbnail_url, status, created_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Supabase fetch error:', error);
        return [];
      }

      return recipes || [];
    }
  } catch (error) {
    console.error('Recipe fetch error:', error);
    return [];
  }
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const sortBy = resolvedSearchParams.sort || 'newest';
  const recipes = await getRecipes(sortBy);

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">
          {sortBy === 'popular' ? '人気のレシピ' : 'レシピ一覧'}
        </h1>
        <div className="flex gap-2">
          <Link
            href="/recipes"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'newest' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            新着順
          </Link>
          <Link
            href="/recipes?sort=popular"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'popular' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            人気順
          </Link>
        </div>
      </div>

      {(!recipes || recipes.length === 0) && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 mb-4">
          <p className="text-sm text-yellow-900">
            ただいまレシピを取得できませんでした。時間をおいて再度お試しください。
          </p>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {recipes?.map((recipe) => {
          // R2のURLを新しいパブリック開発URLに変換
          const convertedImg = convertR2ImageUrl(recipe.thumbnail_url || "");

          return (
            <article
              key={recipe.id}
              className="rounded-xl overflow-hidden bg-white border border-gray-200"
            >
              <Link href={`/recipes/${recipe.id}`} className="block relative aspect-square">
                {convertedImg ? (
                  <SafeImage
                    src={convertedImg}
                    alt={recipe.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                    priority={false}
                    fallbackComponent={<div className="w-full h-full bg-gray-100" />}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
                {/* タイトルを白文字で重ねる（黒グラデ） */}
                <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/60 to-transparent" />
                <h3 className="absolute top-3 left-3 right-3 text-white font-extrabold leading-tight drop-shadow">
                  {recipe.title}
                </h3>
                {/* お気に入り数表示（人気順の場合のみ） */}
                {sortBy === 'popular' && recipe.favorite_count !== undefined && (
                  <div className="absolute bottom-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span>❤️</span>
                    <span>{recipe.favorite_count}</span>
                  </div>
                )}
              </Link>
            </article>
          );
        })}
      </div>

      {/* サイト内回遊ボタン */}
      <div className="mt-12 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">もっと探してみよう</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/search"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-bold text-lg mb-1">レシピ検索</h3>
              <p className="text-sm opacity-90">条件を指定してレシピを探す</p>
            </div>
          </Link>
          
          <Link
            href="/about"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">ℹ️</div>
              <h3 className="font-bold text-lg mb-1">サイトについて</h3>
              <p className="text-sm opacity-90">DOG KITCHENの特徴</p>
            </div>
          </Link>
          
          <Link
            href="/premium"
            className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-6 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-bold text-lg mb-1">プレミアム</h3>
              <p className="text-sm opacity-90">愛犬に合わせた分量調整</p>
            </div>
          </Link>
          
          <Link
            href="/mypage"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">👤</div>
              <h3 className="font-bold text-lg mb-1">マイページ</h3>
              <p className="text-sm opacity-90">お気に入り・プロフィール</p>
            </div>
          </Link>
        </div>
      </div>
      </main>

      <Footer />
    </div>
  );
}
