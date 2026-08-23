"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { saveEpisode } from "@/app/admin/actions";
import { ActionForm, SubmitButton, Label, inputCls, Panel } from "./ui";
import { parseVideoId } from "@/lib/video";

export type EpisodeFormData = {
  id?: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string; // yyyy-mm-dd
  duration: string;
  published: boolean;
  featured: boolean;
  order: number;
  summary: string;
  showNotes: string;
  transcript: string;
  takeaways: string;
  guestName: string;
  guestTitle: string;
  guestCompany: string;
  guestPhoto: string;
  spotifyUrl: string;
  appleUrl: string;
  links: string;
};

export function EpisodeForm({ ep, isNew }: { ep: EpisodeFormData; isNew: boolean }) {
  const [videoId, setVideoId] = useState(ep.youtubeId);
  const [thumb, setThumb] = useState(ep.thumbnail);

  const resolved = parseVideoId(videoId);
  const preview = thumb || (resolved ? `https://i.ytimg.com/vi/${resolved}/maxresdefault.jpg` : "");

  return (
    <ActionForm action={saveEpisode} className="flex flex-col gap-6">
      {ep.id && <input type="hidden" name="id" value={ep.id} />}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display text-[clamp(24px,3vw,38px)] text-bone">{isNew ? "Add episode" : "Edit episode"}</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="font-mono text-[10.5px] tracking-[0.16em] text-steel-dim uppercase transition-colors hover:text-bone">
            Cancel
          </Link>
          <SubmitButton>{isNew ? "Create episode" : "Save changes"}</SubmitButton>
        </div>
      </div>

      <Panel title="Source" description="Paste a YouTube URL or the 11-character video ID. The thumbnail defaults to YouTube's if you leave it blank.">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <Label hint="URL or ID">YouTube video</Label>
              <input name="youtubeId" required value={videoId} onChange={(e) => setVideoId(e.target.value)} className={inputCls} placeholder="https://www.youtube.com/watch?v=…" />
              <span className="font-mono text-[10.5px] text-steel-dim">
                {videoId ? (resolved ? `Resolved: ${resolved}` : "Not a valid YouTube URL or ID") : ""}
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <Label hint="optional — overrides YouTube's">Thumbnail URL</Label>
              <input name="thumbnail" value={thumb} onChange={(e) => setThumb(e.target.value)} className={inputCls} placeholder="https://…" />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <Label>Publication date</Label>
                <input name="publishedAt" type="date" required defaultValue={ep.publishedAt} className={inputCls} />
              </label>
              <label className="flex flex-col gap-2">
                <Label hint="ISO 8601, e.g. PT42M11S">Duration</Label>
                <input name="duration" defaultValue={ep.duration} className={inputCls} placeholder="PT42M11S" />
              </label>
            </div>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-steel/12 bg-ink-3">
            {preview ? (
              <Image src={preview} alt="Thumbnail preview" fill sizes="420px" className="object-cover" unoptimized />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[10.5px] tracking-[0.16em] text-steel-dim uppercase">
                Thumbnail preview
              </span>
            )}
          </div>
        </div>
      </Panel>

      <Panel title="Episode">
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <Label>Title</Label>
            <input name="title" required defaultValue={ep.title} className={inputCls} />
          </label>

          <label className="flex flex-col gap-2">
            <Label hint="from YouTube — used as card copy">Description</Label>
            <textarea name="description" rows={4} defaultValue={ep.description} className={`${inputCls} resize-y`} />
          </label>

          <label className="flex flex-col gap-2">
            <Label hint="optional — replaces the description on the featured card">Summary</Label>
            <textarea name="summary" rows={3} defaultValue={ep.summary} className={`${inputCls} resize-y`} />
          </label>

          <div className="flex flex-wrap items-center gap-7 pt-1">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" name="published" defaultChecked={ep.published} className="h-4 w-4 accent-[#1f79c0]" />
              <span className="kicker">Published</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" name="featured" defaultChecked={ep.featured} className="h-4 w-4 accent-[#1f79c0]" />
              <span className="kicker">Featured</span>
            </label>
            <label className="flex items-center gap-2.5">
              <span className="kicker">Order</span>
              <input name="order" type="number" defaultValue={ep.order} className={`${inputCls} w-24`} />
            </label>
          </div>
        </div>
      </Panel>

      <Panel title="Guest" description="Leave blank if the episode has no guest — the frontend hides the byline entirely.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-2">
            <Label>Name</Label>
            <input name="guestName" defaultValue={ep.guestName} className={inputCls} />
          </label>
          <label className="flex flex-col gap-2">
            <Label>Title</Label>
            <input name="guestTitle" defaultValue={ep.guestTitle} className={inputCls} />
          </label>
          <label className="flex flex-col gap-2">
            <Label>Company</Label>
            <input name="guestCompany" defaultValue={ep.guestCompany} className={inputCls} />
          </label>
          <label className="flex flex-col gap-2">
            <Label hint="URL">Photo</Label>
            <input name="guestPhoto" defaultValue={ep.guestPhoto} className={inputCls} />
          </label>
        </div>
      </Panel>

      <Panel title="Extras" description="All optional. Empty fields never render a section on the site.">
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <Label hint="one per line">Key takeaways</Label>
            <textarea name="takeaways" rows={4} defaultValue={ep.takeaways} className={`${inputCls} resize-y`} />
          </label>
          <label className="flex flex-col gap-2">
            <Label>Show notes</Label>
            <textarea name="showNotes" rows={5} defaultValue={ep.showNotes} className={`${inputCls} resize-y`} />
          </label>
          <label className="flex flex-col gap-2">
            <Label>Transcript</Label>
            <textarea name="transcript" rows={6} defaultValue={ep.transcript} className={`${inputCls} resize-y`} />
          </label>
          <label className="flex flex-col gap-2">
            <Label hint='JSON: [{"label":"…","url":"https://…"}]'>External links</Label>
            <textarea name="links" rows={3} defaultValue={ep.links} className={`${inputCls} resize-y font-mono text-[12.5px]`} />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <Label hint="shown only if set">Spotify URL</Label>
              <input name="spotifyUrl" defaultValue={ep.spotifyUrl} className={inputCls} placeholder="https://open.spotify.com/…" />
            </label>
            <label className="flex flex-col gap-2">
              <Label hint="shown only if set">Apple Podcasts URL</Label>
              <input name="appleUrl" defaultValue={ep.appleUrl} className={inputCls} placeholder="https://podcasts.apple.com/…" />
            </label>
          </div>
        </div>
      </Panel>

      <div className="flex justify-end">
        <SubmitButton>{isNew ? "Create episode" : "Save changes"}</SubmitButton>
      </div>
    </ActionForm>
  );
}
