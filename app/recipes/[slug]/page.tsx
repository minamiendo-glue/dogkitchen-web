// app/recipes/[slug]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { wp } from "@/lib/wp";
import type { WPRecipe } from "@/types/recipe";

// 実行時ISR（ビルド時にWPへ行かない）
export const dynamic = "force-static";
export const revalidate = 300;

async function getRecipe(slug: string) {
  // /api/wp 経由。/wp-json は付けない（/wp/v2/... を渡す）
  const list = await wp<WPRecipe[]>(
    `/wp/v2/recipe?slug=${encodeURIComponent(slug)}&_embed=1`,
    { next: { revalidate: 300, tags: ["recipes"] } }
  );
  return Array.isArray(list) ? list[0] : undefined;
}

export default async function RecipeDetail({ params }: { params: { slug: string } }) {
  const recipe = await getRecipe(params.slug);
  if (!recipe) return notFound();

  const media = recipe._embedded?.["wp:featuredmedia"]?.[0];
  const img = media?.source_url ?? "";
  const title = (recipe.title?.rendered ?? "").replace(/<[^>]*>/g, "").trim();

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-3xl font-extrabold mb-3">{title || "Untitled"}</h1>

      {img && (
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
          <Image src={img} alt={title} fill className="object-cover" />
        </div>
      )}

      {recipe.content?.rendered && (
        <article
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: recipe.content.rendered }}
        />
      )}
    </main>
  );
}
