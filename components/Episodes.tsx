"use client";

import Image from "next/image";
import { useState } from "react";
import { usePlayer, PlayGlyph } from "./Player";
import { Tilt3D } from "./Tilt3D";
import type { PublicEpisode } from "@/lib/site";

type Card = Omit<PublicEpisode, "publishedAt"> & { dateLabel: string; excerpt: string; durationLabel: string | null };

function byline(ep: { guestName: string | null; guestTitle: string | null; guestCompany: string | null }) {
  if (!ep.guestName) return null;
  const detail = [ep.guestTitle, ep.guestCompany].filter(Boolean).join(", ");
  return detail ? `${ep.guestName} — ${detail}` : ep.guestName;
}

/** Big editorial still for the featured/latest episode. */
export function FeaturedEpisode({ ep }: { ep: Card }) {
  const play = usePlayer();
  const guest = byline(ep);

  return (
    <div className="grid items-center gap-[clamp(28px,5vw,72px)] lg:grid-cols-[1.05fr_1fr]">
      <Tilt3D maxTilt={8} scale={1.02} className="w-full">
        <button
          type="button"
          onClick={() => play({ youtubeId: ep.youtubeId, title: ep.title, guest, date: ep.dateLabel })}
          aria-label={`Play ${ep.title}`}
          className="group sheen preserve-3d relative block w-full cursor-pointer overflow-hidden rounded-3xl bg-ink-2 text-left ring-1 ring-steel/12 shadow-2xl"
        >
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={ep.thumbnail}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
              className="reveal-zoom object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.045]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-80" />
            <span className="absolute inset-0 flex items-center justify-center translate-z-40">
              <PlayGlyph size={78} />
            </span>
            {ep.durationLabel && (
              <span className="absolute right-4 bottom-4 rounded-full bg-ink/75 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-steel backdrop-blur-sm translate-z-20">
                {ep.durationLabel}
              </span>
            )}
          </div>
        </button>
      </Tilt3D>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="block h-px w-10 bg-signal" />
          <span className="kicker text-signal-bright">Featured</span>
          <span className="kicker">{ep.dateLabel}</span>
        </div>

        <h3 className="display reveal-blur text-[clamp(30px,4.4vw,64px)] text-bone">{ep.title}</h3>

        {guest && <p className="font-display text-[clamp(16px,1.5vw,22px)] text-steel italic">with {guest}</p>}

        {(ep.summary || ep.excerpt) && (
          <p className="reveal max-w-[52ch] text-[15px] leading-[1.75] text-steel-dim">{ep.summary ?? ep.excerpt}</p>
        )}

        <div className="reveal mt-2 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => play({ youtubeId: ep.youtubeId, title: ep.title, guest, date: ep.dateLabel })}
            className="group inline-flex cursor-pointer items-center gap-3 border-b border-signal pb-2 font-mono text-[11px] tracking-[0.18em] text-bone uppercase transition-colors hover:text-signal-bright"
          >
            Watch Episode
            <span className="transition-transform duration-400 group-hover:translate-x-1.5">→</span>
          </button>
          <PlatformRow ep={ep} />
        </div>
      </div>
    </div>
  );
}

/** Only renders links that actually exist — never a fake player. */
function PlatformRow({ ep }: { ep: Card }) {
  const links = [
    { label: "YouTube", href: `https://www.youtube.com/watch?v=${ep.youtubeId}` },
    ...(ep.spotifyUrl ? [{ label: "Spotify", href: ep.spotifyUrl }] : []),
    ...(ep.appleUrl ? [{ label: "Apple Podcasts", href: ep.appleUrl }] : []),
  ];
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {links.map((l, i) => (
        <span key={l.href} className="flex items-center gap-3">
          {i > 0 && <span className="text-steel-dim/40">·</span>}
          <a href={l.href} target="_blank" rel="noreferrer" className="kicker transition-colors hover:text-bone">{l.label}</a>
        </span>
      ))}
    </span>
  );
}

/** Numbered editorial row — expands on hover like a print index. */
export function EpisodeRow({ ep, index }: { ep: Card; index: number }) {
  const play = usePlayer();
  const [hover, setHover] = useState(false);
  const guest = byline(ep);

  return (
    <li className="reveal hairline-b">
      <button
        type="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => play({ youtubeId: ep.youtubeId, title: ep.title, guest, date: ep.dateLabel })}
        className="grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-[clamp(14px,3vw,40px)] text-left transition-[padding,background-color] duration-[450ms] ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{
          padding: hover ? "30px clamp(12px,2vw,26px)" : "22px 0",
          background: hover ? "color-mix(in srgb, var(--color-ink-3) 70%, transparent)" : "transparent",
        }}
      >
        <span
          className="font-display text-[clamp(18px,2vw,28px)] transition-colors duration-300 tabular-nums"
          style={{ color: hover ? "var(--color-signal-bright)" : "color-mix(in srgb, var(--color-steel) 40%, transparent)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className="flex min-w-0 flex-col gap-1.5 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
          style={{ transform: hover ? "translateX(10px)" : "none" }}
        >
          <span className="display truncate text-[clamp(18px,2.3vw,32px)] text-bone">{ep.title}</span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="kicker">{ep.dateLabel}</span>
            {ep.durationLabel && <><span className="text-steel-dim/40">·</span><span className="kicker">{ep.durationLabel}</span></>}
            {guest && <><span className="text-steel-dim/40">·</span><span className="font-display text-sm text-steel italic">{guest}</span></>}
          </span>
        </span>

        <span className="flex items-center gap-5">
          <span
            className="relative hidden aspect-video w-[190px] shrink-0 overflow-hidden rounded-2xl bg-ink-2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] lg:block"
            style={{ opacity: hover ? 1 : 0, transform: hover ? "none" : "translateX(20px) scale(0.94)" }}
          >
            <Image src={ep.thumbnail} alt="" fill sizes="190px" loading="lazy" className="object-cover" />
          </span>
          <span
            className="font-mono text-lg transition-transform duration-400"
            style={{ color: hover ? "var(--color-signal-bright)" : "var(--color-steel-dim)", transform: hover ? "translateX(4px)" : "none" }}
          >
            →
          </span>
        </span>
      </button>
    </li>
  );
}

/** Card grid used on About / as the mobile-friendly alternative. */
export function EpisodeCard({ ep }: { ep: Card }) {
  const play = usePlayer();
  const guest = byline(ep);

  return (
    <Tilt3D maxTilt={10} scale={1.03} className="w-full">
      <button
        type="button"
        onClick={() => play({ youtubeId: ep.youtubeId, title: ep.title, guest, date: ep.dateLabel })}
        aria-label={`Play ${ep.title}`}
        className="group sheen preserve-3d flex w-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-ink-2 text-left ring-1 ring-steel/10 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] hover:ring-signal/45 shadow-xl"
      >
        <span className="relative block aspect-video overflow-hidden bg-ink-3">
          <Image
            src={ep.thumbnail}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-400 group-hover:opacity-100 translate-z-40">
            <PlayGlyph size={54} />
          </span>
          {ep.durationLabel && (
            <span className="absolute right-3 bottom-3 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-steel backdrop-blur-sm translate-z-20">
              {ep.durationLabel}
            </span>
          )}
        </span>

        <span className="flex flex-1 flex-col gap-2.5 p-5 translate-z-10">
          <span className="kicker">{ep.dateLabel}</span>
          <span className="display line-clamp-2 text-[clamp(17px,1.6vw,22px)] text-bone">{ep.title}</span>
          {guest && <span className="font-display text-sm text-steel italic">with {guest}</span>}
          {ep.excerpt && <span className="line-clamp-2 text-[13.5px] leading-relaxed text-steel-dim">{ep.excerpt}</span>}
          <span className="mt-auto inline-flex items-center gap-2 pt-3 font-mono text-[10px] tracking-[0.18em] text-steel-dim uppercase transition-colors group-hover:text-signal-bright">
            Watch <span className="transition-transform duration-400 group-hover:translate-x-1">→</span>
          </span>
        </span>
      </button>
    </Tilt3D>
  );
}

export type { Card as EpisodeCardData };
