// lib/wp.ts
type FallbackJSON = { items: unknown[]; error: "fallback" };

function isFallbackJSON(v: unknown): v is FallbackJSON {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return o.error === "fallback" && Array.isArray(o.items);
}

export async function wp<T>(
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

  const data: unknown = await res.json();

  // /api/wp は失敗時に {items:[], error:"fallback"} を返す仕様
  if (isFallbackJSON(data)) {
    // 呼び出し側が配列を期待するケースでは問題にならないよう空配列を返す
    return [] as unknown as T;
  }

  return data as T;
}
