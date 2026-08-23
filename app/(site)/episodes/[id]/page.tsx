import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatDateShort } from "@/lib/site";
import { formatDuration } from "@/lib/video";
import { Tilt3D } from "@/components/Tilt3D";
import { DoodleShield, DoodleMic, DoodleHeadphones, DoodleSparkles } from "@/components/DoodleIcons";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const ep = await prisma.episode.findUnique({ where: { id } });
  if (!ep) return { title: "Episode Not Found" };
  return {
    title: `${ep.title} — Security Leader Podcast`,
    description: ep.summary || ep.description || "Executive Security Leader Podcast Episode",
  };
}

export default async function EpisodeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ep = await prisma.episode.findUnique({ where: { id } });
  if (!ep || !ep.published) notFound();

  return (
    <div className="relative min-h-svh pb-24 text-bone">
      
      {/* Ambient Radial Background Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 left-1/4 h-[500px] w-[500px] rounded-full bg-radial from-signal/20 via-signal-bright/10 to-transparent blur-3xl opacity-60"
      />

      {/* Breadcrumb Header */}
      <section className="relative px-[clamp(18px,4vw,56px)] pt-[clamp(130px,18vh,180px)] pb-6">
        <div className="shell px-0">
          <Link
            href="/episodes"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-steel-dim uppercase transition-colors hover:text-signal-bright mb-6"
          >
            ← Back to All Episodes
          </Link>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-steel-dim uppercase mb-4">
            <span className="rounded-full bg-signal/20 px-3 py-1 font-bold text-signal-bright">
              EPISODE
            </span>
            <span>{formatDateShort(ep.publishedAt)}</span>
            {ep.duration && (
              <>
                <span>·</span>
                <span>{formatDuration(ep.duration)}</span>
              </>
            )}
          </div>

          <h1 className="display max-w-[20ch] text-[clamp(32px,5.5vw,72px)] leading-tight text-bone">
            {ep.title}
          </h1>
        </div>
      </section>

      {/* Video Embed Player Section */}
      <section className="px-[clamp(18px,4vw,56px)] py-6">
        <div className="shell px-0">
          <Tilt3D maxTilt={4} scale={1.01}>
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-steel/20 bg-ink-2 shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${ep.youtubeId}?autoplay=1&rel=0`}
                title={ep.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </Tilt3D>

          {/* External Streaming Platform Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-steel/15 bg-ink-2/80 p-4 sm:p-5 backdrop-blur-md">
            <span className="font-mono text-xs tracking-wider text-steel-dim uppercase flex items-center gap-2">
              <DoodleHeadphones className="h-4 w-4" stroke="#82c91e" /> Stream On Demand:
            </span>
            
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://www.youtube.com/watch?v=${ep.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-steel/20 bg-ink-3 px-4 py-2 font-mono text-xs text-bone transition-all hover:border-signal hover:scale-105"
              >
                ▶ YouTube
              </a>
              {ep.spotifyUrl && (
                <a
                  href={ep.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-steel/20 bg-ink-3 px-4 py-2 font-mono text-xs text-bone transition-all hover:border-[#1DB954] hover:scale-105"
                >
                  🟢 Spotify
                </a>
              )}
              {ep.appleUrl && (
                <a
                  href={ep.appleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-steel/20 bg-ink-3 px-4 py-2 font-mono text-xs text-bone transition-all hover:border-[#FA243C] hover:scale-105"
                >
                  🍎 Apple Podcasts
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Episode Content Grid: Summary, Takeaways, Guest Profile, Transcript */}
      <section className="px-[clamp(18px,4vw,56px)] py-12">
        <div className="shell grid gap-12 lg:grid-cols-[1.3fr_0.7fr] px-0">
          
          {/* Main Left Content */}
          <div className="flex flex-col gap-10">
            
            {/* Overview / Summary */}
            {ep.summary && (
              <div className="flex flex-col gap-3">
                <h2 className="display text-2xl text-bone flex items-center gap-2">
                  <DoodleMic className="h-5 w-5 text-signal-bright" /> Overview
                </h2>
                <p className="text-base leading-relaxed text-steel-dim whitespace-pre-line">
                  {ep.summary}
                </p>
              </div>
            )}

            {/* Key Takeaways */}
            {ep.takeaways && ep.takeaways.length > 0 && (
              <div className="rounded-3xl border border-steel/15 bg-ink-2/80 p-6 sm:p-8 backdrop-blur-md">
                <h2 className="display text-2xl text-bone flex items-center gap-2 mb-4">
                  <DoodleSparkles className="h-5 w-5 text-signal-bright" /> Key Takeaways
                </h2>
                <ul className="flex flex-col gap-3 list-none p-0">
                  {ep.takeaways.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-steel-dim">
                      <span className="font-mono font-bold text-signal-bright">0{i + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Show Notes */}
            {ep.showNotes && (
              <div className="flex flex-col gap-3">
                <h2 className="display text-2xl text-bone">Show Notes</h2>
                <div className="text-sm leading-relaxed text-steel-dim whitespace-pre-line">
                  {ep.showNotes}
                </div>
              </div>
            )}

            {/* Full Transcript */}
            {ep.transcript && (
              <div className="rounded-3xl border border-steel/15 bg-ink-2/60 p-6 sm:p-8">
                <h2 className="display text-2xl text-bone mb-4">Full Transcript</h2>
                <div className="max-h-[500px] overflow-y-auto pr-3 font-mono text-xs leading-relaxed text-steel-dim/80 whitespace-pre-line">
                  {ep.transcript}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Guest Profile & Metadata */}
          <div className="flex flex-col gap-6">
            
            {/* Guest Card */}
            {ep.guestName && (
              <Tilt3D maxTilt={8} scale={1.02}>
                <div className="rounded-3xl border border-steel/15 bg-ink-2/90 p-6 shadow-xl backdrop-blur-xl">
                  <span className="kicker mb-3 block">Featured Guest</span>
                  <div className="flex items-center gap-4 mb-4">
                    {ep.guestPhoto ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border border-steel/20">
                        <Image src={ep.guestPhoto} alt={ep.guestName} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-signal/20 font-display text-2xl text-signal-bright">
                        {ep.guestName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="display text-xl text-bone">{ep.guestName}</h3>
                      <p className="font-mono text-xs text-steel-dim mt-0.5">
                        {ep.guestTitle}
                      </p>
                      {ep.guestCompany && (
                        <p className="font-mono text-xs text-signal-bright font-bold">
                          {ep.guestCompany}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Tilt3D>
            )}

            {/* Quick Details Card */}
            <div className="rounded-3xl border border-steel/15 bg-ink-2/60 p-6">
              <span className="kicker mb-3 block">Broadcast Details</span>
              <div className="flex flex-col gap-3 font-mono text-xs text-steel-dim">
                <div className="flex justify-between border-b border-steel/10 pb-2">
                  <span>Published:</span>
                  <span className="text-bone font-bold">{formatDateShort(ep.publishedAt)}</span>
                </div>
                <div className="flex justify-between border-b border-steel/10 pb-2">
                  <span>YouTube ID:</span>
                  <span className="text-bone font-bold">{ep.youtubeId}</span>
                </div>
                {ep.duration && (
                  <div className="flex justify-between border-b border-steel/10 pb-2">
                    <span>Duration:</span>
                    <span className="text-bone font-bold">{formatDuration(ep.duration)}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
