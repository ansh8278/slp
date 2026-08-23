/**
 * One-off seed from the channel's official Atom feed, so the site has real
 * episodes before a YOUTUBE_API_KEY is provisioned. The feed carries no
 * duration and a truncated description — once the key is set, `npm run sync`
 * (Data API v3) fills those in and takes over. Run: npm run bootstrap
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const NS = { yt: "http://www.youtube.com/xml/schemas/2015", media: "http://search.yahoo.com/mrss/" };

function tag(block: string, name: string) {
  const m = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`).exec(block);
  return m
    ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'").replace(/&amp;/g, "&").trim()
    : "";
}

async function main() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) throw new Error("YOUTUBE_CHANNEL_ID is not set");

  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
  if (!res.ok) throw new Error(`Channel feed returned ${res.status}`);
  const xml = await res.text();

  const entries = xml.split("<entry>").slice(1);
  let imported = 0;
  let skipped = 0;

  for (const e of entries) {
    const youtubeId = tag(e, "yt:videoId");
    if (!youtubeId) continue;
    if (await prisma.episode.findUnique({ where: { youtubeId }, select: { id: true } })) {
      skipped++;
      continue;
    }
    await prisma.episode.create({
      data: {
        youtubeId,
        title: tag(e, "title"),
        description: tag(e, "media:description"),
        thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
        publishedAt: new Date(tag(e, "published")),
      },
    });
    imported++;
  }

  // newest becomes the featured episode if nothing is featured yet
  if (!(await prisma.episode.findFirst({ where: { featured: true } }))) {
    const newest = await prisma.episode.findFirst({ where: { published: true }, orderBy: { publishedAt: "desc" } });
    if (newest) await prisma.episode.update({ where: { id: newest.id }, data: { featured: true } });
  }

  console.log(`Bootstrapped from channel feed: ${imported} imported, ${skipped} already present.`);
}

main().catch((e) => { console.error(e.message); process.exit(1); }).finally(() => prisma.$disconnect());
