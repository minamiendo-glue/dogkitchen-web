// app/recipes/[slug]/page.tsx
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { wpFetch } from '@/lib/wp';
import type { WPRecipe } from '@/types/recipe';

export const revalidate = 60;

async function getRecipe(slug: string) {
  const data = await wpFetch<WPRecipe[]>(
    `/wp-json/wp/v2/recipe?slug=${encodeURIComponent(slug)}&_embed=1`
  );
  return data[0]; // slug はユニーク想定
}

export default async function RecipeDetail({ params }: { params: { slug: string } }) {
  const recipe = await getRecipe(params.slug);
  if (!recipe) return notFound();

  const media = recipe._embedded?.['wp:featuredmedia']?.[0];
  const img = media?.source_url;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-3xl font-extrabold mb-3">{recipe.title.rendered.replace(/<[^>]*>/g, '')}</h1>

      {img && (
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
          <Image src={img} alt="" fill className="object-cover" />
        </div>
      )}

      {/* WordPressの本文はHTMLが入るので危険な挿入に注意（WP信頼が前提） */}
      {recipe.content?.rendered && (
        <article
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: recipe.content.rendered }}
        />
      )}
    </main>
  );
}
