import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Wand2, Layout, Zap, Code2, ArrowRight, Star, Check } from "lucide-react";

// ── Animation helpers ───────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

function Section({ children, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── Particles ───────────────────────────────────────────────
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${8 + (i * 7) % 84}%`,
  top: `${10 + (i * 13) % 80}%`,
  size: 2 + (i % 3),
  delay: i * 0.4,
  duration: 3 + (i % 4),
}));

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: `rgba(139,92,246,${0.2 + (p.id % 3) * 0.2})`,
          }}
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Browser Mockup ──────────────────────────────────────────
function BrowserMockup() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="w-full max-w-4xl mx-auto rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_60px_rgba(139,92,246,0.15)] overflow-hidden"
    >
      {/* Browser chrome */}
      <div className="bg-slate-950/80 p-3 flex items-center gap-3 border-b border-white/5">
        <div className="flex gap-1.5">
          {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div className="flex-1 bg-white/5 rounded-md py-1 px-3 text-[10px] text-slate-500 font-mono text-center">
          editor.webcraft.ai/project-x
        </div>
      </div>
      {/* Page content preview */}
      <div className="p-8 min-h-[300px] bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="w-1/2 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]" />
        <div className="w-3/4 h-2 bg-white/10 rounded-full mb-2" />
        <div className="w-2/3 h-2 bg-white/5 rounded-full mb-8" />
        
        <div className="flex gap-4 mb-10">
          <div className="w-32 h-10 bg-purple-600 rounded-xl" />
          <div className="w-32 h-10 border border-white/10 rounded-xl" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-24 bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <div className="w-6 h-6 bg-purple-500/20 rounded-lg mb-3" />
              <div className="w-full h-1 bg-white/10 rounded-full mb-2" />
              <div className="w-1/2 h-1 bg-white/5 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Feature Card ────────────────────────────────────────────
const FEATURES = [
  { icon: Wand2, title: "AI-Powered Generation", desc: "Describe what you want, and Gemini AI writes production-ready HTML and CSS instantly.", color: "#8B5CF6" },
  { icon: Layout, title: "Responsive by Default", desc: "Every generated site looks beautiful on all devices — mobile, tablet, and desktop.", color: "#A855F7" },
  { icon: Zap, title: "Lightning Fast", desc: "Get complete, ready-to-ship code in seconds, not weeks. Rapid iteration made easy.", color: "#6366F1" },
  { icon: Code2, title: "Clean Code Output", desc: "Semantic, accessible, well-structured HTML you can copy, customize, and deploy anywhere.", color: "#06B6D4" },
];

function FeatureCard({ icon: Icon, title, desc, color, index }) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-purple-500/30 transition-all duration-300 relative group overflow-hidden"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500" />
      <motion.div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner"
        style={{
          background: `${color}18`,
          border: `1px solid ${color}40`,
        }}
      >
        <Icon size={22} color={color} />
      </motion.div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ── How It Works Step ───────────────────────────────────────
const STEPS = [
  { num: "01", title: "Describe Project", desc: "Type a detailed prompt — page type, colors, features. Be as specific as you like.", icon: "📝" },
  { num: "02", title: "Generate Website", desc: "Our  AI processes your prompt and generates a full, responsive HTML website.", icon: "⚡" },
  { num: "03", title: "Preview & Deploy", desc: "See a live preview instantly. Copy the code and deploy anywhere in minutes.", icon: "🚀" },
];

// ── Stats ───────────────────────────────────────────────────
const STATS = [
  { value: "10,000+", label: "Websites Generated" },
  { value: "99%", label: "User Satisfaction" },
  { value: "50+", label: "Templates" },
  { value: "24/7", label: "AI Powered" },
];



// ── Main Component ──────────────────────────────────────────
export default function Home() {
  return (
    <div className="flex flex-col flex-1 overflow-x-hidden bg-[#020617] selection:bg-purple-500/30">

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <FloatingParticles />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400 tracking-wide uppercase">
              ✨ Build the future of web design
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 max-w-4xl mx-auto"
          >
            Architect stunning <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">
              websites in seconds.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Describe your vision, and WebCraft AI handles the rest. Instant code, responsive design, and production-ready components at the speed of thought.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-20"
          >
            <Link
              to="/describe"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              Start Building Free <ArrowRight size={18} />
            </Link>
            <Link
              to="/preview"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              View Showcase
            </Link>
          </motion.div>

          <BrowserMockup />
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-xs font-black text-purple-500 uppercase tracking-[0.3em] mb-4">Core Engine</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                Built for high performance
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                No more writing boilerplate. WebCraft handles the technical heavy lifting so you can focus on creative strategy.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
            </div>
          </Section>
        </div>
      </section>

      {/* ═══════════════════ STATISTICS ═══════════════════ */}
      <section className="py-20 px-6 border-y border-white/5 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <Section>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {STATS.map((s, i) => (
                <motion.div key={s.label} variants={fadeUp} transition={{ delay: i * 0.08 }}>
                  <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                    {s.value}
                  </div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ═══════════════════ CTA BANNER ═══════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <Section>
            <motion.div
              variants={fadeUp}
              className="text-center p-16 md:p-24 rounded-3xl bg-gradient-to-br from-purple-600/20 to-indigo-600/10 border border-purple-500/20 relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none" />
              
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
                Ready to build <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">your next masterpiece?</span>
              </h2>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/describe"
                    className="px-10 py-5 rounded-2xl text-lg font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_50px_rgba(139,92,246,0.5)]"
                  >
                    Start Creating Free <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>

              <div className="flex items-center justify-center gap-8 mt-12">
                {["No credit card required", "Free forever", "Instant access"].map((txt) => (
                  <span key={txt} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <Check size={13} color="#22c55e" /> {txt}
                  </span>
                ))}
              </div>
            </motion.div>
          </Section>
        </div>
      </section>

    </div>
  );
}
