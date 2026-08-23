"use client";

import { useEffect, useRef, useState } from "react";
import { Tilt3D } from "./Tilt3D";
import { DoodleShield, DoodleMic, DoodleLock, DoodleHeadphones, DoodleKey, DoodleRadar } from "./DoodleIcons";

type Topic = { title: string; body: string };

const DOODLE_LIST = [DoodleShield, DoodleMic, DoodleLock, DoodleHeadphones, DoodleKey, DoodleRadar];

/**
 * Horizontal editorial rail. Scroll-snaps natively on touch; the desktop
 * progress bar is driven by the scroll container itself, not rAF.
 */
export function TopicsRail({ topics }: { topics: Topic[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <div
        ref={ref}
        className="no-scrollbar -mx-[clamp(18px,4vw,56px)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(18px,4vw,56px)] pb-4 pt-2"
      >
        {topics.map((t, i) => {
          const Icon = DOODLE_LIST[i % DOODLE_LIST.length];
          return (
            <Tilt3D
              key={t.title}
              maxTilt={12}
              scale={1.03}
              className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[clamp(300px,25vw,380px)]"
            >
              <article
                className="group preserve-3d relative flex min-h-[clamp(240px,30vw,340px)] w-full flex-col justify-between overflow-hidden rounded-3xl border border-steel/15 bg-ink-2/90 p-6 backdrop-blur-sm transition-colors duration-500 hover:border-signal/50 shadow-xl"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{ background: "radial-gradient(120% 90% at 50% 110%, rgba(31,121,192,0.25), transparent 68%)" }}
                />
                <div className="flex items-center justify-between translate-z-30">
                  <span className="font-display text-[clamp(34px,4vw,56px)] leading-none text-steel/20 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="h-6 w-6 opacity-75 transition-transform duration-500 group-hover:scale-125 group-hover:opacity-100" />
                </div>
                <div className="relative translate-z-20">
                  <h3 className="display text-[clamp(21px,2.2vw,30px)] text-bone">{t.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-steel-dim">{t.body}</p>
                </div>
                <span aria-hidden className="absolute right-5 bottom-5 font-mono text-steel-dim/40 transition-[transform,color] duration-500 group-hover:translate-x-1 group-hover:text-signal-bright translate-z-40">→</span>
              </article>
            </Tilt3D>
          );
        })}
      </div>

      <div className="mt-6 h-px w-full bg-steel/12" role="presentation">
        <div
          className="h-px bg-signal transition-[width] duration-150 ease-out"
          style={{ width: `${Math.max(12, progress * 100)}%` }}
        />
      </div>
    </div>
  );
}

/** Slow brand marquee — the show's actual remit, straight from the site copy. */
export function Marquee({ words }: { words: string[] }) {
  const run = [...words, ...words];
  return (
    <div aria-hidden className="relative flex overflow-hidden py-[clamp(28px,5vh,56px)]">
      <div className="marquee-track flex shrink-0 items-center gap-10 pr-10">
        {run.map((w, i) => {
          const Icon = DOODLE_LIST[i % DOODLE_LIST.length];
          return (
            <span key={i} className="flex items-center gap-8">
              <span className="display text-[clamp(30px,5.2vw,80px)] whitespace-nowrap text-steel/16 flex items-center gap-4">
                {w}
              </span>
              <Icon className="h-7 w-7 opacity-40 text-signal-bright" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
