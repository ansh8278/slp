import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { getLastSync } from "@/lib/youtube";
import { formatDuration } from "@/lib/video";
import { formatDateShort } from "@/lib/site";
import { SyncPanel } from "@/components/admin/SyncPanel";
import { deleteEpisode, reorder, setFeatured, togglePublished } from "@/app/admin/actions";
import { Tilt3D } from "@/components/Tilt3D";

export const dynamic = "force-dynamic";

export default async function EpisodesPage() {
  const [episodes, last] = await Promise.all([
    prisma.episode.findMany({ orderBy: [{ order: "desc" }, { publishedAt: "desc" }] }),
    getLastSync(),
  ]);

  const publishedCount = episodes.filter((e) => e.published).length;
  const featuredCount = episodes.filter((e) => e.featured).length;

  return (
    <div className="flex flex-col gap-8">
      
      {/* YouTube Sync Panel */}
      <SyncPanel last={last} configured={Boolean(process.env.YOUTUBE_API_KEY)} />

      {/* Header & Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-steel/15 bg-ink-2/80 p-6 backdrop-blur-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal-bright animate-pulse" />
            <h1 className="display text-[clamp(24px,3vw,38px)] text-bone">Episodes Dashboard</h1>
          </div>
          <p className="mt-1 font-mono text-[11.5px] text-steel-dim flex items-center gap-3">
            <span>total: <strong className="text-bone">{episodes.length}</strong></span>
            <span>·</span>
            <span>published: <strong className="text-signal-bright">{publishedCount}</strong></span>
            <span>·</span>
            <span>featured: <strong className="text-[#82c91e]">{featuredCount}</strong></span>
          </p>
        </div>
        
        <Link
          href="/admin/episodes/new"
          className="inline-flex items-center gap-2 rounded-full bg-bone px-6 py-3 font-mono text-[11px] tracking-[0.16em] text-ink font-bold uppercase transition-all duration-300 hover:scale-105 hover:bg-signal hover:text-bone shadow-md"
        >
          + Create New Episode
        </Link>
      </div>

      {/* Episode Cards List */}
      {episodes.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-steel/20 p-16 text-center font-mono text-sm text-steel-dim bg-ink-2/40">
          No episodes found in database. Run a YouTube sync above or create a new episode manually.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {episodes.map((ep, i) => (
            <Tilt3D key={ep.id} maxTilt={6} scale={1.01}>
              <div className="group preserve-3d flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-steel/15 bg-ink-2/90 p-4 sm:p-5 backdrop-blur-xl shadow-md transition-all duration-300 hover:border-signal/50 hover:shadow-xl">
                
                {/* Left Thumbnail & Metadata */}
                <div className="flex flex-1 items-center gap-4 min-w-[280px]">
                  <div className="relative aspect-video w-[110px] sm:w-[130px] shrink-0 overflow-hidden rounded-xl bg-ink-3 shadow-md">
                    {ep.thumbnail ? (
                      <Image src={ep.thumbnail} alt="" fill sizes="130px" className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-steel-dim">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 min-w-0">
                    <Link
                      href={`/admin/episodes/${ep.id}`}
                      className="line-clamp-2 font-display text-[16px] sm:text-[17px] leading-snug text-bone transition-colors hover:text-signal-bright font-medium"
                    >
                      {ep.title}
                    </Link>
                    
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-steel-dim uppercase">
                      <span>{formatDateShort(ep.publishedAt)}</span>
                      {formatDuration(ep.duration) && (
                        <>
                          <span>·</span>
                          <span>{formatDuration(ep.duration)}</span>
                        </>
                      )}
                      <span>·</span>
                      <span className="text-steel-dim/80">{ep.youtubeId}</span>

                      {ep.featured && (
                        <span className="rounded-full bg-[#82c91e] px-2.5 py-0.5 text-[9px] font-bold text-ink shadow-sm">
                          ★ Featured
                        </span>
                      )}
                      {!ep.published && (
                        <span className="rounded-full border border-steel/25 bg-ink-3 px-2 py-0.5 text-[9px] text-steel-dim">
                          Hidden
                        </span>
                      )}
                      {ep.locked && (
                        <span className="rounded-full border border-steel/25 bg-ink-3 px-2 py-0.5 text-[9px] text-steel-dim" title="Edited — sync will not overwrite">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <Reorder id={ep.id} dir="up" disabled={i === 0} />
                  <Reorder id={ep.id} dir="down" disabled={i === episodes.length - 1} />

                  {!ep.featured && (
                    <form action={setFeatured}>
                      <input type="hidden" name="id" value={ep.id} />
                      <MiniButton>Feature</MiniButton>
                    </form>
                  )}

                  <form action={togglePublished}>
                    <input type="hidden" name="id" value={ep.id} />
                    <MiniButton>{ep.published ? "Hide" : "Publish"}</MiniButton>
                  </form>

                  <Link
                    href={`/admin/episodes/${ep.id}`}
                    className="rounded-full border border-steel/25 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-steel uppercase transition-all hover:border-steel hover:text-bone hover:scale-105"
                  >
                    Edit
                  </Link>

                  <form action={deleteEpisode}>
                    <input type="hidden" name="id" value={ep.id} />
                    <MiniButton danger>Delete</MiniButton>
                  </form>
                </div>

              </div>
            </Tilt3D>
          ))}
        </div>
      )}

    </div>
  );
}

function MiniButton({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      type="submit"
      className={`cursor-pointer rounded-full border px-3.5 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-all duration-300 hover:scale-105 ${
        danger
          ? "border-[#c2544e]/50 bg-[#c2544e]/10 text-[#e08a84] hover:bg-[#c2544e] hover:text-bone"
          : "border-steel/25 bg-ink-3/60 text-steel hover:border-steel hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}

function Reorder({ id, dir, disabled }: { id: string; dir: "up" | "down"; disabled: boolean }) {
  return (
    <form action={reorder}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dir" value={dir} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={`Move ${dir}`}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-steel/25 bg-ink-3 font-mono text-[11px] text-steel transition-all hover:border-steel hover:text-bone hover:scale-110 disabled:cursor-default disabled:opacity-25"
      >
        {dir === "up" ? "↑" : "↓"}
      </button>
    </form>
  );
}
