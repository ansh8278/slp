import { Grain, Nav, Footer } from "@/components/Chrome";
import { PlayerProvider } from "@/components/Player";
import { getContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [contact, seo] = await Promise.all([getContent("contact"), getContent("seo")]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: "Security Leader Podcast",
    url: SITE_URL,
    description: seo.description,
    image: new URL(seo.ogImage, SITE_URL).toString(),
    inLanguage: "en",
    publisher: { "@type": "Organization", name: "Business Security Alliance", url: contact.allianceUrl },
    sameAs: [contact.youtubeUrl, contact.allianceUrl],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200 focus:rounded focus:bg-bone focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <Grain />
      <PlayerProvider>
        <Nav />
        <main id="main">{children}</main>
        <Footer youtubeUrl={contact.youtubeUrl} allianceUrl={contact.allianceUrl} email={contact.generalEmail} />
      </PlayerProvider>
    </>
  );
}
