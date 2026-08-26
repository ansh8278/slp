import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatDateShort } from "@/lib/site";
import { formatDuration } from "@/lib/video";
import { Tilt3D } from "@/components/Tilt3D";
import { DoodleMic, DoodleHeadphones, DoodleSparkles, DoodleShield, DoodlePlay } from "@/components/DoodleIcons";
import { PlayTrigger } from "@/components/PlayTrigger";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Episodes Vault — Security Leader Podcast",
  description: "Browse all high-impact security podcast episodes featuring executive CISOs and industry leaders.",
  alternates: { canonical: "/episodes" },
  openGraph: {
    title: "Episodes Vault — Security Leader Podcast",
    description: "Browse all high-impact security podcast episodes featuring executive CISOs and industry leaders.",
    url: "/episodes",
  },
};

export default async function EpisodesLibraryPage() {
  const episodes = await prisma.episode.findMany({
    where: { published: true },
    orderBy: [{ order: "desc" }, { publishedAt: "desc" }],
  });

  const featuredEpisode = episodes.find((e) => e.featured) ?? episodes[0];
  const allEpisodesList = episodes;

  return (
    <div className="relative min-h-svh overflow-x-clip pb-24 text-bone">
      
      {/* Masthead Header */}
      <section className="relative grid min-h-[50svh] content-end overflow-hidden px-[clamp(18px,4vw,56px)] pt-[clamp(130px,20vh,220px)] pb-[clamp(40px,7vh,80px)]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(56% 50% at 24% 18%, rgba(31,121,192,0.28), transparent 70%), radial-gradient(44% 38% at 84% 76%, rgba(130,201,30,0.18), transparent 72%)",
          }}
        />
        
        <div className="shell relative px-0">
          <div className="inline-flex items-center gap-3 rounded-full border border-steel/20 bg-ink-2/80 px-4 py-1.5 backdrop-blur-md">
            <DoodleMic className="h-4 w-4" stroke="#82c91e" />
            <span className="kicker">Archive Vault</span>
            <span className="font-mono text-xs text-signal-bright font-bold">({episodes.length} Episodes)</span>
          </div>

          <h1 className="display mt-6 text-[clamp(40px,7.5vw,120px)] leading-[1.05]">
            Explore The <span className="funky-text text-signal-bright font-normal">Episodes</span> Vault
          </h1>
          <p className="mt-4 max-w-[65ch] text-[clamp(15px,1.2vw,18px)] leading-relaxed text-steel-dim">
            Deep-dive conversations with executive CISOs, security architects, and global technology pioneers.
          </p>
        </div>
      </section>

      {/* Featured Episode Showcase */}
      {featuredEpisode && (
        <section className="rule px-[clamp(18px,4vw,56px)] py-12">
          <div className="shell px-0">
            <div className="mb-6 flex items-center gap-2">
              <DoodleSparkles className="h-5 w-5 text-signal-bright" />
              <span className="kicker">Featured Episode</span>
            </div>

            <Tilt3D maxTilt={6} scale={1.01} className="w-full">
              <div className="group preserve-3d relative grid gap-8 rounded-3xl border border-steel/20 bg-ink-2/90 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] items-center shadow-2xl backdrop-blur-xl">
                
                {/* Left Media Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink-3 shadow-xl group-hover:shadow-signal/20 transition-all duration-500">
                  <Image
                    src={featuredEpisode.thumbnail.includes("maxresdefault") ? featuredEpisode.thumbnail.replace("maxresdefault", "hqdefault") : (featuredEpisode.thumbnail || `https://i.ytimg.com/vi/${featuredEpisode.youtubeId}/hqdefault.jpg`)}
                    alt={featuredEpisode.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />
                  
                  {/* Big Interactive Play Trigger */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayTrigger videoId={featuredEpisode.youtubeId} title={featuredEpisode.title}>
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bone text-ink shadow-2xl transition-transform duration-500 group-hover:scale-110 hover:bg-signal hover:text-bone cursor-pointer">
                        <DoodlePlay className="h-8 w-8 ml-1" />
                      </div>
                    </PlayTrigger>
                  </div>

                  {/* Duration pill */}
                  {featuredEpisode.duration && (
                    <div className="absolute bottom-4 left-4 rounded-full border border-steel/20 bg-ink/90 px-3 py-1 font-mono text-xs font-bold text-bone backdrop-blur-md">
                      {formatDuration(featuredEpisode.duration)}
                    </div>
                  )}
                </div>

                {/* Right Content */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-steel-dim">
                    <span>{formatDateShort(featuredEpisode.publishedAt)}</span>
                    <span>·</span>
                    <span className="rounded-full bg-signal/20 px-3 py-0.5 font-bold text-signal-bright">
                      ★ FEATURED
                    </span>
                  </div>

                  <Link href={`/episodes/${featuredEpisode.id}`} className="group-hover:text-signal-bright transition-colors">
                    <h2 className="display text-[clamp(24px,3vw,42px)] leading-tight text-bone">
                      {featuredEpisode.title}
                    </h2>
                  </Link>

                  {featuredEpisode.summary && (
                    <p className="text-[14.5px] leading-relaxed text-steel-dim line-clamp-3">
                      {featuredEpisode.summary}
                    </p>
                  )}

                  {/* Guest Info */}
                  {featuredEpisode.guestName && (
                    <div className="flex items-center gap-3.5 pt-2 border-t border-steel/15">
                      {featuredEpisode.guestPhoto ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-steel/20">
                          <Image src={featuredEpisode.guestPhoto} alt={featuredEpisode.guestName} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal/20 font-display text-lg text-signal-bright">
                          {featuredEpisode.guestName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="block font-display text-base text-bone font-medium">
                          {featuredEpisode.guestName}
                        </span>
                        <span className="block font-mono text-xs text-steel-dim">
                          {featuredEpisode.guestTitle} {featuredEpisode.guestCompany ? `at ${featuredEpisode.guestCompany}` : ""}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <PlayTrigger videoId={featuredEpisode.youtubeId} title={featuredEpisode.title}>
                      <button type="button" className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-bone px-6 py-3 font-mono text-xs tracking-wider uppercase text-ink font-bold transition-all hover:bg-signal hover:text-bone hover:scale-105 shadow-lg">
                        <DoodlePlay className="h-4 w-4" /> Watch Video
                      </button>
                    </PlayTrigger>

                    <Link href={`/episodes/${featuredEpisode.id}`} className="inline-flex items-center gap-2 rounded-full border border-steel/25 px-6 py-3 font-mono text-xs tracking-wider uppercase text-steel transition-all hover:border-steel hover:text-bone hover:scale-105">
                      Episode Details →
                    </Link>
                  </div>

                </div>

              </div>
            </Tilt3D>
          </div>
        </section>
      )}

      {/* Regular Episodes Grid */}
      <section className="rule px-[clamp(18px,4vw,56px)] py-12">
        <div className="shell px-0">
          <div className="mb-8 flex items-center justify-between">
            <span className="kicker">All Episodes ({allEpisodesList.length})</span>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {allEpisodesList.map((ep) => (
              <Tilt3D key={ep.id} maxTilt={10} scale={1.02}>
                <article className="group preserve-3d relative flex flex-col justify-between overflow-hidden rounded-3xl border border-steel/15 bg-ink-2/80 p-5 backdrop-blur-sm transition-all duration-500 hover:border-signal/50 hover:shadow-2xl h-full">
                  
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink-3 mb-4">
                      <Image
                        src={ep.thumbnail.includes("maxresdefault") ? ep.thumbnail.replace("maxresdefault", "hqdefault") : (ep.thumbnail || `https://i.ytimg.com/vi/${ep.youtubeId}/hqdefault.jpg`)}
                        alt={ep.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <PlayTrigger videoId={ep.youtubeId} title={ep.title}>
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bone text-ink shadow-xl cursor-pointer hover:scale-110 transition-transform">
                            <DoodlePlay className="h-6 w-6 ml-0.5" />
                          </div>
                        </PlayTrigger>
                      </div>

                      {ep.duration && (
                        <span className="absolute bottom-3 right-3 rounded-md bg-ink/90 px-2 py-0.5 font-mono text-[10px] font-bold text-bone">
                          {formatDuration(ep.duration)}
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 font-mono text-[11px] text-steel-dim uppercase mb-2">
                      <span>{formatDateShort(ep.publishedAt)}</span>
                    </div>

                    {/* Title */}
                    <Link href={`/episodes/${ep.id}`}>
                      <h3 className="display text-xl leading-snug text-bone transition-colors group-hover:text-signal-bright line-clamp-2">
                        {ep.title}
                      </h3>
                    </Link>

                    {/* Summary */}
                    {ep.summary && (
                      <p className="mt-2 text-xs leading-relaxed text-steel-dim line-clamp-3">
                        {ep.summary}
                      </p>
                    )}
                  </div>

                  {/* Guest & Action */}
                  <div className="mt-6 pt-4 border-t border-steel/15 flex items-center justify-between">
                    {ep.guestName ? (
                      <span className="font-mono text-xs text-steel">
                        👤 {ep.guestName}
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-steel-dim">
                        🎙️ Executive Interview
                      </span>
                    )}

                    <Link href={`/episodes/${ep.id}`} className="font-mono text-xs text-signal-bright hover:underline flex items-center gap-1">
                      View →
                    </Link>
                  </div>

                </article>
              </Tilt3D>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
