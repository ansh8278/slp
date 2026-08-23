import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { FeaturedEpisode, EpisodeRow, type EpisodeCardData } from "@/components/Episodes";
import { TopicsRail, Marquee } from "@/components/Topics";
import { Tilt3D } from "@/components/Tilt3D";
import { AudioStudio3D } from "@/components/AudioStudio3D";
import { CDPlayer3D } from "@/components/CDPlayer3D";
import { getContent } from "@/lib/content";
import { getEpisodes, getFeatured, formatDate, excerpt, SITE_URL, type PublicEpisode } from "@/lib/site";
import { formatDuration } from "@/lib/video";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContent("seo");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/" } };
}

function toCard(ep: PublicEpisode): EpisodeCardData {
  const { publishedAt, ...rest } = ep;
  return { ...rest, dateLabel: formatDate(publishedAt), excerpt: excerpt(ep.description), durationLabel: formatDuration(ep.duration) };
}

export default async function HomePage() {
  const [hero, about, topics, contact, featuredRaw, allRaw] = await Promise.all([
    getContent("hero"),
    getContent("about"),
    getContent("topics"),
    getContent("contact"),
    getFeatured(),
    getEpisodes(),
  ]);

  const featured = featuredRaw ? toCard(featuredRaw) : null;
  const rest = allRaw.map(toCard);

  const cdTracks = allRaw.map((ep) => ({
    id: ep.id,
    title: ep.title,
    artist: ep.guestName ? `${ep.guestName} — Security Leader Podcast` : "Security Leader Podcast",
    duration: formatDuration(ep.duration) || "15:34",
    thumbnail: ep.thumbnail || "/brand/podcast-art.png",
    youtubeId: ep.youtubeId,
  }));

  const videoLd = allRaw.slice(0, 10).map((ep) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: ep.title,
    description: excerpt(ep.description, 300) || ep.title,
    thumbnailUrl: ep.thumbnail,
    uploadDate: ep.publishedAt.toISOString(),
    ...(ep.duration ? { duration: ep.duration } : {}),
    embedUrl: `https://www.youtube.com/embed/${ep.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${ep.youtubeId}`,
    publisher: { "@type": "Organization", name: "Security Leader Podcast", url: SITE_URL },
  }));

  return (
    <>
      {videoLd.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />
      )}

      <Hero
        content={hero}
        latest={featured ? { youtubeId: featured.youtubeId, title: featured.title, dateLabel: featured.dateLabel, thumbnail: featured.thumbnail } : null}
      />

      {featured && (
        <section id="featured" className="rule px-[clamp(18px,4vw,56px)] py-[clamp(60px,11vh,140px)]">
          <div className="shell px-0">
            <FeaturedEpisode ep={featured} />
          </div>
        </section>
      )}

      {/* ---- The show ---- */}
      <section className="rule px-[clamp(18px,4vw,56px)] py-[clamp(56px,10vh,130px)]">
        <div className="shell grid gap-[clamp(30px,5vw,90px)] px-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="kicker reveal">The show</span>
            <h2 className="display reveal-blur mt-5 text-[clamp(30px,4.6vw,68px)] text-bone">
              Real conversations,
              <br />
              <span className="steel-text">real experience,</span>
              <br />
              real insight.
            </h2>
            <span className="reveal-line mt-8 block h-px w-24 bg-signal" />
          </div>

          <div className="reveal-stagger flex flex-col gap-6 self-center">
            {about.whoBody.split("\n\n").map((para, i) => (
              <p key={i} className="max-w-[58ch] text-[clamp(14px,1.05vw,16px)] leading-[1.8] text-steel-dim">
                {para}
              </p>
            ))}
            <Link
              href="/about"
              className="group mt-2 inline-flex w-fit items-center gap-3 border-b border-signal pb-2 font-mono text-[11px] tracking-[0.18em] text-bone uppercase transition-colors hover:text-signal-bright"
            >
              About the podcast
              <span className="transition-transform duration-400 group-hover:translate-x-1.5">→</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="rule overflow-hidden">
        <Marquee words={["Physical Security", "Electronic Security", "Cybersecurity", "Leadership"]} />
      </div>

      {/* ---- Interactive 3D Spinning CD Deck Player ---- */}
      <CDPlayer3D initialTracks={cdTracks} />

      {/* ---- Interactive 3D Audio Recording Showcase ---- */}
      <AudioStudio3D />

      {/* ---- Episodes ---- */}
      <section id="episodes" className="rule px-[clamp(18px,4vw,56px)] py-[clamp(56px,10vh,130px)]">
        <div className="shell px-0">
          <div className="mb-[clamp(26px,5vh,52px)] flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="kicker reveal">Episodes</span>
              <h2 className="display reveal-blur mt-4 text-[clamp(28px,4vw,58px)] text-bone">The archive</h2>
            </div>
            <a
              href={contact.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="kicker transition-colors hover:text-bone"
            >
              All videos on YouTube ↗
            </a>
          </div>

          {rest.length > 0 ? (
            <ul className="m-0 list-none border-t border-steel/14 p-0">
              {rest.map((ep, i) => (
                <EpisodeRow key={ep.id} ep={ep} index={i} />
              ))}
            </ul>
          ) : (
            <EmptyArchive youtubeUrl={contact.youtubeUrl} hasFeatured={Boolean(featured)} />
          )}
        </div>
      </section>

      {/* ---- Topics ---- */}
      <section className="rule px-[clamp(18px,4vw,56px)] py-[clamp(56px,10vh,130px)]">
        <div className="shell px-0">
          <div className="mb-[clamp(26px,5vh,52px)] max-w-3xl">
            <span className="kicker reveal">Areas of discussion</span>
            <h2 className="display reveal-blur mt-4 text-[clamp(28px,4vw,58px)] text-bone">
              The full spectrum of security.
            </h2>
            <p className="reveal mt-5 max-w-[54ch] text-[15px] leading-[1.75] text-steel-dim">
              From breaking news and emerging trends to deep, candid conversations with some of the most
              interesting and influential people in the industry.
            </p>
          </div>
          <TopicsRail topics={topics} />
        </div>
      </section>

      {/* ---- Mission / CTA ---- */}
      <section className="rule relative overflow-hidden px-[clamp(18px,4vw,56px)] py-[clamp(64px,12vh,150px)]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(60% 70% at 78% 30%, rgba(31,121,192,0.16), transparent 70%)" }}
        />
        <div className="shell relative grid items-center gap-[clamp(32px,5vw,80px)] px-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="kicker reveal">Our mission</span>
            <p className="display reveal-blur mt-6 max-w-[26ch] text-[clamp(26px,3.3vw,50px)] text-bone">
              {about.mission}
            </p>
            <div className="reveal mt-10 flex flex-wrap gap-3.5">
              <a
                href={contact.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-bone px-6 py-3.5 font-mono text-[11px] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-signal hover:text-bone"
              >
                Subscribe on YouTube ↗
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-full border border-steel/25 px-6 py-3.5 font-mono text-[11px] tracking-[0.18em] text-steel uppercase transition-colors hover:border-steel hover:text-bone"
              >
                Be a guest
              </Link>
            </div>
          </div>

          <Tilt3D maxTilt={10} scale={1.03} className="w-full">
            <div className="reveal-mask relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-2 ring-1 ring-steel/12 shadow-2xl">
              <Image
                src="/brand/podcast-hosts-art.png"
                alt="Security Leader Podcast cover artwork"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                loading="lazy"
                className="parallax-slow object-cover"
              />
            </div>
          </Tilt3D>
        </div>
      </section>
    </>
  );
}

/** Honest empty state — the channel is new; we don't fake a back catalogue. */
function EmptyArchive({ youtubeUrl, hasFeatured }: { youtubeUrl: string; hasFeatured: boolean }) {
  return (
    <div className="rounded-3xl border border-dashed border-steel/18 px-6 py-14 text-center">
      <p className="display text-[clamp(20px,2.4vw,30px)] text-bone">
        {hasFeatured ? "More episodes are on the way." : "Episodes are on the way."}
      </p>
      <p className="mx-auto mt-3 max-w-[46ch] text-sm leading-relaxed text-steel-dim">
        New conversations publish to the channel first and appear here automatically.
      </p>
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-steel/25 px-6 py-3 font-mono text-[11px] tracking-[0.18em] text-steel uppercase transition-colors hover:border-steel hover:text-bone"
      >
        Subscribe on YouTube ↗
      </a>
    </div>
  );
}
