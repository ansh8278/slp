"use client";

import React from "react";

// Funky Hand-Drawn Doodle SVG Icons for Security & Podcast

export function DoodleShield({ className = "w-6 h-6", stroke = "#3e9be6" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 4C14 4 8 10 8 10V22C8 33 16 41 24 44C32 41 40 33 40 22V10C40 10 34 4 24 4Z"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 0"
      />
      <path
        d="M24 14V34M16 22H32"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleMic({ className = "w-6 h-6", stroke = "#82c91e" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="6" width="12" height="20" rx="6" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M10 20C10 27.7 16.3 34 24 34C31.7 34 38 27.7 38 20" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M24 34V42M16 42H32" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleHeadphones({ className = "w-6 h-6", stroke = "#3e9be6" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 26C8 17.2 15.2 10 24 10C32.8 10 40 17.2 40 26V36C40 38.2 38.2 40 36 40H34C31.8 40 30 38.2 30 36V30C30 27.8 31.8 26 34 26H40"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 26H14C16.2 26 18 27.8 18 30V36C18 38.2 16.2 40 14 40H12C9.8 40 8 38.2 8 36V26Z"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleLock({ className = "w-6 h-6", stroke = "#f4f7fa" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="28" height="22" rx="4" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M16 20V13C16 8.6 19.6 5 24 5C28.4 5 32 8.6 32 13V20" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="30" r="3" fill={stroke} />
      <path d="M24 33V37" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleSparkles({ className = "w-6 h-6", fill = "#3e9be6" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L27.5 16.5 L40 20 L27.5 23.5 L24 36 L20.5 23.5 L8 20 L20.5 16.5 Z" fill={fill} />
      <path d="M38 32L39.5 37 L44 38.5 L39.5 40 L38 45 L36.5 40 L32 38.5 L36.5 37 Z" fill={fill} opacity="0.8" />
    </svg>
  );
}

export function DoodleArrow({ className = "w-12 h-12", stroke = "#3e9be6" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 60 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 10 C 20 2, 40 5, 52 24 M 52 24 L 40 22 M 52 24 L 48 10"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleSoundwave({ className = "w-8 h-8", stroke = "#3e9be6" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 24H10M14 14V34M22 6V42M30 18V30M38 12V36M42 24H46" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleEye({ className = "w-6 h-6", stroke = "#3e9be6" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 24C6 24 14 12 24 12C34 12 42 24 42 24C42 24 34 36 24 36C14 36 6 24 6 24Z" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="24" r="6" stroke={stroke} strokeWidth="3" />
      <circle cx="24" cy="24" r="2" fill={stroke} />
    </svg>
  );
}

export function DoodleRadar({ className = "w-6 h-6", stroke = "#3e9be6" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke={stroke} strokeWidth="3" strokeDasharray="4 2" />
      <circle cx="24" cy="24" r="11" stroke={stroke} strokeWidth="3" />
      <circle cx="24" cy="24" r="4" fill={stroke} />
      <path d="M24 24L38 10" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleKey({ className = "w-6 h-6", stroke = "#82c91e" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="24" r="10" stroke={stroke} strokeWidth="3" />
      <path d="M28 24H42M36 24V30M40 24V28" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function DoodlePlay({ className = "w-6 h-6", fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86a1 1 0 00-1.5.86z" />
    </svg>
  );
}

export function DoodleYouTube({ className = "w-4 h-4", fill = "#FF0000" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function DoodleBadge({ text, icon: Icon, color = "border-signal/30 text-signal-bright" }: { text: string; icon: any; color?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border bg-ink-2/80 px-3 py-1 text-xs font-mono backdrop-blur-md shadow-sm transition-transform duration-300 hover:scale-105 ${color}`}>
      <Icon className="h-4 w-4" />
      <span>{text}</span>
    </div>
  );
}
