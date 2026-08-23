import { prisma } from "./db";

const API = "https://www.googleapis.com/youtube/v3";

export type SyncResult = {
  ok: boolean;
  imported: number;
  updated: number;
  skipped: number;
  total: number;
  error?: string;
  at: string;
};

type Thumbs = Record<string, { url: string } | undefined>;

function bestThumb(t: Thumbs) {
  return (t.maxres ?? t.standard ?? t.high ?? t.medium ?? t.default)?.url ?? "";
}

async function api(path: string, params: Record<string, string>) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");
  const url = `${API}/${path}?${new URLSearchParams({ ...params, key })}`;
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? `YouTube API ${res.status}`);
  return json;
}

/**
 * Pull the channel's uploads playlist and upsert into Episode.
 * Uses playlistItems (1 quota unit/page) rather than search.list (100).
 * Existing rows are never clobbered once `locked` — that flag is set the moment
 * an admin edits an episode, so hand-written copy survives every later sync.
 */
export async function syncChannel(maxPages = 4): Promise<SyncResult> {
  const at = new Date().toISOString();
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) return { ok: false, imported: 0, updated: 0, skipped: 0, total: 0, error: "YOUTUBE_CHANNEL_ID is not set", at };

  try {
    const ch = await api("channels", { part: "contentDetails", id: channelId });
    const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploads) throw new Error(`Channel ${channelId} not found or has no uploads playlist`);

    const items: { id: string; title: string; description: string; thumbnail: string; publishedAt: Date }[] = [];
    let pageToken: string | undefined;
    for (let page = 0; page < maxPages; page++) {
      const res = await api("playlistItems", {
        part: "snippet,contentDetails",
        playlistId: uploads,
        maxResults: "50",
        ...(pageToken ? { pageToken } : {}),
      });
      for (const it of res.items ?? []) {
        const videoId = it.contentDetails?.videoId;
        if (!videoId) continue;
        items.push({
          id: videoId,
          title: it.snippet.title,
          description: it.snippet.description ?? "",
          thumbnail: bestThumb(it.snippet.thumbnails ?? {}),
          // contentDetails.videoPublishedAt is the real upload time; snippet is the playlist-add time
          publishedAt: new Date(it.contentDetails.videoPublishedAt ?? it.snippet.publishedAt),
        });
      }
      pageToken = res.nextPageToken;
      if (!pageToken) break;
    }

    // durations come from a separate endpoint (1 unit per 50 ids)
    const durations = new Map<string, string>();
    for (let i = 0; i < items.length; i += 50) {
      const batch = items.slice(i, i + 50);
      const res = await api("videos", { part: "contentDetails", id: batch.map((v) => v.id).join(",") });
      for (const v of res.items ?? []) durations.set(v.id, v.contentDetails?.duration ?? "");
    }

    const existing = new Map(
      (await prisma.episode.findMany({ select: { youtubeId: true, locked: true } })).map((e) => [e.youtubeId, e]),
    );

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const v of items) {
      const prev = existing.get(v.id);
      if (!prev) {
        await prisma.episode.create({
          data: {
            youtubeId: v.id,
            title: v.title,
            description: v.description,
            thumbnail: v.thumbnail,
            publishedAt: v.publishedAt,
            duration: durations.get(v.id) || null,
            order: 0,
          },
        });
        imported++;
      } else if (prev.locked) {
        skipped++; // admin owns this row now
      } else {
        await prisma.episode.update({
          where: { youtubeId: v.id },
          data: {
            title: v.title,
            description: v.description,
            thumbnail: v.thumbnail,
            publishedAt: v.publishedAt,
            duration: durations.get(v.id) || null,
          },
        });
        updated++;
      }
    }

    const result: SyncResult = { ok: true, imported, updated, skipped, total: items.length, at };
    await prisma.setting.upsert({ where: { key: "lastSync" }, create: { key: "lastSync", value: result }, update: { value: result } });
    return result;
  } catch (e) {
    const result: SyncResult = {
      ok: false, imported: 0, updated: 0, skipped: 0, total: 0,
      error: e instanceof Error ? e.message : "Unknown sync error", at,
    };
    await prisma.setting.upsert({ where: { key: "lastSync" }, create: { key: "lastSync", value: result }, update: { value: result } });
    return result;
  }
}

export async function getLastSync(): Promise<SyncResult | null> {
  const row = await prisma.setting.findUnique({ where: { key: "lastSync" } });
  return (row?.value as SyncResult) ?? null;
}

export { formatDuration, parseVideoId } from "./video";
