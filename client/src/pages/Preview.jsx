import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import {
  Eye, Code2, Copy, Check, Sparkles,
  Braces, Loader2, TriangleAlert, ChevronLeft,
  Cpu, Monitor, Tablet, Smartphone, RefreshCw
} from "lucide-react";

/* ── Helpers ──────────────────────────────────────────────────── */
function injectSafeguards(rawHtml) {
  if (!rawHtml) return "";
  const script = `<script>
    document.addEventListener('click', function(e) {
      var t = e.target.closest('a');
      if (t) {
        var h = t.getAttribute('href');
        if (h && h.startsWith('#')) {
          e.preventDefault();
          var el = document.getElementById(h.slice(1));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (h && !h.startsWith('javascript:') && !h.startsWith('mailto:') && !h.startsWith('tel:')) {
          t.setAttribute('target', '_blank');
        }
      }
    }, true);
  </script>`;
  return rawHtml.includes("</body>")
    ? rawHtml.replace("</body>", `${script}</body>`)
    : rawHtml + script;
}

const PROVIDER_META = {
  Gemini: { color: "#4285F4", label: "Gemini" },
  OpenAI: { color: "#10A37F", label: "OpenAI" },
  Ollama: { color: "#FF8C00", label: "Ollama (local)" },
};

const DEVICE_WIDTHS = { desktop: "100%", tablet: "768px", mobile: "390px" };

/* ── Sub-components ──────────────────────────────────────────── */
function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
        active
          ? "bg-[var(--bg-tertiary)] text-white shadow-sm"
          : "text-slate-500 hover:text-slate-300 hover:bg-[var(--bg-tertiary)]/50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function DeviceBtn({ active, onClick, icon, title }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-2 rounded-lg transition-all cursor-pointer ${
        active ? "bg-[var(--bg-tertiary)] text-white shadow-sm" : "text-slate-600 hover:text-slate-300"
      }`}
    >
      {icon}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center p-8 select-none">
      <div className="relative">
        <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-full" />
        <div className="relative w-20 h-20 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center">
          <Monitor size={32} className="text-slate-600" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-white mb-2">No preview yet</h3>
        <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">
          Head over to the Builder, describe your website, and hit Generate.
        </p>
      </div>
      <Link
        to="/describe"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-500 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
      >
        <Sparkles size={15} /> Go to Builder
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 select-none">
      <div className="relative w-20 h-20">
        <span className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-purple-500 animate-[spin_1s_linear_infinite]" />
        <span className="absolute inset-2.5 rounded-full border-[3px] border-transparent border-t-indigo-400 animate-[spin_1.6s_linear_infinite_reverse]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={22} className="text-purple-400 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-1">Building your website…</h3>
        <p className="text-sm text-[var(--text-muted)]">AI is crafting responsive HTML, CSS & JS for you</p>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────── */
export default function Preview() {
  const { html, loading, error, projectType, theme, features, provider } = useProject();
  const [activeTab, setActiveTab] = useState("preview");
  const [device, setDevice] = useState("desktop");
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!html) return;
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }, [html]);

  const providerStyle = PROVIDER_META[provider] ?? { color: "#888", label: provider };

  return (
    <div className="flex flex-1 overflow-hidden bg-[var(--bg-primary)]" style={{ height: "calc(100vh - 72px)" }}>

      {/* ── Left Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--border)] bg-[var(--bg-secondary)] shrink-0">
        {/* Back link */}
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <Link
            to="/describe"
            className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors font-medium"
          >
            <ChevronLeft size={14} /> Back to Builder
          </Link>
        </div>

        {/* Project metadata */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Project Settings</p>
            <div className="space-y-4">
              {[
                { label: "Type",  value: projectType || "Default" },
                { label: "Theme", value: theme || "Default" },
              ].map(row => (
                <div key={row.label}>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-1">{row.label}</p>
                  <p className="text-sm font-medium text-white">{row.value}</p>
                </div>
              ))}

              {features?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-2">Features</p>
                  <div className="flex flex-wrap gap-1.5">
                    {features.map((f, i) => (
                      <span key={i} className="text-[10px] font-medium text-[var(--text-muted)] bg-[var(--bg-tertiary)] border border-[var(--border)] px-2 py-0.5 rounded-md">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Provider badge */}
          {provider && html && !loading && (
            <div className="pt-4 border-t border-[var(--border)]">
              <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-2">Generated by</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: `${providerStyle.color}15`, color: providerStyle.color, border: `1px solid ${providerStyle.color}30` }}>
                <Cpu size={11} /> {providerStyle.label}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-secondary)] shrink-0 gap-3">
          {/* Left: Tabs */}
          <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-1 rounded-xl">
            <TabBtn active={activeTab === "preview"} onClick={() => setActiveTab("preview")} icon={<Eye size={14} />} label="Preview" />
            <TabBtn active={activeTab === "code"}    onClick={() => setActiveTab("code")}    icon={<Code2 size={14} />} label="Code" />
          </div>

          {/* Center: Device picker (preview only) */}
          {activeTab === "preview" && html && !loading && (
            <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-1 rounded-xl">
              <DeviceBtn active={device === "desktop"} onClick={() => setDevice("desktop")} icon={<Monitor size={14} />} title="Desktop" />
              <DeviceBtn active={device === "tablet"}  onClick={() => setDevice("tablet")}  icon={<Tablet size={14} />}  title="Tablet" />
              <DeviceBtn active={device === "mobile"}  onClick={() => setDevice("mobile")}  icon={<Smartphone size={14} />} title="Mobile" />
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {html && activeTab === "code" && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-white hover:border-slate-600 transition-all cursor-pointer"
              >
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            )}
            <Link
              to="/describe"
              className="lg:hidden flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-white transition-all"
            >
              <RefreshCw size={11} /> Builder
            </Link>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden bg-[var(--bg-primary)]">
          {error && (
            <div className="m-5 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/8 px-5 py-4 text-sm text-red-400 animate-fade-in">
              <TriangleAlert size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold mb-0.5">Generation Failed</p>
                <p className="text-xs leading-relaxed text-red-300/80">{error}</p>
              </div>
            </div>
          )}

          {!html && !loading && !error && <EmptyState />}
          {loading && <LoadingState />}

          {html && !loading && activeTab === "preview" && (
            <div className="flex items-start justify-center h-full overflow-auto p-6">
              <div
                className="rounded-xl overflow-hidden border border-[var(--border)] shadow-2xl transition-all duration-300 bg-white"
                style={{ width: DEVICE_WIDTHS[device], height: "100%", minHeight: "400px" }}
              >
                <iframe
                  title="Live Preview"
                  sandbox="allow-scripts allow-same-origin"
                  srcDoc={injectSafeguards(html)}
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {html && !loading && activeTab === "code" && (
            <div className="h-full overflow-auto p-6">
              <pre className="text-xs font-mono leading-6 text-slate-400 whitespace-pre-wrap break-words bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
                <code>{html}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
