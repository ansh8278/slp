import { EpisodeForm, type EpisodeFormData } from "@/components/admin/EpisodeForm";

const blank: EpisodeFormData = {
  youtubeId: "", title: "", description: "", thumbnail: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  duration: "", published: true, featured: false, order: 0,
  summary: "", showNotes: "", transcript: "", takeaways: "",
  guestName: "", guestTitle: "", guestCompany: "", guestPhoto: "",
  spotifyUrl: "", appleUrl: "", links: "[]",
};

export default function NewEpisodePage() {
  return <EpisodeForm ep={blank} isNew />;
}
