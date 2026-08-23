import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EpisodeForm, type EpisodeFormData } from "@/components/admin/EpisodeForm";

export const dynamic = "force-dynamic";

export default async function EditEpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ep = await prisma.episode.findUnique({ where: { id } });
  if (!ep) notFound();

  const data: EpisodeFormData = {
    id: ep.id,
    youtubeId: ep.youtubeId,
    title: ep.title,
    description: ep.description,
    thumbnail: ep.thumbnail,
    publishedAt: ep.publishedAt.toISOString().slice(0, 10),
    duration: ep.duration ?? "",
    published: ep.published,
    featured: ep.featured,
    order: ep.order,
    summary: ep.summary ?? "",
    showNotes: ep.showNotes ?? "",
    transcript: ep.transcript ?? "",
    takeaways: ep.takeaways.join("\n"),
    guestName: ep.guestName ?? "",
    guestTitle: ep.guestTitle ?? "",
    guestCompany: ep.guestCompany ?? "",
    guestPhoto: ep.guestPhoto ?? "",
    spotifyUrl: ep.spotifyUrl ?? "",
    appleUrl: ep.appleUrl ?? "",
    links: JSON.stringify(ep.links ?? [], null, 0),
  };

  return <EpisodeForm ep={data} isNew={false} />;
}
