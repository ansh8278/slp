"use client";

import { useState } from "react";
import Image from "next/image";
import { Label, inputCls } from "./ui";
import type { TeamMember } from "../TeamShowcase";

export function MembersEditor({ members: initial }: { members: TeamMember[] }) {
  const [members, setMembers] = useState<TeamMember[]>(initial || []);

  const update = (idx: number, field: keyof TeamMember, value: any) => {
    setMembers((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const remove = (idx: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  const add = () => {
    setMembers((prev) => [
      ...prev,
      {
        id: `member-${Date.now()}`,
        name: "New Team Member",
        role: "Host / Producer",
        tag: "Host",
        photo: "/brand/member1.webp",
        bio: "Team member description...",
        objectPosition: "50% 15%",
        zoom: 100,
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-6">
      <input type="hidden" name="members_json" value={JSON.stringify(members)} />

      {members.map((m, idx) => {
        const currentPos = m.objectPosition || "50% 15%";
        const currentZoom = m.zoom || 100;
        
        // Extract Y percentage if in "50% Y%" format
        const yMatch = currentPos.match(/\d+%/g);
        const yVal = yMatch && yMatch.length > 1 ? parseInt(yMatch[1], 10) : 15;

        return (
          <div key={m.id || idx} className="flex flex-col gap-5 rounded-2xl border border-steel/20 bg-ink-3/50 p-5 shadow-sm">
            
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-steel/15 pb-3">
              <span className="font-mono text-xs text-signal-bright uppercase tracking-wider font-bold">
                Team Member #{idx + 1}: {m.name || "Untitled"}
              </span>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="font-mono text-[11px] text-red-400 hover:text-red-300 uppercase tracking-widest cursor-pointer"
              >
                ✕ Remove
              </button>
            </div>

            {/* Grid Layout: Controls on Left, Live Card Preview on Right */}
            <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
              
              {/* Left Form Inputs & Crop Controls */}
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="flex flex-col gap-1.5">
                    <Label>Full Name</Label>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => update(idx, "name", e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Marcus Vance"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <Label>Role / Title</Label>
                    <input
                      type="text"
                      value={m.role}
                      onChange={(e) => update(idx, "role", e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Executive Host & CISO Advisor"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <Label>Badge Tag</Label>
                    <input
                      type="text"
                      value={m.tag}
                      onChange={(e) => update(idx, "tag", e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Host, Co-Host, Producer"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <Label hint="e.g. /brand/member1.webp">Photo Path / Image URL</Label>
                    <input
                      type="text"
                      value={m.photo}
                      onChange={(e) => update(idx, "photo", e.target.value)}
                      className={inputCls}
                      placeholder="/brand/member1.webp"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <Label>Bio / Summary</Label>
                    <textarea
                      rows={2}
                      value={m.bio}
                      onChange={(e) => update(idx, "bio", e.target.value)}
                      className={`${inputCls} resize-y`}
                      placeholder="Brief member background..."
                    />
                  </label>
                </div>

                {/* ✂️ Photo Crop & Alignment Controls Box */}
                <div className="rounded-xl border border-steel/20 bg-ink-2/70 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-bone font-bold uppercase tracking-wider">
                      ✂️ Photo Crop & Alignment Controls
                    </span>
                    <span className="font-mono text-[10px] text-steel-dim">
                      Pos: {currentPos} | Zoom: {currentZoom}%
                    </span>
                  </div>

                  {/* Vertical Position Presets & Slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label hint="Adjust vertical face focus inside card frame">Vertical Focus (Y-Axis)</Label>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => update(idx, "objectPosition", "50% 0%")}
                          className="rounded border border-steel/20 bg-ink-3 px-2 py-0.5 font-mono text-[10px] text-bone hover:border-steel cursor-pointer"
                        >
                          Top
                        </button>
                        <button
                          type="button"
                          onClick={() => update(idx, "objectPosition", "50% 20%")}
                          className="rounded border border-steel/20 bg-ink-3 px-2 py-0.5 font-mono text-[10px] text-bone hover:border-steel cursor-pointer"
                        >
                          Face Focus
                        </button>
                        <button
                          type="button"
                          onClick={() => update(idx, "objectPosition", "50% 50%")}
                          className="rounded border border-steel/20 bg-ink-3 px-2 py-0.5 font-mono text-[10px] text-bone hover:border-steel cursor-pointer"
                        >
                          Center
                        </button>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={yVal}
                      onChange={(e) => update(idx, "objectPosition", `50% ${e.target.value}%`)}
                      className="w-full accent-signal cursor-pointer"
                    />
                  </div>

                  {/* Zoom Slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label hint="Scale image inside card frame">Photo Zoom ({currentZoom}%)</Label>
                      <button
                        type="button"
                        onClick={() => update(idx, "zoom", 100)}
                        className="rounded border border-steel/20 bg-ink-3 px-2 py-0.5 font-mono text-[10px] text-bone hover:border-steel cursor-pointer"
                      >
                        Reset (100%)
                      </button>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="180"
                      step="5"
                      value={currentZoom}
                      onChange={(e) => update(idx, "zoom", parseInt(e.target.value, 10))}
                      className="w-full accent-signal cursor-pointer"
                    />
                  </div>
                </div>

              </div>

              {/* Right: Real-time Live Card Crop Preview */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-steel-dim uppercase tracking-wider text-center">
                  Live Card Preview
                </span>
                <div className="relative overflow-hidden rounded-xl border border-steel/25 bg-ink-2 p-3 shadow-lg">
                  <div className="relative aspect-[16/11] w-full overflow-hidden rounded-lg bg-ink-3">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name || "Preview"}
                        fill
                        unoptimized
                        style={{
                          objectFit: "cover",
                          objectPosition: currentPos,
                          transform: `scale(${currentZoom / 100})`,
                        }}
                        className="transition-all duration-200"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-steel-dim">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-2 right-2 rounded-full bg-ink/80 px-2 py-0.5 font-mono text-[9px] text-signal-bright uppercase border border-steel/20">
                      {m.tag || "HOST"}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="font-display text-sm text-bone font-bold truncate">{m.name || "Member Name"}</p>
                      <p className="font-mono text-[10px] text-signal-bright truncate">{m.role || "Role Title"}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="self-start rounded-full border border-steel/25 bg-ink-2 px-5 py-2.5 font-mono text-xs tracking-wider text-bone uppercase hover:border-steel cursor-pointer transition-colors"
      >
        + Add Team Member
      </button>
    </div>
  );
}
