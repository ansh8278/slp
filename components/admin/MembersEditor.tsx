"use client";

import { useState } from "react";
import { Label, inputCls } from "./ui";
import type { TeamMember } from "../TeamShowcase";

export function MembersEditor({ members: initial }: { members: TeamMember[] }) {
  const [members, setMembers] = useState<TeamMember[]>(initial || []);

  const update = (idx: number, field: keyof TeamMember, value: string) => {
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
        name: "",
        role: "",
        tag: "Host",
        photo: "/brand/member1.webp",
        bio: "",
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-6">
      <input type="hidden" name="members_json" value={JSON.stringify(members)} />

      {members.map((m, idx) => (
        <div key={m.id || idx} className="flex flex-col gap-4 rounded-2xl border border-steel/20 bg-ink-3/50 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-steel/15 pb-3">
            <span className="font-mono text-xs text-signal-bright uppercase tracking-wider font-bold">
              Team Member #{idx + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="font-mono text-[11px] text-red-400 hover:text-red-300 uppercase tracking-widest cursor-pointer"
            >
              ✕ Remove
            </button>
          </div>

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
        </div>
      ))}

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
