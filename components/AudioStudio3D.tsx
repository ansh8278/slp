"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Tilt3D } from "./Tilt3D";
import { DoodleMic, DoodleRadar, DoodleShield } from "./DoodleIcons";

const RECORDING_BARS = [
  { h: 40, delay: 0 },
  { h: 80, delay: 0.15 },
  { h: 30, delay: 0.3 },
  { h: 95, delay: 0.1 },
  { h: 55, delay: 0.25 },
  { h: 100, delay: 0.05 },
  { h: 45, delay: 0.35 },
  { h: 85, delay: 0.2 },
  { h: 65, delay: 0.12 },
  { h: 35, delay: 0.28 },
  { h: 90, delay: 0.18 },
  { h: 50, delay: 0.32 },
  { h: 75, delay: 0.08 },
  { h: 40, delay: 0.22 },
];

export function AudioStudio3D() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [seconds, setSeconds] = useState(42);

  const toggleRecording = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <section className="rule relative py-[clamp(60px,9vh,120px)] px-[clamp(18px,4vw,56px)] bg-gradient-to-b from-ink via-ink-2 to-ink">
      <div className="shell relative flex flex-col items-center justify-center text-center px-0">
        
        {/* Section Header */}
        <div className="mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2">
            <DoodleMic className="h-4.5 w-4.5" stroke="#82c91e" />
            <span className="kicker reveal">Interactive Audio Studio</span>
            <DoodleRadar className="h-4.5 w-4.5" stroke="#3e9be6" />
          </div>
          <h2 className="display reveal-blur mt-3 text-[clamp(30px,4.5vw,64px)] text-bone">
            <span className="funky-text text-signal-bright font-normal">Join</span> the Conversation
          </h2>
          <p className="reveal mt-3 text-[15px] leading-relaxed text-steel-dim">
            Listen, record, and share high-impact security insights with top leaders around the globe.
          </p>
        </div>

        {/* 3D Floating Stage Container */}
        <div className="relative flex w-full max-w-5xl items-center justify-center min-h-[520px] sm:min-h-[600px] perspective-1000 my-2 pb-6">
          
          {/* Background Dark Glowing Aura Blob */}
          <div
            aria-hidden
            className="absolute h-[360px] w-[360px] sm:h-[500px] sm:w-[500px] rounded-full ring-1 ring-steel/15 shadow-2xl animate-pulse-3d opacity-90"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(31,121,192,0.30) 0%, rgba(12,24,38,0.85) 60%, transparent 80%)",
            }}
          />

          {/* Central 3D Cartoon Listener / Host Character */}
          <div className="relative z-10 h-[400px] w-[340px] sm:h-[520px] sm:w-[440px] flex items-center justify-center drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]">
            <Image
              src="/brand/cartoon-listener-perfect.png"
              alt="Security Leader Podcast Cartoon Listener"
              fill
              sizes="(max-width: 640px) 340px, 440px"
              priority
              className="object-contain transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Floating Recording Card Widget (Top Left) */}
          <div className="absolute top-[2%] left-[0%] sm:left-[5%] z-30">
            <Tilt3D maxTilt={12} scale={1.04}>
              <div className="preserve-3d flex flex-col gap-3 rounded-2xl border border-steel/20 bg-bone p-4 sm:p-5 text-ink shadow-[0_25px_45px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-500">
                <div className="flex items-center justify-between gap-4 translate-z-20">
                  <span className="font-mono text-xs font-bold tracking-wider text-ink/90 flex items-center gap-2">
                    My Recording
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                  </span>
                  <span className="text-lg">🎙️</span>
                </div>

                <div className="flex items-center gap-3.5 translate-z-40">
                  {/* Play / Pause Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#82c91e] text-ink font-bold transition-transform duration-300 hover:scale-110 active:scale-95 shadow-md"
                    aria-label={isPlaying ? "Pause Recording" : "Play Recording"}
                  >
                    {isPlaying ? (
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
                        <rect x="2" y="1" width="3.5" height="14" rx="1.5" />
                        <rect x="8.5" y="1" width="3.5" height="14" rx="1.5" />
                      </svg>
                    ) : (
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" className="translate-x-[1px]">
                        <path d="M1 1l12 7-12 7z" />
                      </svg>
                    )}
                  </button>

                  {/* Audio Waveform Spectrum */}
                  <div className="flex h-7 items-center gap-[3px] px-1">
                    {RECORDING_BARS.map((bar, idx) => (
                      <span
                        key={idx}
                        className="block w-[3px] sm:w-[4px] rounded-full bg-red-500 transition-all duration-300"
                        style={{
                          height: isPlaying ? `${bar.h}%` : "20%",
                          animation: isPlaying ? `slp-bar 0.8s ease-in-out ${bar.delay}s infinite` : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Tilt3D>
          </div>

          {/* Floating Guest Avatar Badge 1 (Top Right) */}
          <div className="absolute top-[6%] right-[0%] sm:right-[6%] z-20 animate-float-3d">
            <Tilt3D maxTilt={15} scale={1.08}>
              <div className="flex items-center gap-2.5 rounded-full border border-steel/25 bg-ink-2/95 px-3.5 py-2 shadow-xl backdrop-blur-md">
                <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-signal">
                  <Image src="/brand/cartoon-guest-1.png" alt="CISO Guest" fill className="object-cover" />
                </div>
                <div className="text-left pr-1">
                  <p className="font-mono text-[10px] uppercase font-bold text-bone">CISO Leader</p>
                  <p className="text-[11px] text-signal-bright font-mono">Live Guest</p>
                </div>
              </div>
            </Tilt3D>
          </div>

          {/* Floating Guest Avatar Badge 2 (Bottom Left) */}
          <div className="absolute bottom-[8%] left-[0%] sm:left-[8%] z-20 animate-float-3d" style={{ animationDelay: "-4s" }}>
            <Tilt3D maxTilt={15} scale={1.08}>
              <div className="flex items-center gap-2.5 rounded-full border border-steel/20 bg-ink-3/95 px-4 py-2 shadow-xl backdrop-blur-md">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal/20 text-xs text-signal-bright font-bold">
                  98%
                </span>
                <span className="font-mono text-[11px] text-bone">Audience Satisfaction</span>
              </div>
            </Tilt3D>
          </div>

          {/* Floating Stats Card Badge (Bottom Right) */}
          <div className="absolute bottom-[4%] right-[0%] sm:right-[5%] z-30">
            <Tilt3D maxTilt={12} scale={1.05}>
              <div className="preserve-3d flex items-center gap-3.5 rounded-2xl border border-steel/20 bg-bone p-3.5 sm:p-4 text-ink shadow-[0_25px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#82c91e] font-mono text-sm font-bold text-ink translate-z-20">
                  ∞
                </span>
                <div className="text-left translate-z-10">
                  <p className="font-mono text-xs font-bold text-ink uppercase tracking-wider">Unlimited Access</p>
                  <p className="text-[11px] text-steel-dim font-mono">Episodes & Transcripts</p>
                </div>
              </div>
            </Tilt3D>
          </div>

        </div>

      </div>
    </section>
  );
}
