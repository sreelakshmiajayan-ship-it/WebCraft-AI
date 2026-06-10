import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Monitor, Tablet, Smartphone,
  Save, Download, Loader2, Sparkles, Code2, Eye,
  CheckCircle2, AlertCircle
} from "lucide-react";
import { apiUrl } from "../config/api";

const DEVICE_WIDTHS = { desktop: "100%", tablet: "768px", mobile: "390px" };

/* ── Toast notification ──────────────────────────────────────── */
function Toast({ msg, type = "success", onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, []);
  const green = type === "success";
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-semibold animate-fade-in glass-panel ${
      green ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"
    }`}>
      {green ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}

/* ── Code Tab Viewer ─────────────────────────────────────────── */
function CodeViewer({ html, css, js }) {
  const [tab, setTab] = useState("html");
  const files = { html, css, js };
  const tabCfg = [
    { key: "html", label: "HTML", color: "#f00a98" },
    { key: "css",  label: "CSS",  color: "#06B6D4" },
    { key: "js",   label: "JS",   color: "#EAB308" },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)] shrink-0">
        {tabCfg.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === t.key
                ? "text-white"
                : "text-slate-600 hover:text-slate-400"
            }`}
            style={tab === t.key ? { backgroundColor: `${t.color}20`, color: t.color } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="text-xs font-mono leading-6 text-slate-400 p-5 whitespace-pre-wrap break-words min-h-full">
          <code>{files[tab] || `/* No ${tab.toUpperCase()} generated */`}</code>
        </pre>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────── */
export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [device, setDevice] = useState("desktop");
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchProject(); }, [id]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/api/projects/${id}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setProject(data.project);
      else navigate("/dashboard");
    } catch { navigate("/dashboard"); }
    finally { setLoading(false); }
  };

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/api/projects/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ html: project.html, css: project.css, js: project.js })
      });
      if (res.ok) showToast("Changes saved!");
      else showToast("Failed to save.", "error");
    } catch { showToast("Failed to save.", "error"); }
    finally { setSaving(false); }
  };

  const handleRegenerate = async (e) => {
    e.preventDefault();
    if (!editPrompt.trim()) return;
    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const existingCode = JSON.stringify({ html: project.html, css: project.css, js: project.js });
      const res = await fetch(apiUrl("/api/projects/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: editPrompt, existingCode })
      });
      const data = await res.json();
      if (data.success) {
        setProject(prev => ({ ...prev, html: data.data.html, css: data.data.css, js: data.data.js }));
        setEditPrompt("");
        showToast("Website updated by AI!");
      } else {
        showToast(data.message || "Generation failed.", "error");
      }
    } catch { showToast("Error generating code.", "error"); }
    finally { setGenerating(false); }
  };

  const handleDownloadZip = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/api/projects/export"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ html: project.html, css: project.css, js: project.js })
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.projectName || "website"}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      showToast("ZIP downloaded!");
    } catch { showToast("Failed to download ZIP.", "error"); }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="relative w-16 h-16">
          <span className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-purple-500 animate-[spin_1s_linear_infinite]" />
          <Sparkles size={20} className="absolute inset-0 m-auto text-purple-400 animate-pulse" />
        </div>
      </div>
    );
  }
  if (!project) return null;

  const previewHtml = `${(project.html || "").replace("</head>", `<style>${project.css || ""}</style></head>`)}<script>${project.js || ""}</script>`;

  return (
    <div className="flex flex-col bg-[#020617]" style={{ height: "calc(100vh - 72px)" }}>
      {/* ── Top toolbar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-white/10 shrink-0 gap-4">
        {/* Left */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-icon"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-white leading-none truncate tracking-tight">{project.projectName}</h2>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> Live Editor
            </p>
          </div>
        </div>

        {/* Center: Tab switcher */}
        <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-[var(--border)] shrink-0">
          {[
            { key: "preview", icon: <Eye size={14} />, label: "Preview" },
            { key: "code",    icon: <Code2 size={14} />, label: "Code" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === t.key
                  ? "bg-[var(--bg-primary)] text-white shadow-lg border border-white/10"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadZip}
            className="btn-secondary px-5 py-2.5 text-xs"
          >
            <Download size={13} /> Export ZIP
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-6 py-2.5 text-xs"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Save
          </button>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden p-3 gap-3">

        {/* Left: AI Editor Sidebar */}
        <div className="w-80 bg-slate-950 border border-white/10 rounded-2xl flex flex-col shrink-0 overflow-hidden shadow-2xl">
          <div className="px-6 py-5 border-b border-white/5">
            <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest">
              <Sparkles size={16} className="text-purple-400" />
              AI Editor
            </h3>
            <p className="text-[10px] font-bold text-slate-500 mt-2 leading-relaxed uppercase tracking-tighter">
              Instruct the AI to refactor code.
            </p>
          </div>
          <div className="flex-1 p-5 flex flex-col gap-4">
            <form onSubmit={handleRegenerate} className="flex flex-col h-full gap-3">
              <textarea
                value={editPrompt}
                onChange={e => setEditPrompt(e.target.value)}
                placeholder='Try: "Add a pricing section with 3 tiers and neon hover effects"'
                className="flex-1 w-full p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-100 text-xs resize-none focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.04] transition-all placeholder-slate-700 leading-relaxed shadow-inner"
                disabled={generating}
              />
              <button
                type="submit"
                disabled={generating || !editPrompt.trim()}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-purple-600/10 text-purple-400 border border-purple-500/20 hover:bg-purple-600/20 hover:border-purple-500/50 text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/5 disabled:opacity-30"
              >
                {generating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                {generating ? "Generating…" : "Apply Changes"}
              </button>
            </form>
          </div>

          {/* Device picker (shown only in preview) */}
          {activeTab === "preview" && (
            <div className="border-t border-white/5 px-6 py-4 bg-white/[0.01]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-600 mb-2">Device Preview</p>
              <div className="flex gap-1">
                {[
                  { key: "desktop", icon: <Monitor size={14} />, label: "Desktop" },
                  { key: "tablet",  icon: <Tablet size={14} />,  label: "Tablet" },
                  { key: "mobile",  icon: <Smartphone size={14} />, label: "Mobile" },
                ].map(d => (
                  <button
                    key={d.key}
                    title={d.label}
                    onClick={() => setDevice(d.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex-1 justify-center ${
                      device === d.key
                        ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                        : "text-slate-600 hover:text-slate-400 border border-transparent"
                    }`}
                  >
                    {d.icon}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Preview / Code */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--bg-primary)]">
          {activeTab === "preview" ? (
            <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
              <div
                className="rounded-xl overflow-hidden border border-[var(--border)] shadow-2xl bg-white transition-all duration-300"
                style={{ width: DEVICE_WIDTHS[device], height: "100%", minHeight: "400px" }}
              >
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="Live Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden bg-[#0d1117]">
              <CodeViewer html={project.html} css={project.css} js={project.js} />
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
