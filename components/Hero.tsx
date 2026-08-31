"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePlayer, PlayGlyph } from "./Player";
import { Tilt3D } from "./Tilt3D";
import {
  DoodleShield,
  DoodleMic,
  DoodleLock,
  DoodleSparkles,
  DoodleRadar,
  DoodleHeadphones,
  DoodleKey,
  DoodleEye,
  DoodleSoundwave,
} from "./DoodleIcons";

type HeroContent = {
  eyebrow: string;
  headlineLead: string;
  headlineEmphasis: string;
  headlineTail: string;
  intro: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
};

type Latest = { youtubeId: string; title: string; dateLabel: string; thumbnail: string } | null;

/**
 * Deterministic bar heights — no Math.random, so SSR and client agree.
 */
const BARS = Array.from({ length: 48 }, (_, i) => ({
  h: Math.round(16 + Math.abs(Math.sin(i * 1.7) * 62) + Math.abs(Math.cos(i * 0.9) * 20)),
  dur: Math.round((0.8 + ((i * 37) % 11) / 10) * 10) / 10,
  delay: Math.round((((i * 53) % 19) / 20) * 100) / 100,
}));

const BASE_BARS = Array.from({ length: 48 }, (_, i) => ({
  h: Math.round(16 + Math.abs(Math.sin(i * 1.7) * 62) + Math.abs(Math.cos(i * 0.9) * 20)),
  dur: Math.round((0.8 + ((i * 37) % 11) / 10) * 10) / 10,
  delay: Math.round((((i * 53) % 19) / 20) * 100) / 100,
}));

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div aria-hidden className="flex h-[72px] w-full items-end gap-[3px] perspective-1000">
      {BASE_BARS.map((b, i) => (
        <span
          key={i}
          className="block flex-1 origin-bottom rounded-full transition-colors duration-500"
          style={{
            height: `${b.h}%`,
            background:
              i % 7 === 0
                ? "var(--color-signal-bright)"
                : i % 3 === 0
                ? "var(--color-signal)"
                : "color-mix(in srgb, var(--color-steel) 34%, transparent)",
            animation: `slp-bar ${b.dur}s ease-in-out ${b.delay}s infinite`,
            animationPlayState: active ? "running" : "paused",
            transform: `translateZ(${Math.round(Math.sin(i) * 20)}px)`,
          }}
        />
      ))}
    </div>
  );
}

function ThemeAudioWaveform() {
  const pathname = usePathname();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio/podcast-theme.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    const unmuteOnInteraction = () => {
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current
          .play()
          .then(() => setPlaying(true))
          .catch(console.warn);
      }
      cleanupInteractionListeners();
    };

    const cleanupInteractionListeners = () => {
      window.removeEventListener("pointerdown", unmuteOnInteraction);
      window.removeEventListener("mousemove", unmuteOnInteraction);
      window.removeEventListener("touchstart", unmuteOnInteraction);
      window.removeEventListener("scroll", unmuteOnInteraction);
      window.removeEventListener("keydown", unmuteOnInteraction);
      window.removeEventListener("click", unmuteOnInteraction);
    };

    const playAudio = () => {
      if (!audioRef.current) return;

      // Attempt unmuted play first
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          // If browser policy blocks unmuted autoplay, play muted & unmute on first cursor move/scroll
          if (audioRef.current) {
            audioRef.current.muted = true;
            audioRef.current
              .play()
              .then(() => setPlaying(true))
              .catch(console.warn);
          }

          window.addEventListener("pointerdown", unmuteOnInteraction, { once: true });
          window.addEventListener("mousemove", unmuteOnInteraction, { once: true });
          window.addEventListener("touchstart", unmuteOnInteraction, { once: true });
          window.addEventListener("scroll", unmuteOnInteraction, { once: true });
          window.addEventListener("keydown", unmuteOnInteraction, { once: true });
          window.addEventListener("click", unmuteOnInteraction, { once: true });
        });
    };

    playAudio();

    // Listen for custom stop events (CD Player, Video Modal, etc.)
    const handleCustomStop = () => {
      cleanupInteractionListeners();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlaying(false);
    };

    window.addEventListener("slp-stop-theme-audio", handleCustomStop);

    return () => {
      cleanupInteractionListeners();
      window.removeEventListener("slp-stop-theme-audio", handleCustomStop);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      setPlaying(false);
    };
  }, []);

  // Stop audio on route navigation
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
  }, [pathname]);

  // Stop audio when tab loses focus
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause();
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-steel/20 bg-ink-2/90 p-3.5 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between w-full">
        <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-signal-bright uppercase font-bold">
          <span className={`h-2 w-2 rounded-full ${playing ? "bg-signal-bright animate-ping" : "bg-steel-dim"}`} />
          {playing ? "Theme Audio Playing" : "Podcast Audio"}
        </span>
        <span className="font-mono text-[9.5px] tracking-[0.16em] text-steel-dim uppercase">
          {playing ? "Live Soundwave" : "Standby"}
        </span>
      </div>

      <WaveformBars active={playing} />
    </div>
  );
}

export function Hero({ content, latest }: { content: HeroContent; latest: Latest }) {
  const play = usePlayer();

  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <section className="relative grid min-h-[100svh] content-end overflow-hidden px-[clamp(18px,4vw,56px)] pt-[clamp(110px,14vh,170px)] pb-[clamp(32px,5vh,64px)] perspective-1000">
      
      {/* 3D Dynamic Ambient Atmosphere */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Animated Radial Drift */}
        <div
          className="absolute inset-[-15%] opacity-75"
          style={{
            background:
              "radial-gradient(58% 46% at 76% 22%, rgba(31,121,192,0.32), transparent 70%), radial-gradient(46% 40% at 12% 78%, rgba(130,201,30,0.16), transparent 72%), radial-gradient(38% 32% at 48% 10%, rgba(62,155,230,0.16), transparent 70%)",
            animation: "slp-drift 24s ease-in-out infinite",
          }}
        />

        {/* Dynamic 3D Floating Orbs */}
        <div className="absolute top-[15%] right-[10%] h-80 w-80 rounded-full bg-gradient-to-br from-signal-bright/25 to-transparent blur-3xl animate-float-3d" />
        <div
          className="absolute bottom-[20%] left-[6%] h-96 w-96 rounded-full bg-gradient-to-tr from-signal/20 via-signal-bright/10 to-transparent blur-3xl animate-float-3d"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute top-[45%] left-[45%] h-64 w-64 rounded-full bg-radial from-bone/10 to-transparent blur-2xl animate-float-3d"
          style={{ animationDelay: "-12s" }}
        />

        {/* 3D Cyber Grid Matrix Lines */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in srgb, var(--color-steel) 10%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-steel) 10%, transparent) 1px, transparent 1px)",
            backgroundSize: "clamp(60px, 7vw, 110px) clamp(60px, 7vw, 110px)",
            maskImage: "radial-gradient(75% 60% at 50% 42%, #000 20%, transparent 78%)",
          }}
        />
      </div>

      <div className="shell relative flex w-full flex-col gap-[clamp(18px,3vh,36px)] px-0 z-10">
        
        {/* Main Hero 2-Column Layout */}
        <div className="grid items-center gap-[clamp(30px,4vw,64px)] lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_500px]">
          
          {/* Left Column: Eyebrow, Headlines, Intro, CTAs */}
          <div className="flex flex-col gap-[clamp(18px,3vh,36px)]">
            
            {/* Kicker Badge with Doodle Icons */}
            <div className="hero-rise flex items-center gap-3" style={{ animationDelay: "0.15s" }}>
              <div className="relative h-11 w-11 md:h-14 md:w-14 overflow-hidden rounded-2xl border border-steel/20 bg-ink-3 p-1.5 shadow-lg">
                <Image src="/brand/logo.png" alt="Security Leader Logo" fill sizes="56px" className="object-contain p-1" priority />
              </div>
              <span className="block h-px w-8 bg-signal md:w-12" />
              <div className="inline-flex items-center gap-2 rounded-full border border-steel/20 bg-ink-2/80 px-4 py-1.5 backdrop-blur-md shadow-md">
                <DoodleShield className="h-4.5 w-4.5" stroke="#3e9be6" />
                <span className="kicker">{content.eyebrow}</span>
                <DoodleMic className="h-4.5 w-4.5" stroke="#82c91e" />
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="display m-0 text-[clamp(38px,min(7.5vw,11.5svh),120px)]">
              {[content.headlineLead, content.headlineEmphasis, content.headlineTail].map((line, i) => (
                <span key={i} className={`block ${i === 1 ? "overflow-visible py-1" : "overflow-hidden"}`}>
                  <span
                    className={`hero-mask block ${i === 1 ? "funky-text font-normal" : "text-bone"}`}
                    style={{ animationDelay: `${0.28 + i * 0.11}s` }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            {/* Intro Paragraph */}
            <p className="hero-rise m-0 max-w-[52ch] text-[clamp(14px,1.1vw,17px)] leading-[1.7] text-steel-dim" style={{ animationDelay: "0.72s" }}>
              {content.intro}
            </p>

            {/* Call To Action Buttons */}
            <div className="hero-rise flex flex-wrap items-center gap-3.5" style={{ animationDelay: "0.84s" }}>
              {latest ? (
                <button
                  type="button"
                  onClick={() => play({ youtubeId: latest.youtubeId, title: latest.title, date: latest.dateLabel })}
                  className="group inline-flex cursor-pointer items-center gap-3 rounded-full bg-bone px-7 py-4 font-mono text-[11.5px] tracking-[0.18em] text-ink uppercase font-bold transition-all duration-300 hover:scale-105 hover:bg-signal hover:text-bone shadow-xl hover:shadow-signal/30"
                >
                  <span className="flex h-4 w-3 items-center">
                    <svg width="11" height="13" viewBox="0 0 14 16" aria-hidden>
                      <path d="M0 0l14 8-14 8z" fill="currentColor" />
                    </svg>
                  </span>
                  {content.primaryCtaLabel}
                </button>
              ) : (
                <a
                  href="https://www.youtube.com/channel/UCVTgPtlFP9KvDbnoFQzHTFg"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 font-mono text-[11.5px] tracking-[0.18em] text-ink uppercase font-bold transition-all duration-300 hover:scale-105 hover:bg-signal hover:text-bone shadow-xl"
                >
                  Watch on YouTube ↗
                </a>
              )}
              
              <a
                href="/episodes"
                className="inline-flex items-center gap-3 rounded-full border border-steel/25 px-7 py-4 font-mono text-[11.5px] tracking-[0.18em] text-steel uppercase transition-all duration-300 hover:scale-105 hover:border-steel hover:text-bone"
              >
                {content.secondaryCtaLabel}
              </a>
            </div>
          </div>

          {/* Right Column: 3D Levitating Hero Artwork + Floating Security Doodles */}
          <div className="hero-rise relative order-first flex items-center justify-center lg:order-none lg:translate-z-20" style={{ animationDelay: "0.6s" }}>
            


            {/* Floating Security Doodle Badge 2 (Bottom Right) */}
            <div
              className="hero-rise absolute -bottom-4 -right-4 z-30 hidden lg:block"
              style={{ animationDelay: "1.3s" }}
            >
              <div className="flex items-center gap-2 rounded-full border border-steel/25 bg-ink-3/95 px-4.5 py-2.5 shadow-2xl backdrop-blur-xl font-mono text-xs font-bold text-signal-bright">
                <DoodleHeadphones className="h-4.5 w-4.5" stroke="#82c91e" />
                <span>Executive CISO Audio</span>
              </div>
            </div>

            {/* 3D Tilt Main Artwork */}
            <Tilt3D maxTilt={14} scale={1.04} className="relative flex items-center justify-center">
              <div className="relative z-10 aspect-square w-[min(62vw,240px)] lg:w-[520px] xl:w-[600px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.95)] transition-transform duration-700 hover:scale-105">
                <Image
                  src="/brand/hero-real-new.webp"
                  alt="Security Leader Podcast Artwork"
                  fill
                  sizes="(max-width: 1024px) 240px, (max-width: 1280px) 520px, 600px"
                  priority
                  className="object-contain"
                />
              </div>
            </Tilt3D>
          </div>

        </div>

        {/* Latest Episode Ticket Card with 3D Tilt + Live Equalizer Waveform */}
        <div className="hero-rise mt-2 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]" style={{ animationDelay: "0.96s" }}>
          {latest ? (
            <Tilt3D maxTilt={10} scale={1.02} className="max-w-xl">
              <button
                type="button"
                onClick={() => play({ youtubeId: latest.youtubeId, title: latest.title, date: latest.dateLabel })}
                className="group sheen preserve-3d flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-steel/15 bg-ink-2/85 p-4 text-left backdrop-blur-md transition-all duration-500 hover:border-signal/50 shadow-xl hover:shadow-2xl"
              >
                <span className="relative block aspect-video w-[104px] shrink-0 overflow-hidden rounded-xl bg-ink-3 sm:w-[132px] translate-z-20">
                  <Image src={latest.thumbnail} alt="" fill sizes="132px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 flex items-center justify-center translate-z-40">
                    <PlayGlyph size={38} />
                  </span>
                </span>
                <span className="flex min-w-0 flex-col gap-1 translate-z-10">
                  <span className="kicker text-signal-bright flex items-center gap-2">
                    <DoodleSoundwave className="h-3.5 w-3.5" stroke="#82c91e" /> Latest Broadcast · {latest.dateLabel}
                  </span>
                  <span className="line-clamp-2 font-display text-[15px] leading-snug text-bone sm:text-[17px]">
                    {latest.title}
                  </span>
                </span>
              </button>
            </Tilt3D>
          ) : (
            <span />
          )}

          {/* Equalizer Waveform with Synced Theme Audio */}
          <div className="justify-self-end w-full">
            <ThemeAudioWaveform />
          </div>
        </div>

      </div>

    </section>
  );
}
