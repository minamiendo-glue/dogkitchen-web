// lib/wp.ts
export async function wp<T = any>(
  path: string, // 例: "/wp/v2/recipe?per_page=12&_embed=1"
  init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T> {
  const url = `/api/wp?path=${encodeURIComponent(path)}`;

  const res = await fetch(url, {
    ...init,
    next: init?.next ?? { revalidate: 300, tags: ["wp"] },
  });

  if (!res.ok) {
    throw new Error(`proxy fetch failed (${res.status})`);
  }

  const data = (await res.json()) as any;

  if (data?.error === "fallback" && Array.isArray(data.items)) {
    return [] as T;
  }
  return data as T;
}
