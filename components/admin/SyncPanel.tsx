"use client";

import { useState, useTransition } from "react";
import { runSync } from "@/app/admin/actions";
import type { SyncResult } from "@/lib/youtube";

export function SyncPanel({ last, configured }: { last: SyncResult | null; configured: boolean }) {
  const [pending, start] = useTransition();
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-steel/12 bg-ink-2/50 p-[clamp(16px,2.2vw,26px)]">
      <div className="min-w-0">
        <h2 className="display text-[clamp(17px,1.8vw,22px)] text-bone">YouTube sync</h2>
        {!configured ? (
          <p className="mt-1.5 text-[13px] text-[#e08a84]">
            Set <code className="font-mono text-[12px]">YOUTUBE_API_KEY</code> in your environment to enable syncing.
          </p>
        ) : last ? (
          <p className="mt-1.5 text-[13px] text-steel-dim">
            {last.ok ? (
              <>
                Last run {new Date(last.at).toLocaleString()} — {last.imported} imported, {last.updated} updated,{" "}
                {last.skipped} skipped (edited), {last.total} on channel.
              </>
            ) : (
              <span className="text-[#e08a84]">Last run failed: {last.error}</span>
            )}
          </p>
        ) : (
          <p className="mt-1.5 text-[13px] text-steel-dim">Never run. Scheduled automatically every 6 hours.</p>
        )}
        {note && <p className="mt-1.5 text-[13px] text-signal-bright">{note}</p>}
      </div>

      <button
        type="button"
        disabled={pending || !configured}
        onClick={() =>
          start(async () => {
            setNote(null);
            await runSync();
            setNote("Sync complete.");
          })
        }
        className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-bone px-5 py-2.5 font-mono text-[10.5px] tracking-[0.16em] text-ink uppercase transition-colors hover:bg-signal hover:text-bone disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending && <span className="block h-3 w-3 rounded-full border-2 border-ink/25 border-t-ink" style={{ animation: "slp-spin .7s linear infinite" }} />}
        {pending ? "Syncing" : "Sync now"}
      </button>
    </div>
  );
}
