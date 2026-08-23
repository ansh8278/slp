import { prisma } from "./db";

/**
 * Every string below is verbatim (or a trimmed excerpt) from securityleaderpodcast.com
 * or the Business Security Alliance description of the show. Nothing here is invented.
 * These are only *defaults* — the admin overrides any of them from /admin/content.
 */
export const DEFAULTS = {
  hero: {
    eyebrow: "HOSTED BY THE BUSINESS SECURITY ALLIANCE",
    headlineLead: "Where the World's",
    headlineEmphasis: "Security Leaders",
    headlineTail: "Speak",
    intro:
      "The only podcast in the world dedicated to bringing you unfiltered industry perspectives from the most influential thought leaders shaping the future of Physical, Electronic, and Cybersecurity.",
    primaryCtaLabel: "Watch the Latest",
    secondaryCtaLabel: "Explore Episodes",
  },
  about: {
    // "Who we are" — securityleaderpodcast.com
    whoTitle: "Who we are",
    whoBody:
      "The Security Leader Podcast is the only podcast in the world dedicated to bringing you unfiltered industry perspectives from the most influential thought leaders shaping the future of Physical, Electronic, and Cybersecurity. We go beyond theory and headlines to deliver real conversations, real experience, and real insight from those building, securing, and transforming the global security ecosystem.\n\nHosted by the Business Security Alliance, the podcast delivers bold ideas, emerging trends, leadership lessons, and breakthrough technologies—straight from the experts who are defining what's next. Our mission is simple: to educate, connect, and empower the security leaders of today and tomorrow through the most engaging and impactful content in the industry.\n\nIf you live and breathe security, this is your community—and this is your podcast.",
    // "What we do"
    whatTitle: "What we do",
    whatBody:
      "On The Security Leader Podcast, we explore the full spectrum of security—from breaking news and emerging trends to deep, candid conversations with some of the most interesting and influential people in the world of Physical, Electronic, and Cybersecurity.\n\nEach episode is designed to inform, challenge, and inspire. We unpack real-world security challenges, spotlight innovative technologies, examine business and leadership strategies, and share lessons learned directly from the executives, practitioners, and visionaries shaping the future of our industry.\n\nWe pride ourselves on delivering content that is not only informative, but genuinely engaging. Our conversations go beyond surface-level commentary, offering practical insights, authentic stories, and expert perspectives our listeners can apply immediately—whether they're protecting organizations, building companies, or advancing their careers.\n\nFrom high-level industry analysis to in-depth interviews, The Security Leader Podcast delivers trusted, thought-provoking content that keeps security professionals informed, connected, and ahead of what's next.",
    // "Why listen to us"
    whyTitle: "Why listen to us",
    whyPull: "Because security is changing faster than ever—and the people shaping its future are right here.",
    whyBody:
      "The Security Leader Podcast gives you direct access to the voices that matter most in Physical, Electronic, and Cybersecurity. Hosted by security professionals who live this industry every day, we deliver real conversations with real leaders—sharing insights you won't find in press releases, product brochures, or surface-level discussions.\n\nWhen you listen, you stay informed on the latest trends, technologies, and threats. You gain practical lessons from executives, innovators, and practitioners who are solving real-world security challenges. And you become part of a community that values experience, leadership, and forward-thinking ideas.\n\nThis podcast isn't just about keeping up—it's about staying ahead.",
    closing:
      "If you care about protecting people, property, and critical assets—and want to learn directly from those defining what's next—this is the podcast for you.",
    mission:
      "To educate, connect, and empower the security leaders of today and tomorrow through the most engaging and impactful content in the industry.",
  },
  /** Every topic below is named explicitly in the show's own "What we do" copy. */
  topics: [
    { title: "Physical Security", body: "The people, property, and critical assets side of the discipline—and the practitioners protecting them." },
    { title: "Electronic Security", body: "The systems and integrations that make modern protection work, from the people deploying them." },
    { title: "Cybersecurity", body: "Threats, defences and the leaders responding to a landscape that changes faster than ever." },
    { title: "Leadership & Strategy", body: "Business and leadership strategies, plus lessons learned directly from security executives." },
    { title: "Emerging Technology", body: "Breakthrough technologies and the innovations reshaping how the industry operates." },
    { title: "Trends & Breaking News", body: "Emerging trends and industry analysis, unpacked without the press-release language." },
  ],
  contact: {
    title: "Get in touch",
    intro: "Guest pitches, topic suggestions, partnerships—reach the show directly.",
    guestEmail: "info@securityleaderpodcast.com",
    generalEmail: "info@securityleaderpodcast.com",
    youtubeUrl: "https://www.youtube.com/channel/UCVTgPtlFP9KvDbnoFQzHTFg",
    allianceUrl: "https://businesssecurityalliance.com/",
    prompts: [
      "I want to be a guest on the podcast",
      "Tell us what topics you want to hear on the podcast",
    ],
  },
  seo: {
    title: "Security Leader Podcast — Where the World's Security Leaders Speak",
    description:
      "Unfiltered industry perspectives from the most influential thought leaders shaping the future of Physical, Electronic, and Cybersecurity. Hosted by the Business Security Alliance.",
    ogImage: "/brand/podcast-hosts-art.png",
  },
};

export type SiteContent = typeof DEFAULTS;
export type ContentKey = keyof SiteContent;

/** Reads one content group, falling back to the verbatim defaults above. */
export async function getContent<K extends ContentKey>(key: K): Promise<SiteContent[K]> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    if (!row) return DEFAULTS[key];
    return Array.isArray(DEFAULTS[key])
      ? ((row.value as SiteContent[K]) ?? DEFAULTS[key])
      : ({ ...DEFAULTS[key], ...(row.value as object) } as SiteContent[K]);
  } catch (e) {
    console.warn(`[getContent] Database lookup failed for key "${key}", falling back to DEFAULTS.`, e);
    return DEFAULTS[key];
  }
}

export async function setContent<K extends ContentKey>(key: K, value: SiteContent[K]) {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value: value as object },
    update: { value: value as object },
  });
}
