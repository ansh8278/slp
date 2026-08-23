import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const latest = await prisma.episode.findFirst({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: { publishedAt: true },
  });
  const homeModified = latest?.publishedAt ?? new Date();

  return [
    { url: SITE_URL, lastModified: homeModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
