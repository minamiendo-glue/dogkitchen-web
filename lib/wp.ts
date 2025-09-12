// lib/wp.ts
const WP_URL = process.env.WP_URL!;

type FetchOpts = {
  next?: { revalidate?: number } | undefined;
};

export async function wpFetch<T>(path: string, opts: FetchOpts = { next: { revalidate: 60 } }) {
  const url = `${WP_URL.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: opts.next,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WP fetch failed (${res.status}): ${url}\n${text}`);
  }
  return res.json() as Promise<T>;
}
