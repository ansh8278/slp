import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space-grotesk", display: "swap" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-plus-jakarta", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });
const pacifico = Pacifico({ subsets: ["latin"], weight: ["400"], variable: "--font-pacifico", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContent("seo");
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: seo.title, template: "%s — Security Leader Podcast" },
    description: seo.description,
    applicationName: "Security Leader Podcast",
    openGraph: {
      type: "website",
      siteName: "Security Leader Podcast",
      title: seo.title,
      description: seo.description,
      url: SITE_URL,
      images: [{ url: seo.ogImage, width: 1536, height: 1024, alt: "Security Leader Podcast" }],
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [seo.ogImage] },
    icons: { icon: "/brand/logo.png", apple: "/brand/logo.png" },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = { themeColor: "#050507", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrains.variable} ${pacifico.variable}`}>
      <body>{children}</body>
    </html>
  );
}
