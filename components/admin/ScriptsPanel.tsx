"use client";

import { useEffect, useState } from "react";

interface PageScriptEntry {
  path: string;
  code: string;
}

const TEMPLATES = {
  ga4: `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`,

  metaPixel: `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>`,

  hotjar: `<!-- Hotjar Tracking Code -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>`,

  customCss: `<style>
  /* Custom Global Styles */
  body {
    /* Custom tweak */
  }
</style>`,
};

export function ScriptsPanel() {
  const [activeTab, setActiveTab] = useState<"head" | "foot" | "page">("head");
  const [headerCode, setHeaderCode] = useState("");
  const [footerCode, setFooterCode] = useState("");
  const [pageEntries, setPageEntries] = useState<PageScriptEntry[]>([]);
  const [newPath, setNewPath] = useState("");
  const [newCode, setNewCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/scripts")
      .then((res) => res.json())
      .then((data) => {
        if (data.headerCode) setHeaderCode(data.headerCode);
        if (data.footerCode) setFooterCode(data.footerCode);
        if (data.pageBodyCodes) {
          const entries: PageScriptEntry[] = Object.entries(data.pageBodyCodes).map(([path, code]) => ({
            path,
            code: String(code),
          }));
          setPageEntries(entries);
        }
      })
      .catch((err) => {
        console.error("Failed to load scripts:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const pageBodyCodes: Record<string, string> = {};
    pageEntries.forEach((entry) => {
      if (entry.path.trim()) {
        pageBodyCodes[entry.path.trim()] = entry.code;
      }
    });

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

      if (!res.ok) throw new Error("Failed to save settings");

      setMessage({ type: "success", text: "✅ Injection settings saved & revalidated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save script injections." });
    } finally {
      setSaving(false);
    }
  };

  const handleInsertTemplate = (templateKey: keyof typeof TEMPLATES) => {
    const code = TEMPLATES[templateKey];
    if (activeTab === "head") {
      setHeaderCode((prev) => (prev ? `${prev}\n\n${code}` : code));
    } else if (activeTab === "foot") {
      setFooterCode((prev) => (prev ? `${prev}\n\n${code}` : code));
    } else {
      setNewCode((prev) => (prev ? `${prev}\n\n${code}` : code));
    }
  };

  const handleAddPageEntry = () => {
    if (!newPath.trim()) return;
    setPageEntries((prev) => [...prev.filter((e) => e.path !== newPath.trim()), { path: newPath.trim(), code: newCode }]);
    setNewPath("");
    setNewCode("");
  };

  const handleRemovePageEntry = (pathToRemove: string) => {
    setPageEntries((prev) => prev.filter((e) => e.path !== pathToRemove));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center font-mono text-sm text-steel-dim">
        Loading Code Injector Settings...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-steel/15 bg-ink-2 p-6 backdrop-blur-md">
        <div>
          <h2 className="display text-2xl text-bone">Code Management System</h2>
          <p className="text-xs text-steel-dim mt-1">
            Inject Google Analytics, Meta Pixel, Hotjar, Crisp Chat, or custom JS/CSS dynamically.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-xs font-bold tracking-wider text-bone uppercase transition-transform hover:scale-105 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Injection Settings"}
        </button>
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 font-mono text-xs ${
            message.type === "success" ? "border border-signal/40 bg-signal/10 text-signal-bright" : "border border-red-500/40 bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Preset Insertions */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-steel/12 bg-ink-3/60 p-4">
        <span className="font-mono text-xs text-steel-dim mr-2">One-Click Presets:</span>
        <button
          type="button"
          onClick={() => handleInsertTemplate("ga4")}
          className="rounded-full border border-steel/20 bg-ink px-3 py-1 font-mono text-[11px] text-steel hover:text-bone hover:border-signal"
        >
          + Google Analytics 4
        </button>
        <button
          type="button"
          onClick={() => handleInsertTemplate("metaPixel")}
          className="rounded-full border border-steel/20 bg-ink px-3 py-1 font-mono text-[11px] text-steel hover:text-bone hover:border-signal"
        >
          + Meta Pixel
        </button>
        <button
          type="button"
          onClick={() => handleInsertTemplate("hotjar")}
          className="rounded-full border border-steel/20 bg-ink px-3 py-1 font-mono text-[11px] text-steel hover:text-bone hover:border-signal"
        >
          + Hotjar
        </button>
        <button
          type="button"
          onClick={() => handleInsertTemplate("customCss")}
          className="rounded-full border border-steel/20 bg-ink px-3 py-1 font-mono text-[11px] text-steel hover:text-bone hover:border-signal"
        >
          + Custom CSS
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-steel/15">
        <button
          type="button"
          onClick={() => setActiveTab("head")}
          className={`px-6 py-3 font-mono text-xs font-medium tracking-wider uppercase border-b-2 transition-colors ${
            activeTab === "head" ? "border-signal text-signal-bright" : "border-transparent text-steel-dim hover:text-bone"
          }`}
        >
          Header Injection (&lt;head&gt;)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("foot")}
          className={`px-6 py-3 font-mono text-xs font-medium tracking-wider uppercase border-b-2 transition-colors ${
            activeTab === "foot" ? "border-signal text-signal-bright" : "border-transparent text-steel-dim hover:text-bone"
          }`}
        >
          Footer Injection (&lt;/body&gt;)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("page")}
          className={`px-6 py-3 font-mono text-xs font-medium tracking-wider uppercase border-b-2 transition-colors ${
            activeTab === "page" ? "border-signal text-signal-bright" : "border-transparent text-steel-dim hover:text-bone"
          }`}
        >
          Page-Specific Body Injection ({pageEntries.length})
        </button>
      </div>

      {/* Tab 1: Header Injection */}
      {activeTab === "head" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between font-mono text-xs text-steel-dim">
            <span>Injected directly inside &lt;head&gt; tags globally</span>
            <span>Length: {headerCode.length} chars</span>
          </div>
          <textarea
            value={headerCode}
            onChange={(e) => setHeaderCode(e.target.value)}
            placeholder="<!-- Insert GTM, Meta Pixel, or <style> tags here -->"
            rows={12}
            className="w-full rounded-2xl border border-steel/20 bg-ink p-4 font-mono text-xs text-bone focus:border-signal focus:outline-none"
          />
        </div>
      )}

      {/* Tab 2: Footer Injection */}
      {activeTab === "foot" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between font-mono text-xs text-steel-dim">
            <span>Injected right before &lt;/body&gt; closing tag globally</span>
            <span>Length: {footerCode.length} chars</span>
          </div>
          <textarea
            value={footerCode}
            onChange={(e) => setFooterCode(e.target.value)}
            placeholder="<!-- Insert Crisp, Intercom, or custom JS scripts here -->"
            rows={12}
            className="w-full rounded-2xl border border-steel/20 bg-ink p-4 font-mono text-xs text-bone focus:border-signal focus:outline-none"
          />
        </div>
      )}

      {/* Tab 3: Page-Specific Injection */}
      {activeTab === "page" && (
        <div className="flex flex-col gap-6">
          {/* New Path Add Box */}
          <div className="rounded-2xl border border-steel/15 bg-ink-2 p-5 flex flex-col gap-4">
            <h4 className="font-mono text-xs font-bold text-bone uppercase">Add Page-Specific Target</h4>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                placeholder="/contact or /episodes"
                className="rounded-xl border border-steel/20 bg-ink px-4 py-2.5 font-mono text-xs text-bone focus:border-signal focus:outline-none sm:w-64"
              />
              <button
                type="button"
                onClick={handleAddPageEntry}
                className="rounded-xl bg-steel/20 px-5 py-2.5 font-mono text-xs text-bone hover:bg-signal"
              >
                + Save Path Script
              </button>
            </div>
            <textarea
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="<script>/* Code specifically for this path */</script>"
              rows={4}
              className="w-full rounded-xl border border-steel/20 bg-ink p-3 font-mono text-xs text-bone focus:border-signal focus:outline-none"
            />
          </div>

          {/* Existing Page Targets Table */}
          {pageEntries.length > 0 ? (
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-xs text-steel-dim uppercase">Configured Page Targets</h4>
              {pageEntries.map((entry) => (
                <div key={entry.path} className="rounded-2xl border border-steel/15 bg-ink p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-signal-bright">{entry.path}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePageEntry(entry.path)}
                      className="font-mono text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <pre className="max-h-32 overflow-y-auto rounded-xl bg-ink-2 p-3 font-mono text-[11px] text-steel-dim">
                    {entry.code}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-steel/20 p-8 text-center font-mono text-xs text-steel-dim">
              No page-specific script targets configured yet. Add path "/contact" above.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
