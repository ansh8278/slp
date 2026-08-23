"use client";

import { useState } from "react";
import { inputCls, Label } from "./ui";

type Topic = { title: string; body: string };

export function TopicsEditor({ topics }: { topics: Topic[] }) {
  const [rows, setRows] = useState<Topic[]>(topics.length ? topics : [{ title: "", body: "" }]);

  return (
    <div className="flex flex-col gap-4">
      {rows.map((t, i) => (
        <div key={i} className="grid gap-4 rounded-sm border border-steel/12 p-4 lg:grid-cols-[280px_1fr_auto]">
          <label className="flex flex-col gap-2">
            <Label>Title {i + 1}</Label>
            <input name="topicTitle" defaultValue={t.title} className={inputCls} />
          </label>
          <label className="flex flex-col gap-2">
            <Label>Body</Label>
            <textarea name="topicBody" rows={2} defaultValue={t.body} className={`${inputCls} resize-y`} />
          </label>
          <button
            type="button"
            onClick={() => setRows(rows.filter((_, j) => j !== i))}
            aria-label={`Remove topic ${i + 1}`}
            className="cursor-pointer self-end rounded-full border border-[#c2544e]/40 px-3 py-2 font-mono text-[10px] tracking-[0.14em] text-[#e08a84] uppercase transition-colors hover:bg-[#c2544e] hover:text-bone"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows([...rows, { title: "", body: "" }])}
        className="w-fit cursor-pointer rounded-full border border-steel/22 px-4 py-2 font-mono text-[10px] tracking-[0.14em] text-steel uppercase transition-colors hover:border-steel hover:text-bone"
      >
        + Add topic
      </button>
    </div>
  );
}
