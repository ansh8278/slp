"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { DoodleShield, DoodleMic, DoodleHeadphones, DoodleSparkles, DoodleYouTube } from "./DoodleIcons";

const LINKS = [
  { href: "/", label: "Home", icon: DoodleMic },
  { href: "/episodes", label: "Episodes", icon: DoodleHeadphones },
  { href: "/about", label: "About", icon: DoodleShield },
  { href: "/contact", label: "Contact", icon: DoodleHeadphones },
];

/** Fixed film-grain wash. Purely decorative, GPU-composited, ~0 cost. */
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-[-50%] z-90 opacity-[0.045] mix-blend-screen"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E\")",
        animation: "slp-grain 6s steps(4) infinite",
      }}
    />
  );
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-80 transition-[background-color,backdrop-filter,border-color,padding] duration-500"
        style={{
          background: scrolled ? "color-mix(in srgb, var(--color-ink) 78%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? "color-mix(in srgb, var(--color-steel) 12%, transparent)" : "transparent"}`,
          paddingBlock: scrolled ? 12 : 20,
        }}
      >
        <div className="shell flex items-center justify-between gap-6">
          <Link href="/" aria-label="Security Leader Podcast — home" className="group flex items-center gap-3">
            <Image
              src="/brand/logo.png"
              alt=""
              width={128}
              height={128}
              priority
              className="h-9 w-9 transition-transform duration-500 group-hover:scale-110 sm:h-10 sm:w-10"
            />
            <span className="hidden leading-[1.05] sm:block">
              <span className="block font-mono text-[9px] tracking-[0.34em] text-steel-dim">THE</span>
              <span className="block font-display text-[19px] tracking-[-0.01em] text-bone">
                Security Leader <span className="text-signal-bright">Podcast</span>
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className="relative flex items-center gap-1.5 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 group"
                  style={{ color: active ? "var(--color-bone)" : "var(--color-steel-dim)" }}
                >
                  <Icon className="h-3.5 w-3.5 opacity-75 transition-transform duration-300 group-hover:scale-125" />
                  <span>{l.label}</span>
                  <span
                    className="absolute -bottom-1.5 left-0 h-px w-full origin-left bg-signal transition-transform duration-400"
                    style={{ transform: active ? "scaleX(1)" : "scaleX(0)" }}
                  />
                </Link>
              );
            })}
            <MagneticLink href="https://www.youtube.com/channel/UCVTgPtlFP9KvDbnoFQzHTFg">
              <DoodleYouTube className="h-4 w-4 inline mr-1" fill="#FF0000" />
              Watch
            </MagneticLink>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span className="block h-px w-6 bg-bone transition-transform duration-300" style={{ transform: open ? "translateY(3px) rotate(45deg)" : "none" }} />
            <span className="block h-px w-6 bg-bone transition-transform duration-300" style={{ transform: open ? "translateY(-3px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-70 flex flex-col justify-center-safe overflow-y-auto bg-ink px-8 py-24 md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.18 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={l.href} className="display block py-3 text-[min(13vw,9vh)] text-bone">{l.label}</Link>
                </motion.div>
              ))}
            </nav>
            <a
              href="https://www.youtube.com/channel/UCVTgPtlFP9KvDbnoFQzHTFg"
              target="_blank"
              rel="noreferrer"
              className="kicker mt-10 inline-flex w-fit items-center gap-2 border-b border-signal pb-2 text-bone"
            >
              Watch on YouTube ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Pointer-follow button. Falls back to a plain link on touch / reduced motion. */
export function MagneticLink({
  href, children, external = true, className = "",
}: { href: string; children: React.ReactNode; external?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const [d, setD] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduce || !window.matchMedia("(hover: hover)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    setD({ x: (e.clientX - (r.left + r.width / 2)) * 0.3, y: (e.clientY - (r.top + r.height / 2)) * 0.3 });
  };

  const props = external ? { target: "_blank", rel: "noreferrer" } : {};
  return (
    <a
      href={href}
      {...props}
      onMouseMove={onMove}
      onMouseLeave={() => setD({ x: 0, y: 0 })}
      className={`inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 font-mono text-[11px] tracking-[0.18em] text-ink uppercase transition-colors duration-300 hover:bg-signal-bright hover:text-bone ${className}`}
      style={{ transform: `translate3d(${d.x}px, ${d.y}px, 0)`, transition: "transform .35s cubic-bezier(.2,.8,.2,1), background-color .3s, color .3s" }}
    >
      {children}
    </a>
  );
}

export function Footer({ youtubeUrl, allianceUrl, email }: { youtubeUrl: string; allianceUrl: string; email: string }) {
  return (
    <footer className="rule mt-[clamp(60px,10vh,120px)]">
      <div className="shell py-[clamp(48px,8vh,96px)]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image src="/brand/logo.png" alt="" width={128} height={128} className="h-12 w-12" />
            <p className="display mt-5 max-w-[16ch] text-[clamp(26px,3vw,40px)] text-bone">
              Where the world&rsquo;s security leaders speak.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <span className="kicker mb-1">Site</span>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="w-fit text-sm text-steel transition-colors hover:text-bone">{l.label}</Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <span className="kicker mb-1">Elsewhere</span>
            <a href={youtubeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-steel transition-colors hover:text-bone">
              <DoodleYouTube className="h-4 w-4" fill="#FF0000" />
              <span>YouTube Channel ↗</span>
            </a>
            <a href={allianceUrl} target="_blank" rel="noreferrer" className="w-fit text-sm text-steel transition-colors hover:text-bone">Business Security Alliance ↗</a>
            <a href={`mailto:${email}`} className="w-fit text-sm text-steel transition-colors hover:text-bone">{email}</a>
          </div>
        </div>

        <div className="hairline-b mt-14 mb-6" />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] tracking-[0.16em] text-steel-dim uppercase">
            © {new Date().getFullYear()} Security Leader Podcast — All Rights Reserved
          </p>
          <p className="font-mono text-[10px] tracking-[0.16em] text-steel-dim uppercase">
            Hosted by the Business Security Alliance
          </p>
        </div>
      </div>
    </footer>
  );
}
