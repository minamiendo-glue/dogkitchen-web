// app/recipes/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { wpFetch } from '@/lib/wp';
import type { WPRecipe } from '@/types/recipe';

export const revalidate = 60; // ページ単位のISR

async function getRecipes() {
  // 12件、アイキャッチ埋め込み
  const data = await wpFetch<WPRecipe[]>(
    `/wp-json/wp/v2/recipe?per_page=12&_embed=1`
  );
  return data;
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-extrabold tracking-tight mb-4">レシピ一覧</h1>

      {recipes.length === 0 && <p>まだレシピがありません。</p>}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {recipes.map((r) => {
          const media = r._embedded?.['wp:featuredmedia']?.[0];
          const img = media?.source_url;

          return (
            <article key={r.id} className="rounded-xl overflow-hidden bg-white border border-gray-200">
              <Link href={`/recipes/${r.slug}`} className="block relative aspect-square">
                {img ? (
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
                {/* タイトルを白文字で重ねる（黒グラデ） */}
                <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/60 to-transparent" />
                <h3 className="absolute top-3 left-3 right-3 text-white font-extrabold leading-tight drop-shadow">
                  {r.title.rendered.replace(/<[^>]*>/g, '')}
                </h3>
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}
