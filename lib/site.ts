import { prisma } from "./db";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://securityleaderpodcast.com";

export type PublicEpisode = {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: Date;
  duration: string | null;
  summary: string | null;
  guestName: string | null;
  guestTitle: string | null;
  guestCompany: string | null;
  spotifyUrl: string | null;
  appleUrl: string | null;
};

const publicSelect = {
  id: true, youtubeId: true, title: true, description: true, thumbnail: true,
  publishedAt: true, duration: true, summary: true, guestName: true,
  guestTitle: true, guestCompany: true, spotifyUrl: true, appleUrl: true,
} as const;

/** Featured is admin-picked; falls back to the newest published episode. */
export async function getFeatured(): Promise<PublicEpisode | null> {
  try {
    return (
      (await prisma.episode.findFirst({ where: { published: true, featured: true }, orderBy: { publishedAt: "desc" }, select: publicSelect })) ??
      (await prisma.episode.findFirst({ where: { published: true }, orderBy: { publishedAt: "desc" }, select: publicSelect }))
    );
  } catch (e) {
    console.warn("[getFeatured] Database query failed:", e);
    return null;
  }
}

/** Manual `order` wins (higher first), then newest. */
export async function getEpisodes(take?: number): Promise<PublicEpisode[]> {
  try {
    return await prisma.episode.findMany({
      where: { published: true },
      orderBy: [{ order: "desc" }, { publishedAt: "desc" }],
      ...(take ? { take } : {}),
      select: publicSelect,
    });
  } catch (e) {
    console.warn("[getEpisodes] Database query failed:", e);
    return [];
  }
}

export function youtubeUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(d);
}

export function formatDateShort(d: Date) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit", timeZone: "UTC" }).format(d);
}

/** YouTube descriptions carry links/hashtags — trim to a clean lede for cards. */
export function excerpt(text: string, max = 165) {
  const clean = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !/^https?:\/\//.test(l) && !/^#\w/.test(l))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return "";
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", max) || max).trimEnd() + "…";
}
