import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";
import {
  Sparkles, ArrowLeft, ArrowRight,
  Layers, ShoppingCart, User, BookOpen, Briefcase, LayoutTemplate,
  Check, Wand2,
} from "lucide-react";

/* ── Data ─────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "SaaS",         name: "SaaS",         emoji: "⚡", desc: "Dashboard or service landing page.", icon: Layers,         color: "#8B5CF6" },
  { id: "E-Commerce",   name: "E-Commerce",   emoji: "🛒", desc: "Storefront, product grid, checkout.", icon: ShoppingCart,   color: "#EC4899" },
  { id: "Portfolio",    name: "Portfolio",    emoji: "✨", desc: "Showcase work, skills, contact.",     icon: User,           color: "#3B82F6" },
  { id: "Blog",         name: "Blog",         emoji: "📖", desc: "Articles, editorials, media.",         icon: BookOpen,       color: "#10B981" },
  { id: "Business",     name: "Business",     emoji: "💼", desc: "Professional company website.",        icon: Briefcase,      color: "#F59E0B" },
  { id: "Landing Page", name: "Landing Page", emoji: "🚀", desc: "Promotional page with CTAs.",          icon: LayoutTemplate, color: "#06B6D4" },
];

const SUGGESTIONS = [
  "A modern SaaS landing page with gradient hero, feature cards, and a pricing table",
  "A personal portfolio for a photographer with dark theme and animated gallery",
  "A restaurant site with animated hero, menu sections, and a reservation form",
  "A crypto dashboard with live stats, wallet cards, and neon dark aesthetic",
];

const LOADING_STEPS = [
  { label: "Analyzing your project request…",      pct: 10 },
  { label: "Warming up Gemini AI engine…",         pct: 20 },
  { label: "Composing semantic HTML structure…",   pct: 35 },
  { label: "Generating CSS design system…",        pct: 50 },
  { label: "Building JavaScript interactions…",    pct: 65 },
  { label: "Packaging structured JSON output…",    pct: 78 },
  { label: "Saving project to your workspace…",    pct: 90 },
  { label: "Launching the editor…",                pct: 100 },
];

const STEP_META = [
  { num: 1, label: "Name" },
  { num: 2, label: "Type" },
  { num: 3, label: "Describe" },
  { num: 4, label: "Review" },
];

/* ── Loading Screen ──────────────────────────────────────────── */
function LoadingScreen({ stepIdx }) {
  const s = LOADING_STEPS[Math.min(stepIdx, LOADING_STEPS.length - 1)];
  return (
    <div className="flex-1 relative flex items-center justify-center bg-[var(--bg-primary)] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-sm w-full px-6 space-y-8">
        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto">
          <span className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-purple-500 animate-[spin_1s_linear_infinite]" />
          <span className="absolute inset-3 rounded-full border-[3px] border-transparent border-t-indigo-400 animate-[spin_1.6s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Building your website</h2>
          <p className="text-sm text-[var(--text-muted)] min-h-[20px] transition-all duration-500">
            {s.label}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-700"
              style={{ width: `${s.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Generating…</span>
            <span>{s.pct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step Indicator ──────────────────────────────────────────── */
function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-0">
      {STEP_META.map((s, i) => {
        const done = s.num < current;
        const active = s.num === current;
        return (
          <div key={s.num} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              active  ? "bg-purple-500/15 text-purple-300 border border-purple-500/30" :
              done    ? "text-purple-400/60" :
                        "text-slate-600"
            }`}>
              <span className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                active ? "bg-purple-500 text-white" :
                done   ? "bg-purple-500/30 text-purple-400" :
                         "bg-slate-800 text-slate-600"
              }`}>
                {done ? <Check size={8} strokeWidth={3} /> : s.num}
              </span>
              {s.label}
            </div>
            {i < STEP_META.length - 1 && (
              <div className={`w-8 h-px mx-1 transition-colors duration-300 ${s.num < current ? "bg-purple-500/30" : "bg-slate-800"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────── */
export default function Describe() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [websiteType, setWebsiteType] = useState("Landing Page");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  /* Cycle loading steps */
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(interval);
  }, [loading]);

  const go = (dir) => {
    if (dir === 1) {
      if (step === 1 && !projectName.trim()) { setError("Please enter a project name."); return; }
      if (step === 3 && !description.trim()) { setError("Please describe your website."); return; }
    }
    setError("");
    setStep(s => s + dir);
  };

  const handleBuild = async () => {
    setLoading(true);
    setLoadingStep(0);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      const prompt = `Create a ${websiteType} named "${projectName}". ${description}`;

      // Generate
      const genRes = await fetch(apiUrl("/api/projects/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt }),
      });
      const genData = await genRes.json();
      if (!genData.success) throw new Error(genData.message || "Generation failed.");

      // Save
      const { html, css, js } = genData.data;
      const saveRes = await fetch(apiUrl("/api/projects"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ projectName, description, websiteType, html, css, js }),
      });
      const saveData = await saveRes.json();
      if (!saveData.success) throw new Error(saveData.message || "Failed to save.");

      navigate(`/projects/${saveData.project._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen stepIdx={loadingStep} />;

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-primary)]">

      {/* ── Top bar ────────────────────────────────────────────── */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <StepIndicator current={step} />
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs text-slate-600 hover:text-white transition-colors cursor-pointer font-medium"
          >
            ✕ Cancel
          </button>
        </div>
      </div>

      {/* ── Step content ───────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-2">
                  <Wand2 size={24} className="text-purple-400" />
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Name your project</h2>
                <p className="text-[var(--text-muted)] text-base max-w-md mx-auto leading-relaxed">
                  Give it a memorable title — this appears on your dashboard and the editor tab.
                </p>
              </div>
              <input
                type="text"
                value={projectName}
                onChange={e => { setProjectName(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && go(1)}
                className="w-full px-6 py-5 text-xl font-medium text-white bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition-all placeholder-slate-700"
                placeholder="e.g. My Awesome Portfolio"
                autoFocus
              />
              <p className="text-xs text-slate-600 text-center">Press Enter or click Continue</p>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Choose a category</h2>
                <p className="text-[var(--text-muted)] text-base max-w-md mx-auto">
                  The AI tailors your website's structure and sections to match the category.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const sel = websiteType === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setWebsiteType(cat.id); setError(""); }}
                      className={`group relative flex flex-col items-start gap-3 p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                        sel
                          ? "border-purple-500/50 bg-purple-500/8 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                          : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-slate-700 hover:bg-[var(--bg-tertiary)]"
                      }`}
                    >
                      {sel && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                          <Check size={10} strokeWidth={3} className="text-white" />
                        </div>
                      )}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cat.color}18`, border: `1px solid ${cat.color}30` }}>
                        <Icon size={18} style={{ color: cat.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-0.5">{cat.emoji} {cat.name}</p>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{cat.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Describe your vision</h2>
                <p className="text-[var(--text-muted)] text-base max-w-md mx-auto">
                  Be specific — mention colors, sections, tone, and any features you want.
                </p>
              </div>
              <textarea
                rows={7}
                value={description}
                onChange={e => { setDescription(e.target.value); setError(""); }}
                className="w-full px-5 py-4 text-sm text-white bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl resize-none focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition-all placeholder-slate-700 leading-relaxed"
                placeholder="e.g. A clean dark portfolio with a full-width animated hero, project cards with hover effects, smooth scroll, and a minimal contact section…"
                autoFocus
              />
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Quick ideas</p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setDescription(s); setError(""); }}
                      className="text-left text-xs text-[var(--text-muted)] px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-purple-500/30 hover:text-white hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer leading-relaxed"
                    >
                      "{s}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4 (Review) ── */}
          {step === 4 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-2">
                  <Sparkles size={24} className="text-purple-400" />
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Ready to build</h2>
                <p className="text-[var(--text-muted)] text-base">
                  Review your project details, then let the AI do the rest.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="grid divide-y divide-[var(--border)]">
                  {[
                    { label: "Project Name", value: projectName },
                    { label: "Category",     value: websiteType  },
                    { label: "Description",  value: description,  mono: false },
                  ].map(row => (
                    <div key={row.label} className="flex gap-6 px-6 py-4 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider w-28 shrink-0 pt-0.5">{row.label}</span>
                      <p className={`text-sm text-white flex-1 leading-relaxed ${row.label === "Description" ? "text-[var(--text-muted)]" : "font-semibold"}`}>
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleBuild}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(139,92,246,0.35)] cursor-pointer"
              >
                <Sparkles size={18} />
                Build with AI
              </button>
            </div>
          )}

          {/* ── Navigation ─────────────────────────────────────── */}
          {step < 4 && (
            <div className={`flex mt-10 ${step > 1 ? "justify-between" : "justify-end"}`}>
              {step > 1 && (
                <button
                  onClick={() => go(-1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-slate-600 transition-all text-sm font-medium cursor-pointer"
                >
                  <ArrowLeft size={15} /> Back
                </button>
              )}
              <button
                onClick={() => go(1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:opacity-90 active:scale-95 transition-all shadow-[0_0_20px_rgba(139,92,246,0.25)] cursor-pointer"
              >
                Continue <ArrowRight size={15} />
              </button>
            </div>
          )}
          {step === 4 && (
            <div className="flex justify-start mt-6">
              <button
                onClick={() => go(-1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-slate-600 transition-all text-sm font-medium cursor-pointer"
              >
                <ArrowLeft size={15} /> Back
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
