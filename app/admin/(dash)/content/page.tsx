import { getContent } from "@/lib/content";
import { saveContent } from "@/app/admin/actions";
import { ActionForm, SubmitButton, Label, inputCls, Panel } from "@/components/admin/ui";
import { TopicsEditor } from "@/components/admin/TopicsEditor";
import { MembersEditor } from "@/components/admin/MembersEditor";
import type { TeamMember } from "@/components/TeamShowcase";

export const dynamic = "force-dynamic";

function Text({ name, label, value, hint, rows }: { name: string; label: string; value: string; hint?: string; rows?: number }) {
  return (
    <label className="flex flex-col gap-2">
      <Label hint={hint}>{label}</Label>
      {rows ? (
        <textarea name={name} rows={rows} defaultValue={value} className={`${inputCls} resize-y`} />
      ) : (
        <input name={name} defaultValue={value} className={inputCls} />
      )}
    </label>
  );
}

export default async function ContentPage() {
  const [hero, about, topics, contact, seo, members] = await Promise.all([
    getContent("hero"),
    getContent("about"),
    getContent("topics"),
    getContent("contact"),
    getContent("seo"),
    getContent("members") as Promise<TeamMember[]>,
  ]);

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="display text-[clamp(24px,3vw,38px)] text-bone">Site content</h1>
        <p className="mt-1 max-w-[70ch] text-[13px] leading-relaxed text-steel-dim">
          Every field here is live on the public site. Blank a paragraph and its block disappears — nothing renders empty.
          Use a blank line to start a new paragraph in the long-form fields.
        </p>
      </div>

      <ActionForm action={saveContent}>
        <input type="hidden" name="__key" value="hero" />
        <Panel title="Hero" description="The headline renders on three lines; the middle line gets the brushed-steel treatment.">
          <div className="flex flex-col gap-5">
            <Text name="eyebrow" label="Eyebrow" value={hero.eyebrow} />
            <div className="grid gap-5 sm:grid-cols-3">
              <Text name="headlineLead" label="Headline line 1" value={hero.headlineLead} />
              <Text name="headlineEmphasis" label="Headline line 2" value={hero.headlineEmphasis} hint="steel" />
              <Text name="headlineTail" label="Headline line 3" value={hero.headlineTail} />
            </div>
            <Text name="intro" label="Intro paragraph" value={hero.intro} rows={3} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Text name="primaryCtaLabel" label="Primary CTA" value={hero.primaryCtaLabel} />
              <Text name="secondaryCtaLabel" label="Secondary CTA" value={hero.secondaryCtaLabel} />
            </div>
          </div>
          <div className="mt-6"><SubmitButton>Save hero</SubmitButton></div>
        </Panel>
      </ActionForm>

      <ActionForm action={saveContent}>
        <input type="hidden" name="__key" value="about" />
        <Panel title="About" description="Used on the About page and the homepage 'The show' section.">
          <div className="flex flex-col gap-5">
            <Text name="mission" label="Mission" value={about.mission} rows={2} />
            <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
              <Text name="whoTitle" label="Section 1 title" value={about.whoTitle} />
              <Text name="whoBody" label="Section 1 body" value={about.whoBody} rows={7} hint="blank line = new paragraph" />
            </div>
            <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
              <Text name="whatTitle" label="Section 2 title" value={about.whatTitle} />
              <Text name="whatBody" label="Section 2 body" value={about.whatBody} rows={7} />
            </div>
            <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
              <Text name="whyTitle" label="Section 3 title" value={about.whyTitle} />
              <div className="flex flex-col gap-5">
                <Text name="whyPull" label="Section 3 pull-quote" value={about.whyPull} rows={2} />
                <Text name="whyBody" label="Section 3 body" value={about.whyBody} rows={7} />
              </div>
            </div>
            <Text name="closing" label="Closing statement" value={about.closing} rows={2} />
          </div>
          <div className="mt-6"><SubmitButton>Save about</SubmitButton></div>
        </Panel>
      </ActionForm>

      <ActionForm action={saveContent}>
        <input type="hidden" name="__key" value="members" />
        <Panel title="Team Members & Leadership" description="Manage executive hosts, co-hosts, and team bios shown on the About page and Homepage showcase.">
          <MembersEditor members={members} />
          <div className="mt-6"><SubmitButton>Save team members</SubmitButton></div>
        </Panel>
      </ActionForm>

      <ActionForm action={saveContent}>
        <input type="hidden" name="__key" value="topics" />
        <Panel title="Topics" description="The horizontal rail on the homepage. Clear a title to remove that topic.">
          <TopicsEditor topics={topics} />
          <div className="mt-6"><SubmitButton>Save topics</SubmitButton></div>
        </Panel>
      </ActionForm>

      <ActionForm action={saveContent}>
        <input type="hidden" name="__key" value="contact" />
        <Panel title="Contact" description="Only fields with a value are shown on the contact page. Clear one to hide that channel entirely.">
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Text name="title" label="Page title" value={contact.title} />
              <Text name="intro" label="Intro" value={contact.intro} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Text name="guestEmail" label="Guest & topic email" value={contact.guestEmail} />
              <Text name="generalEmail" label="General email" value={contact.generalEmail} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Text name="youtubeUrl" label="YouTube channel URL" value={contact.youtubeUrl} />
              <Text name="allianceUrl" label="Business Security Alliance URL" value={contact.allianceUrl} />
            </div>
            <Text name="prompts" label="Common requests" value={contact.prompts.join("\n")} rows={4} hint="one per line — also the subject suggestions" />
          </div>
          <div className="mt-6"><SubmitButton>Save contact</SubmitButton></div>
        </Panel>
      </ActionForm>

      <ActionForm action={saveContent}>
        <input type="hidden" name="__key" value="seo" />
        <Panel title="SEO" description="Defaults for page titles, meta descriptions, Open Graph and Twitter cards.">
          <div className="flex flex-col gap-5">
            <Text name="title" label="Default title" value={seo.title} />
            <Text name="description" label="Meta description" value={seo.description} rows={3} />
            <Text name="ogImage" label="Share image" value={seo.ogImage} hint="path or absolute URL" />
          </div>
          <div className="mt-6"><SubmitButton>Save SEO</SubmitButton></div>
        </Panel>
      </ActionForm>
    </div>
  );
}
