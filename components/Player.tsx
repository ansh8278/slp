"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Video = { youtubeId: string; title: string; guest?: string | null; date?: string };

const PlayerCtx = createContext<(v: Video) => void>(() => {});
export const usePlayer = () => useContext(PlayerCtx);

/**
 * Holds the single YouTube iframe for the whole site. Nothing is requested from
 * youtube.com until a video is actually opened — cards render static thumbnails.
 */
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [video, setVideo] = useState<Video | null>(null);
  const reduce = useReducedMotion();
  const open = useCallback((v: Video) => setVideo(v), []);

  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVideo(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [video]);

  return (
    <PlayerCtx.Provider value={open}>
      {children}
      <AnimatePresence>
        {video && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={video.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.32 }}
            onClick={() => setVideo(null)}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-8"
            style={{ background: "color-mix(in srgb, var(--color-ink) 92%, transparent)", backdropFilter: "blur(18px)" }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 0.98 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl"
            >
              <div className="mb-4 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h2 className="display truncate text-[clamp(18px,2.4vw,30px)] text-bone">{video.title}</h2>
                  {(video.guest || video.date) && (
                    <p className="kicker mt-1.5">{[video.guest, video.date].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setVideo(null)}
                  aria-label="Close player"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-steel/25 text-steel transition-colors hover:border-bone hover:text-bone"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" /></svg>
                </button>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-3xl bg-ink-2 ring-1 ring-steel/15">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="kicker mt-4 inline-block transition-colors hover:text-bone"
              >
                Open on YouTube ↗
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PlayerCtx.Provider>
  );
}

/** Circular play affordance used on cards and the featured still. */
export function PlayGlyph({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`flex items-center justify-center rounded-full border border-bone/35 bg-ink/45 backdrop-blur-md transition-all duration-500 group-hover:border-signal-bright group-hover:bg-signal ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.28} height={size * 0.31} viewBox="0 0 14 16" className="translate-x-[1px]">
        <path d="M0 0l14 8-14 8z" fill="currentColor" className="text-bone" />
      </svg>
    </span>
  );
}
