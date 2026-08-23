/** Pure YouTube helpers — no DB, safe to import from client components. */

/** PT1H2M10S -> "1:02:10". Returns null for missing/unparseable input. */
export function formatDuration(iso?: string | null): string | null {
  if (!iso) return null;
  const m = /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return null;
  const [d, h, min, s] = m.slice(1).map((x) => Number(x ?? 0) || 0);
  const hours = d * 24 + h;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours ? `${hours}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
}

/** Accepts a full URL or a bare id; returns the 11-char video id or null. */
export function parseVideoId(input: string): string | null {
  const raw = input.trim();
  if (/^[\w-]{11}$/.test(raw)) return raw;
  try {
    const u = new URL(raw);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).match(/^[\w-]{11}$/)?.[0] ?? null;
    const v = u.searchParams.get("v");
    if (v && /^[\w-]{11}$/.test(v)) return v;
    const m = u.pathname.match(/\/(?:embed|shorts|live|v)\/([\w-]{11})/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}
