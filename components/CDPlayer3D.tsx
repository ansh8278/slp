"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { usePlayer } from "./Player";
import { Tilt3D } from "./Tilt3D";
import { DoodleHeadphones, DoodleSoundwave, DoodleMic, DoodleSparkles } from "./DoodleIcons";

type CDTrack = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
  youtubeId: string;
};

const DEFAULT_TRACKS: CDTrack[] = [
  {
    id: "1",
    title: "What Separates Security Leaders From The Rest #podcast #trending",
    artist: "Security Leader Podcast",
    duration: "15:34",
    thumbnail: "/brand/podcast-art.png",
    youtubeId: "ep34kPRQpmg",
  },
  {
    id: "2",
    title: "CISO Leadership & Future Threat Landscapes",
    artist: "Business Security Alliance",
    duration: "28:12",
    thumbnail: "/brand/podcast-art.png",
    youtubeId: "ep34kPRQpmg",
  },
  {
    id: "3",
    title: "Cyber Resilience & Incident Response in 2026",
    artist: "Security Executive Special",
    duration: "42:05",
    thumbnail: "/brand/podcast-art.png",
    youtubeId: "ep34kPRQpmg",
  },
];

function parseDurationToSeconds(durationStr: string): number {
  if (!durationStr) return 2700;
  if (durationStr.startsWith("PT")) {
    const hours = parseInt(durationStr.match(/(\d+)H/)?.[1] || "0", 10);
    const mins = parseInt(durationStr.match(/(\d+)M/)?.[1] || "0", 10);
    const secs = parseInt(durationStr.match(/(\d+)S/)?.[1] || "0", 10);
    return hours * 3600 + mins * 60 + secs;
  }
  const parts = durationStr.split(":").map((p) => parseInt(p.trim(), 10));
  if (parts.some(isNaN)) return 2700;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 2700;
}

function formatSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (id: string) => void;
  cueVideoById: (id: string) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: object) => YTPlayer; PlayerState: Record<string, number> };
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** Loads the YouTube IFrame API once per page and resolves when it is ready. */
let ytApi: Promise<Window["YT"]> | null = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!ytApi) {
    ytApi = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(window.YT); };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    });
  }
  return ytApi;
}

export function CDPlayer3D({ initialTracks }: { initialTracks?: CDTrack[] }) {
  const openGlobalPlayer = usePlayer();
  const [tracks] = useState<CDTrack[]>(
    initialTracks && initialTracks.length > 0 ? initialTracks : DEFAULT_TRACKS
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const playingRef = useRef(false);
  playingRef.current = isPlaying;

  const currentTrack = tracks[currentIndex] || DEFAULT_TRACKS[0];
  const thumbSrc = currentTrack.thumbnail || "/brand/podcast-art.png";

  // Until the player reports a real duration, fall back to the value synced from YouTube.
  const totalDurationSec = duration || parseDurationToSeconds(currentTrack.duration);
  const progress = totalDurationSec ? Math.min(100, (elapsed / totalDurationSec) * 100) : 0;
  const formattedElapsed = formatSeconds(Math.floor(elapsed));
  const formattedTotal = formatSeconds(totalDurationSec);

  const trackIdRef = useRef(currentTrack.youtubeId);
  const nextRef = useRef<() => void>(() => {});

  // Build the player once; the disc's opaque well sits on top of it.
  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !YT || !hostRef.current) return;
      const mount = document.createElement("div");
      hostRef.current.appendChild(mount);
      playerRef.current = new YT.Player(mount, {
        videoId: trackIdRef.current,
        playerVars: { controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1 },
        events: {
          onReady: () => setDuration(playerRef.current?.getDuration() || 0),
          onStateChange: (e: { data: number }) => {
            const S = YT.PlayerState;
            // Buffering counts as playing: YouTube sits in BUFFERING for a beat
            // after playVideo(), and treating that as "paused" made the deck look
            // dead right after the user pressed play.
            setIsPlaying(e.data === S.PLAYING || e.data === S.BUFFERING);
            setDuration(playerRef.current?.getDuration() || 0);
            if (e.data === S.ENDED) nextRef.current();
          },
          // A blocked/removed video must not leave the deck claiming it is playing.
          onError: () => setIsPlaying(false),
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  // Swap the loaded video when the track changes, preserving play/pause intent.
  useEffect(() => {
    if (currentTrack.youtubeId === trackIdRef.current) return;
    trackIdRef.current = currentTrack.youtubeId;
    setElapsed(0);
    setDuration(0);
    const p = playerRef.current;
    if (!p) return;
    if (playingRef.current) p.loadVideoById(currentTrack.youtubeId);
    else p.cueVideoById(currentTrack.youtubeId);
  }, [currentTrack.youtubeId]);

  // Drive the progress bar from real playback position, not a timer.
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      setElapsed(p.getCurrentTime() || 0);
      const d = p.getDuration() || 0;
      if (d) setDuration(d);
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // playVideo() must run synchronously inside the click for iOS to allow sound.
  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playingRef.current) p.pauseVideo();
    else p.playVideo();
  };

  const handleWatchVideo = () => {
    playerRef.current?.pauseVideo();
    openGlobalPlayer({
      youtubeId: currentTrack.youtubeId,
      title: currentTrack.title,
      date: `Track 0${currentIndex + 1}`,
    });
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  }, [tracks.length]);
  nextRef.current = handleNext;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  return (
    <section className="rule relative py-[clamp(60px,9vh,120px)] px-[clamp(18px,4vw,56px)] bg-gradient-to-b from-ink via-ink-2 to-ink">
      <div className="shell relative flex flex-col items-center justify-center text-center px-0">

        {/* Section Header */}
        <div className="mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2">
            <DoodleHeadphones className="h-4.5 w-4.5" stroke="#3e9be6" />
            <span className="kicker reveal">Hi-Fi Audio Experience</span>
            <DoodleSoundwave className="h-4.5 w-4.5" stroke="#82c91e" />
          </div>
          <h2 className="display reveal-blur mt-3 text-[clamp(30px,4.5vw,64px)] text-bone">
            <span className="funky-text text-signal-bright font-normal">Spin</span> & Discover The CD Deck
          </h2>
          <p className="reveal mt-3 text-[15px] leading-relaxed text-steel-dim">
            Spin podcast archives in high-fidelity 3D. Play directly or launch full video playback.
          </p>
        </div>

        {/* 3D CD Player Deck Box */}
        <Tilt3D maxTilt={8} scale={1.01} className="w-full max-w-4xl">
          <div className="preserve-3d relative grid gap-8 rounded-3xl border border-steel/20 bg-ink-2/95 p-6 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl lg:grid-cols-[280px_1fr] items-center">
            
            {/* Ambient Backlight Glow */}
            <div
              aria-hidden
              className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-signal/20 via-signal-bright/15 to-navy opacity-70 blur-2xl pointer-events-none"
            />

            {/* Left: 3D Holographic CD Turntable Stage */}
            <div className="relative mx-auto flex h-[240px] w-[240px] sm:h-[280px] sm:w-[280px] shrink-0 items-center justify-center z-20">

              {/*
                The real YouTube player. It has to be a genuinely laid-out, full-size
                element — browsers refuse to play media in a 0x0 or clipped iframe,
                which is why the old hidden `sr-only` embed never produced sound.
                The opaque well below paints over it.
              */}
              <div
                ref={hostRef}
                aria-hidden
                className="pointer-events-none absolute inset-1 overflow-hidden rounded-full [&_iframe]:h-full [&_iframe]:w-full"
              />

              {/* Recessed Well */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-ink-3 via-navy to-ink border border-steel/20 shadow-inner" />

              {/* Holographic Spinning CD Disc */}
              <div
                onClick={togglePlay}
                className={`relative flex h-[210px] w-[210px] sm:h-[245px] sm:w-[245px] items-center justify-center rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.7)] cursor-pointer transition-transform duration-500 hover:scale-105 ${
                  isPlaying ? "animate-[slp-spin_8s_linear_infinite]" : ""
                }`}
                style={{
                  background:
                    "radial-gradient(circle, rgba(210,210,210,0.95) 0%, rgba(130,130,130,0.85) 30%, rgba(50,50,50,0.95) 60%, rgba(15,15,15,0.98) 100%)",
                }}
              >
                {/* Rainbow Reflection Grooves */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full opacity-65"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.35) 45deg, transparent 90deg, rgba(31,121,192,0.45) 135deg, transparent 180deg, rgba(255,255,255,0.35) 225deg, transparent 270deg, rgba(62,155,230,0.45) 315deg, transparent 360deg)",
                  }}
                />

                {/* Grooved Concentric Rings */}
                <div aria-hidden className="absolute inset-4 rounded-full border border-white/15" />
                <div aria-hidden className="absolute inset-9 rounded-full border border-white/15" />
                <div aria-hidden className="absolute inset-14 rounded-full border border-white/15" />

                {/* Center Album Artwork Label */}
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center overflow-hidden rounded-full border-4 border-steel/40 shadow-md">
                  <Image
                    src={thumbSrc}
                    alt={currentTrack.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                  {/* Center Spindle Hole */}
                  <div className="z-10 h-5 w-5 rounded-full bg-ink border-2 border-steel/50 shadow-inner" />
                </div>
              </div>

              {/* Tonearm Arm Needle */}
              <div
                className={`absolute top-0 right-2 z-30 origin-top-right transition-transform duration-700 pointer-events-none ${
                  isPlaying ? "rotate-[22deg]" : "rotate-0"
                }`}
              >
                <div className="relative h-28 w-3.5 bg-gradient-to-b from-steel via-steel-dim to-ink-3 rounded-full shadow-lg" style={{ transform: "rotate(-10deg)" }}>
                  <div className="absolute bottom-0 -left-1 h-4 w-5 rounded-sm bg-signal shadow-md" />
                </div>
              </div>
            </div>

            {/* Right: Audio Controls & Metadata */}
            <div className="flex w-full flex-col justify-between gap-5 text-left z-20">
              
              {/* Track Metadata */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="kicker text-signal-bright flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${isPlaying ? "bg-signal-bright animate-ping" : "bg-steel-dim"}`} />
                    {isPlaying ? "NOW PLAYING" : "PAUSED"} · TRACK 0{currentIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={handleWatchVideo}
                    className="kicker transition-colors hover:text-bone text-signal-bright underline underline-offset-4 cursor-pointer"
                  >
                    Watch Video ↗
                  </button>
                </div>

                <h3 className="display mt-2.5 text-[clamp(20px,2.2vw,30px)] leading-snug text-bone line-clamp-2">
                  {currentTrack.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-steel-dim">
                  {currentTrack.artist}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1.5">
                <div
                  className="relative h-2 w-full cursor-pointer overflow-hidden rounded-full bg-ink-3 ring-1 ring-steel/15"
                  onClick={(e) => {
                    if (!totalDurationSec) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                    const seconds = pct * totalDurationSec;
                    playerRef.current?.seekTo(seconds, true);
                    setElapsed(seconds);
                  }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-signal to-signal-bright transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[10.5px] text-steel-dim font-bold tracking-wider">
                  <span className="text-signal-bright">{formattedElapsed}</span>
                  <span>{formattedTotal}</span>
                </div>
              </div>

              {/* Playback Controls & Track Selector Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                
                {/* Prev / Play / Next Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-steel/20 bg-ink-3 text-steel transition-all duration-300 hover:border-bone hover:text-bone hover:scale-105"
                    aria-label="Previous Track"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-13 w-13 items-center justify-center rounded-full bg-bone text-ink shadow-lg transition-all duration-300 hover:bg-signal hover:text-bone hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <svg width="16" height="18" viewBox="0 0 14 16" fill="currentColor">
                        <rect x="2" y="1" width="3.5" height="14" rx="1" />
                        <rect x="8.5" y="1" width="3.5" height="14" rx="1" />
                      </svg>
                    ) : (
                      <svg width="16" height="18" viewBox="0 0 14 16" fill="currentColor" className="translate-x-[1px]">
                        <path d="M1 1l12 7-12 7z" />
                      </svg>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-steel/20 bg-ink-3 text-steel transition-all duration-300 hover:border-bone hover:text-bone hover:scale-105"
                    aria-label="Next Track"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
                  </button>
                </div>

                {/* Track Selector Buttons */}
                <div className="flex items-center gap-2">
                  {tracks.slice(0, 5).map((t, idx) => (
                    <button
                      key={t.id || idx}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                      }}
                      className={`relative h-2.5 rounded-full transition-all duration-300 before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[""] ${
                        idx === currentIndex ? "bg-signal-bright w-8" : "bg-steel/25 hover:bg-steel/50 w-5"
                      }`}
                      aria-label={`Select Track ${idx + 1}`}
                    />
                  ))}
                </div>

              </div>

            </div>

          </div>
        </Tilt3D>

      </div>
    </section>
  );
}
