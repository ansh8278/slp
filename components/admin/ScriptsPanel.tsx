"use client";

import { useEffect, useState } from "react";

const GTM_HEADER_SNIPPET = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->`;

const GTM_BODY_SNIPPET = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

const FOOTER_SNIPPET = `<!-- Custom Analytics / Chat Widget -->
<script>
  console.log("Footer script initialized");
</script>`;

const PAGE_OPTIONS = [
  { label: "Global / All Pages (default)", key: "global" },
  { label: "Home Page (/)", key: "/" },
  { label: "Contact Page (/contact)", key: "/contact" },
  { label: "Episodes Page (/episodes)", key: "/episodes" },
  { label: "About Page (/about)", key: "/about" },
];

export function ScriptsPanel() {
  const [headerCode, setHeaderCode] = useState("");
  const [footerCode, setFooterCode] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("global");
  const [customPath, setCustomPath] = useState("");
  const [pageBodyCodes, setPageBodyCodes] = useState<Record<string, string>>({
    global: "<!--test-->\n<!--test2-->\n<!--test3-->\n<!--test4-->",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const currentTargetKey = selectedTarget === "custom" ? customPath.trim() || "/custom" : selectedTarget;

  useEffect(() => {
    fetch("/api/admin/scripts")
      .then((res) => res.json())
      .then((data) => {
        if (data.headerCode) setHeaderCode(data.headerCode);
        if (data.footerCode) setFooterCode(data.footerCode);
        if (data.pageBodyCodes && typeof data.pageBodyCodes === "object") {
          setPageBodyCodes((prev) => ({ ...prev, ...data.pageBodyCodes }));
        }
      })
      .catch((err) => console.error("Failed to fetch scripts:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/scripts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headerCode,
          footerCode,
          pageBodyCodes,
        }),
      });

      if (!res.ok) throw new Error("Failed to save script tags");

      setMessage({ type: "success", text: "✅ Script tags saved & reflected live in DOM successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save scripts" });
    } finally {
      setSaving(false);
    }
  };

  const handleBodyCodeChange = (val: string) => {
    if (!currentTargetKey) return;
    setPageBodyCodes((prev) => ({
      ...prev,
      [currentTargetKey]: val,
    }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center font-mono text-sm text-steel-dim">
        Loading Script Injection Settings...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-steel/15 bg-ink-2 p-6 backdrop-blur-xl shadow-xl">
        <div>
          <span className="font-mono text-xs text-signal-bright uppercase tracking-widest">
            Global & Page Script Injection
          </span>
          <h1 className="display mt-1 text-2xl text-bone">Header, Footer & Body Tags</h1>
          <p className="mt-1 text-xs leading-relaxed text-steel-dim max-w-2xl">
            Easily include custom code, GTM tracking, meta tags, and analytics pixels into page headers, footers, or body tags. Changes reflect instantly when inspecting the DOM.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-signal px-8 py-3.5 font-mono text-xs font-bold tracking-wider text-bone uppercase transition-all hover:bg-signal-bright hover:scale-105 shadow-lg disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Script Tags"}
        </button>
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 font-mono text-xs transition-all ${
            message.type === "success"
              ? "border border-signal/40 bg-signal/10 text-signal-bright shadow-md"
              : "border border-red-500/40 bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 1. <head> Global Header Code */}
      <div className="rounded-3xl border border-steel/15 bg-ink-2 p-6 backdrop-blur-md flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-steel/12 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-signal-bright">&lt;head&gt;</span>
              <h3 className="display text-lg text-bone">Global Header Code</h3>
            </div>
            <p className="mt-1 text-xs text-steel-dim">
              These scripts will be printed inside the &lt;head&gt; section across all pages (e.g. Google Tag Manager header, meta tags, CSS links).
            </p>
          </div>

          <button
            type="button"
            onClick={() => setHeaderCode((prev) => (prev ? `${prev}\n${GTM_HEADER_SNIPPET}` : GTM_HEADER_SNIPPET))}
            className="rounded-full border border-signal/30 bg-signal/10 px-4 py-1.5 font-mono text-xs text-signal-bright hover:bg-signal/20 transition-all cursor-pointer"
          >
            + Add GTM Header Snippet
          </button>
        </div>

        <textarea
          value={headerCode}
          onChange={(e) => setHeaderCode(e.target.value)}
          placeholder="<!-- Global <head> scripts (e.g. GTM, Meta Pixel, custom <style>) -->"
          rows={7}
          className="w-full rounded-2xl border border-steel/20 bg-ink p-4 font-mono text-xs text-bone focus:border-signal focus:outline-none transition-colors"
        />
      </div>

      {/* 2. <body> Page-Specific Body Code */}
      <div className="rounded-3xl border border-steel/15 bg-ink-2 p-6 backdrop-blur-md flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-steel/12 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-signal-bright">&lt;body&gt;</span>
              <h3 className="display text-lg text-bone">Page-Specific Body Code</h3>
            </div>
            <p className="mt-1 text-xs text-steel-dim">
              Select a page to include different body tags (e.g. GTM noscript iframe, conversion pixels). Header and footer tags remain global across all pages.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleBodyCodeChange((pageBodyCodes[currentTargetKey] || "") + `\n${GTM_BODY_SNIPPET}`)}
            className="rounded-full border border-signal/30 bg-signal/10 px-4 py-1.5 font-mono text-xs text-signal-bright hover:bg-signal/20 transition-all cursor-pointer"
          >
            + Add GTM Body Snippet
          </button>
        </div>

        {/* Target Page Selector */}
        <div className="flex flex-col gap-3">
          <label className="font-mono text-xs font-bold text-bone uppercase">Target Page Selection:</label>
          <div className="flex flex-wrap gap-2">
            {PAGE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSelectedTarget(opt.key)}
                className={`rounded-xl px-4 py-2 font-mono text-xs transition-all cursor-pointer ${
                  selectedTarget === opt.key
                    ? "bg-signal text-bone font-bold shadow-md"
                    : "border border-steel/20 bg-ink text-steel hover:text-bone"
                }`}
              >
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedTarget("custom")}
              className={`rounded-xl px-4 py-2 font-mono text-xs transition-all cursor-pointer ${
                selectedTarget === "custom"
                  ? "bg-signal text-bone font-bold shadow-md"
                  : "border border-steel/20 bg-ink text-steel hover:text-bone"
              }`}
            >
              + Custom Path...
            </button>
          </div>

          {selectedTarget === "custom" && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="/checkout or /pricing"
                className="rounded-xl border border-steel/20 bg-ink px-4 py-2 font-mono text-xs text-bone focus:border-signal focus:outline-none w-64"
              />
              <span className="font-mono text-xs text-steel-dim">Enter path starting with /</span>
            </div>
          )}
        </div>

        {/* Textarea for target page body code */}
        <div className="flex flex-col gap-2 mt-2">
          <span className="font-mono text-xs text-steel-dim">
            Body Code for <strong className="text-signal-bright">[{currentTargetKey}]</strong> (Printed just below opening &lt;body&gt; tag):
          </span>
          <textarea
            value={pageBodyCodes[currentTargetKey] || ""}
            onChange={(e) => handleBodyCodeChange(e.target.value)}
            placeholder={`<!-- Body code for ${currentTargetKey} (e.g. GTM noscript, pixels) -->`}
            rows={7}
            className="w-full rounded-2xl border border-steel/20 bg-ink p-4 font-mono text-xs text-bone focus:border-signal focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* 3. </body> Global Footer Code */}
      <div className="rounded-3xl border border-steel/15 bg-ink-2 p-6 backdrop-blur-md flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-steel/12 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-signal-bright">&lt;/body&gt;</span>
              <h3 className="display text-lg text-bone">Global Footer Code</h3>
            </div>
            <p className="mt-1 text-xs text-steel-dim">
              These scripts will be printed right before the closing &lt;/body&gt; tag across all pages (e.g. chat widgets, analytics trackers, custom event listeners).
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFooterCode((prev) => (prev ? `${prev}\n${FOOTER_SNIPPET}` : FOOTER_SNIPPET))}
            className="rounded-full border border-signal/30 bg-signal/10 px-4 py-1.5 font-mono text-xs text-signal-bright hover:bg-signal/20 transition-all cursor-pointer"
          >
            + Add Footer Snippet
          </button>
        </div>

        <textarea
          value={footerCode}
          onChange={(e) => setFooterCode(e.target.value)}
          placeholder="<!-- Global footer scripts (e.g. Crisp, Intercom, analytics) -->"
          rows={7}
          className="w-full rounded-2xl border border-steel/20 bg-ink p-4 font-mono text-xs text-bone focus:border-signal focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
}
