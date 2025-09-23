// app/api/wp/route.ts
export const runtime = "edge";
export const preferredRegion = ["hnd1"]; // 東京を優先

function buildWpUrl(path: string) {
  const base = process.env.WP_URL!.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}/wp-json${normalized}`;
}

async function fetchWp(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  headers.set("User-Agent", "dogkitchen-web/edge-proxy");

  const user = process.env.WP_BASIC_USER;
  const pass = process.env.WP_BASIC_PASS;
  if (user && pass) {
    const token =
      typeof btoa !== "undefined"
        ? btoa(`${user}:${pass}`)
        : Buffer.from(`${user}:${pass}`).toString("base64");
    headers.set("Authorization", `Basic ${token}`);
  }

  const url = buildWpUrl(path);
  
  // キャッシュ戦略を改善（GETリクエストのみキャッシュ）
  const cacheStrategy = init?.method === 'GET' ? 'force-cache' : 'no-store';
  
  for (const wait of [0, 150, 400, 800]) {
    try {
      if (wait) await new Promise((r) => setTimeout(r, wait));
      const res = await fetch(url, { 
        ...init, 
        headers, 
        cache: cacheStrategy,
        // タイムアウトを設定
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) return res;
      if (![403, 429, 500, 502, 503, 504].includes(res.status)) return res;
    } catch (error) {
      // タイムアウトやネットワークエラーの場合は早期リターン
      if (error instanceof Error && error.name === 'TimeoutError') {
        break;
      }
      // ここは握りつぶしてリトライ継続
    }
  }

  // フォールバック（空構造）でアプリを落とさない
  return new Response(JSON.stringify({ items: [], error: "fallback" }), {
    status: 200,
    headers: { "content-type": "application/json", "x-fallback": "1" },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  if (!path) {
    return new Response(JSON.stringify({ error: "missing path" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  const res = await fetchWp(path, { method: "GET" });
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
