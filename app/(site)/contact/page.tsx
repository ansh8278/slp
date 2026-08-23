import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { getContent } from "@/lib/content";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContent("contact");
  return {
    title: "Contact",
    description: contact.intro,
    alternates: { canonical: "/contact" },
    openGraph: { title: "Contact — Security Leader Podcast", description: contact.intro, url: "/contact" },
  };
}

export default async function ContactPage() {
  const contact = await getContent("contact");

  // only render channels we actually have — no invented phone numbers or addresses
  const channels = [
    contact.guestEmail && { label: "Guest & topic enquiries", value: contact.guestEmail, href: `mailto:${contact.guestEmail}` },
    contact.generalEmail && contact.generalEmail !== contact.guestEmail && { label: "General", value: contact.generalEmail, href: `mailto:${contact.generalEmail}` },
    contact.youtubeUrl && { label: "YouTube", value: "Security Leader Podcast", href: contact.youtubeUrl, external: true },
    contact.allianceUrl && { label: "Business Security Alliance", value: "businesssecurityalliance.com", href: contact.allianceUrl, external: true },
  ].filter(Boolean) as { label: string; value: string; href: string; external?: boolean }[];

  return (
    <>
      <section className="relative overflow-hidden px-[clamp(18px,4vw,56px)] pt-[clamp(130px,20vh,210px)] pb-[clamp(30px,5vh,60px)]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(50% 46% at 78% 14%, rgba(31,121,192,0.22), transparent 70%)" }}
        />
        <div className="shell relative px-0">
          <div className="flex items-center gap-4">
            <span className="block h-px w-12 bg-signal" />
            <span className="kicker">Contact</span>
          </div>
          <h1 className="display mt-7 max-w-[13ch] text-[clamp(44px,8.4vw,138px)] text-bone">
            {contact.title}
          </h1>
          <p className="mt-7 max-w-[50ch] text-[clamp(14px,1.1vw,17px)] leading-[1.7] text-steel-dim">
            {contact.intro}
          </p>
        </div>
      </section>

      <section className="px-[clamp(18px,4vw,56px)] pt-[clamp(30px,5vh,60px)] pb-[clamp(56px,10vh,130px)]">
        <div className="shell grid gap-[clamp(34px,5vw,90px)] px-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="reveal">
            <ContactForm subjects={contact.prompts} />
          </div>

          <aside className="flex flex-col gap-9">
            <div className="reveal">
              <span className="kicker">Reach us directly</span>
              <ul className="mt-6 list-none border-t border-steel/14 p-0">
                {channels.map((c) => (
                  <li key={c.href} className="hairline-b">
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="group flex items-center justify-between gap-4 py-4 transition-colors"
                    >
                      <span className="flex flex-col gap-1">
                        <span className="kicker">{c.label}</span>
                        <span className="font-display text-[clamp(15px,1.4vw,19px)] text-bone transition-colors group-hover:text-signal-bright">
                          {c.value}
                        </span>
                      </span>
                      <span className="font-mono text-steel-dim transition-transform duration-400 group-hover:translate-x-1 group-hover:text-signal-bright">
                        {c.external ? "↗" : "→"}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal rounded-md border border-steel/12 bg-ink-2/60 p-6">
              <span className="kicker">Common requests</span>
              <ul className="mt-4 flex list-none flex-col gap-2.5 p-0">
                {contact.prompts.map((p) => (
                  <li key={p} className="flex gap-3 text-[14px] leading-relaxed text-steel-dim">
                    <span aria-hidden className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-signal" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
