// app/recipes/page.tsx
import Image from "next/image";
import Link from "next/link";
import { wp } from "@/lib/wp";
import type { WPRecipe } from "@/types/recipe";

// ビルド時に外部WPを叩かず、実行時ISRで取得する
export const dynamic = "force-static";
export const revalidate = 300; // 5分ごとに再生成（適宜調整）

async function getRecipes(): Promise<WPRecipe[]> {
  try {
    // /api/wp 経由（lib/wp が内部でプロキシを呼ぶ）
    // ※ /wp-json は付けない。/wp/v2/... を渡す
    const data = await wp<WPRecipe[]>(
      "/wp/v2/recipe?per_page=12&_embed=1",
      { next: { revalidate: 300, tags: ["recipes"] } }
    );
    // フォールバック時は空配列が返る設計
    return Array.isArray(data) ? data : [];
  } catch {
    // 取得失敗時でもページを落とさない
    return [];
  }
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-extrabold tracking-tight mb-4">レシピ一覧</h1>

      {(!recipes || recipes.length === 0) && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 mb-4">
          <p className="text-sm text-yellow-900">
            ただいまレシピを取得できませんでした。時間をおいて再度お試しください。
          </p>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {recipes?.map((r) => {
          const media = r._embedded?.["wp:featuredmedia"]?.[0] as
            | { source_url?: string }
            | undefined;
          const img = media?.source_url ?? "";

          // タイトルのHTMLタグ除去
          const title =
            (r.title?.rendered ?? "").replace(/<[^>]*>/g, "").trim() || "Untitled";

          return (
            <article
              key={r.id}
              className="rounded-xl overflow-hidden bg-white border border-gray-200"
            >
              <Link href={`/recipes/${r.slug}`} className="block relative aspect-square">
                {img ? (
                  <Image
                    src={img}
                    alt={title}
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
                  {title}
                </h3>
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}
