import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { Tilt3D } from "@/components/Tilt3D";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getContent("about");
  return {
    title: "About",
    description: about.mission,
    alternates: { canonical: "/about" },
    openGraph: { title: "About — Security Leader Podcast", description: about.mission, url: "/about" },
  };
}

/** Splits a stored paragraph block into <p>s; renders nothing if empty. */
function Prose({ text, className = "" }: { text: string; className?: string }) {
  const paras = text.split("\n\n").map((p) => p.trim()).filter(Boolean);
  if (paras.length === 0) return null;
  return (
    <div className={`reveal-stagger flex flex-col gap-5 ${className}`}>
      {paras.map((p, i) => (
        <p key={i} className="max-w-[62ch] text-[clamp(14px,1.05vw,16.5px)] leading-[1.82] text-steel-dim">{p}</p>
      ))}
    </div>
  );
}

export default async function AboutPage() {
  const [about, contact] = await Promise.all([getContent("about"), getContent("contact")]);

  return (
    <>
      {/* masthead */}
      <section className="relative grid min-h-[68svh] content-end overflow-hidden px-[clamp(18px,4vw,56px)] pt-[clamp(130px,20vh,220px)] pb-[clamp(40px,7vh,90px)]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(56% 50% at 24% 18%, rgba(31,121,192,0.24), transparent 70%), radial-gradient(44% 38% at 84% 76%, rgba(120,132,146,0.16), transparent 72%)" }}
        />
        <div className="shell relative px-0 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <div className="flex items-center gap-4">
              <span className="block h-px w-12 bg-signal" />
              <span className="kicker">About the podcast</span>
            </div>
            <h1 className="display mt-7 max-w-[14ch] text-[clamp(44px,7.5vw,130px)]">
              <span className="block text-bone">The people</span>
              <span className="steel-text block">shaping</span>
              <span className="block text-bone">what&rsquo;s next.</span>
            </h1>
          </div>

          {/* Right Microphone Artwork */}
          <div className="relative flex justify-center lg:justify-end items-center">
            <Tilt3D maxTilt={14} scale={1.03} className="relative z-10 w-full max-w-[480px]">
              <div className="preserve-3d relative flex items-center justify-center min-h-[360px] sm:min-h-[440px]">
                {/* Neon Glow Aura */}
                <div
                  aria-hidden
                  className="absolute h-[300px] w-[300px] sm:h-[380px] sm:w-[380px] rounded-full bg-radial from-signal/30 via-signal-bright/15 to-transparent blur-3xl opacity-80 animate-pulse-3d"
                />
                <div className="relative z-10 h-[340px] w-[300px] sm:h-[440px] sm:w-[380px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]">
                  <Image
                    src="/brand/mic-hero-perfect.png"
                    alt="Security Leader Microphone"
                    fill
                    priority
                    sizes="(max-width: 640px) 300px, 380px"
                    className="object-contain transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </Tilt3D>
          </div>
        </div>
      </section>

      {/* mission pull-quote */}
      <section className="rule px-[clamp(18px,4vw,56px)] py-[clamp(50px,9vh,120px)]">
        <div className="shell px-0">
          <span className="kicker reveal">Our mission</span>
          <p className="display reveal-blur mt-6 max-w-[24ch] text-[clamp(26px,4.4vw,66px)] text-bone">
            {about.mission}
          </p>
        </div>
      </section>

      {/* who we are */}
      <section className="rule px-[clamp(18px,4vw,56px)] py-[clamp(50px,9vh,120px)]">
        <div className="shell grid gap-[clamp(28px,5vw,86px)] px-0 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="kicker reveal">01</span>
            <h2 className="display reveal-blur mt-4 text-[clamp(26px,3.6vw,52px)] text-bone">{about.whoTitle}</h2>
            <span className="reveal-line mt-6 block h-px w-20 bg-signal" />
          </div>
          <Prose text={about.whoBody} />
        </div>
      </section>

      {/* image band with 3D Tilt */}
      <section className="rule overflow-hidden px-[clamp(18px,4vw,56px)] py-8">
        <Tilt3D maxTilt={6} scale={1.01} className="shell px-0">
          <div className="reveal-mask relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-ink-2 px-0 md:aspect-[21/7] shadow-2xl">
            <Image
              src="/brand/podcast-hosts-art.png"
              alt="Security Leader Podcast cover artwork"
              fill
              sizes="100vw"
              loading="lazy"
              className="reveal-zoom object-cover"
            />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
          </div>
        </Tilt3D>
      </section>

      {/* what we do */}
      <section className="rule px-[clamp(18px,4vw,56px)] py-[clamp(50px,9vh,120px)]">
        <div className="shell grid gap-[clamp(28px,5vw,86px)] px-0 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="kicker reveal">02</span>
            <h2 className="display reveal-blur mt-4 text-[clamp(26px,3.6vw,52px)] text-bone">{about.whatTitle}</h2>
            <span className="reveal-line mt-6 block h-px w-20 bg-signal" />
          </div>
          <Prose text={about.whatBody} />
        </div>
      </section>

      {/* why listen */}
      <section className="rule relative overflow-hidden px-[clamp(18px,4vw,56px)] py-[clamp(50px,9vh,120px)]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(52% 60% at 82% 24%, rgba(31,121,192,0.15), transparent 70%)" }}
        />
        <div className="shell relative grid gap-[clamp(28px,5vw,86px)] px-0 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="kicker reveal">03</span>
            <h2 className="display reveal-blur mt-4 text-[clamp(26px,3.6vw,52px)] text-bone">{about.whyTitle}</h2>
            <span className="reveal-line mt-6 block h-px w-20 bg-signal" />
          </div>
          <div className="flex flex-col gap-8">
            {about.whyPull && (
              <p className="display reveal-blur max-w-[20ch] text-[clamp(24px,3.2vw,44px)] text-bone">
                {about.whyPull}
              </p>
            )}
            <Prose text={about.whyBody} />
          </div>
        </div>
      </section>

      {/* alliance + closing */}
      <section className="rule px-[clamp(18px,4vw,56px)] py-[clamp(56px,10vh,140px)]">
        <div className="shell px-0">
          <div className="grid gap-[clamp(28px,5vw,80px)] lg:grid-cols-2">
            <Tilt3D maxTilt={10} scale={1.02} className="w-full">
              <div className="reveal preserve-3d rounded-3xl border border-steel/15 bg-ink-2/80 p-[clamp(24px,3vw,44px)] shadow-2xl backdrop-blur-md">
                <span className="kicker translate-z-10">Hosted by</span>
                <h3 className="display mt-4 text-[clamp(22px,2.6vw,36px)] text-bone translate-z-20">Business Security Alliance</h3>
                <p className="mt-4 max-w-[46ch] text-[14.5px] leading-[1.8] text-steel-dim translate-z-10">
                  The Security Leader Podcast is hosted by the Business Security Alliance, delivering bold ideas,
                  emerging trends, leadership lessons, and breakthrough technologies—straight from the experts who
                  are defining what&rsquo;s next.
                </p>
                <a
                  href={contact.allianceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-7 inline-flex items-center gap-3 border-b border-signal pb-2 font-mono text-[11px] tracking-[0.18em] text-bone uppercase transition-colors hover:text-signal-bright translate-z-30"
                >
                  Visit the Alliance
                  <span className="transition-transform duration-400 group-hover:translate-x-1.5">↗</span>
                </a>
              </div>
            </Tilt3D>

            <div className="flex flex-col justify-center">
              <p className="display reveal-blur max-w-[22ch] text-[clamp(24px,3.4vw,48px)] text-bone">
                {about.closing}
              </p>
              <div className="reveal mt-9 flex flex-wrap gap-3.5">
                <a
                  href={contact.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-bone px-6 py-3.5 font-mono text-[11px] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-signal hover:text-bone"
                >
                  Watch the podcast ↗
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 rounded-full border border-steel/25 px-6 py-3.5 font-mono text-[11px] tracking-[0.18em] text-steel uppercase transition-colors hover:border-steel hover:text-bone"
                >
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
