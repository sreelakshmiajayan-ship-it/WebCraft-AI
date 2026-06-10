import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Rocket, Wand2, Code2, Zap, Shield, Globe, ArrowRight, Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function Section({ children, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} style={style}>
      {children}
    </motion.div>
  );
}

const TECH_STACK = [
  { label: "React", color: "#61DAFB", bg: "rgba(97,218,251,0.08)" },
  { label: "Vite", color: "#646CFF", bg: "rgba(100,108,255,0.08)" },
  { label: "Express", color: "#68D391", bg: "rgba(104,211,145,0.08)" },
  { label: "Gemini AI", color: "#A78BFA", bg: "rgba(167,139,250,0.08)" },
  { label: "Tailwind CSS", color: "#38BDF8", bg: "rgba(56,189,248,0.08)" },
  { label: "MongoDB", color: "#4DB33D", bg: "rgba(77,179,61,0.08)" },
];

const VALUES = [
  { icon: Zap, title: "Speed First", desc: "We believe great tools should feel instant. WebCraft AI generates full websites in seconds, not minutes.", color: "#F59E0B" },
  { icon: Shield, title: "Quality Code", desc: "Every generated page follows modern HTML5 standards — semantic, accessible, and ready for production.", color: "#8B5CF6" },
  { icon: Globe, title: "Open to All", desc: "From solo developers to startup teams, WebCraft AI is designed to empower everyone to build on the web.", color: "#06B6D4" },
];

const MILESTONES = [
  { year: "2024", title: "Project Started", desc: "WebCraft AI began as an experiment in using LLMs to generate full web pages from natural language." },
  { year: "2025", title: "Gemini Integration", desc: "Integrated Google Gemini API for dramatically improved code quality and design sophistication." },
  { year: "2025", title: "Multi-page App", desc: "Evolved from a single-page tool to a full-featured builder with routing, state management, and preview." },
  { year: "2026", title: "WebCraft AI 2.0", desc: "Complete redesign with a premium SaaS UI, Framer Motion animations, and an advanced options sidebar." },
];

export default function About() {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflowX: "hidden" }}>

      {/* ─── HERO ─────────────────────────── */}
      <section style={{ position: "relative", padding: "100px 24px 80px", textAlign: "center", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "500px",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ marginBottom: "28px" }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "72px", height: "72px", borderRadius: "20px", margin: "0 auto 24px",
              background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
              boxShadow: "0 0 40px rgba(139,92,246,0.4)",
            }}>
              <Rocket size={32} color="white" />
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            style={{ fontSize: "13px", fontWeight: "600", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: "16px" }}
          >
            About WebCraft AI
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: "800", letterSpacing: "-2px", color: "#fff", marginBottom: "20px", lineHeight: 1.1 }}
          >
            Building the Future of<br />
            <span className="gradient-text">Web Creation</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ fontSize: "18px", color: "#94A3B8", lineHeight: 1.7, maxWidth: "580px", margin: "0 auto" }}
          >
            WebCraft AI empowers everyone to build stunning, production-ready websites simply by describing what they want — no design skills required.
          </motion.p>
        </div>
      </section>

      {/* ─── MISSION ─────────────────────── */}
      <section style={{ padding: "80px 24px", background: "rgba(15,23,42,0.4)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Section>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {/* Mission card */}
              <motion.div variants={fadeUp} style={{
                padding: "40px", borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.04))",
                border: "1px solid rgba(139,92,246,0.2)",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "16px" }}>🎯</div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", marginBottom: "14px" }}>Our Mission</h3>
                <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.75 }}>
                  We believe that creating a beautiful web presence shouldn't require weeks of learning or expensive agencies. Our mission is to democratize web design by putting the power of AI in everyone's hands.
                </p>
              </motion.div>
              {/* Vision card */}
              <motion.div variants={fadeUp} style={{
                padding: "40px", borderRadius: "20px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "16px" }}>🔭</div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", marginBottom: "14px" }}>Our Vision</h3>
                <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.75 }}>
                  A world where anyone with an idea can build and ship a professional web presence in minutes — not months. We're making that future a reality, one prompt at a time.
                </p>
              </motion.div>
            </div>
          </Section>
        </div>
      </section>

      {/* ─── CORE VALUES ─────────────────── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Section>
            <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: "60px" }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "14px" }}>Values</p>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: "700", color: "#fff", letterSpacing: "-1px" }}>
                What drives us
              </h2>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
                <motion.div key={title} variants={fadeUp} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  style={{
                    padding: "32px", borderRadius: "16px",
                    background: "#111827",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: `${color}18`, border: `1px solid ${color}35`,
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px",
                  }}>
                    <Icon size={22} color={color} />
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#fff", marginBottom: "10px" }}>{title}</h3>
                  <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.7 }}>{desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>



      {/* ─── TECH STACK ──────────────────── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Section>
            <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: "52px" }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "14px" }}>Stack</p>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: "700", color: "#fff", letterSpacing: "-1px" }}>
                Built with modern tech
              </h2>
            </motion.div>

            <motion.div variants={fadeUp} style={{
              display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px",
            }}>
              {TECH_STACK.map(({ label, color, bg }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 20px", borderRadius: "999px",
                  background: bg, border: `1px solid ${color}30`,
                  fontSize: "14px", fontWeight: "600", color: color,
                }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
                  {label}
                </div>
              ))}
            </motion.div>
          </Section>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────── */}
      <section style={{ padding: "80px 24px 100px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <Section>
            <motion.div variants={fadeUp} style={{
              textAlign: "center", padding: "64px 40px", borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.06))",
              border: "1px solid rgba(139,92,246,0.2)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
                width: "400px", height: "300px",
                background: "radial-gradient(ellipse, rgba(139,92,246,0.12), transparent 70%)",
                pointerEvents: "none",
              }} />
              <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: "800", color: "#fff", letterSpacing: "-1px", marginBottom: "16px" }}>
                Ready to start building?
              </h2>
              <p style={{ fontSize: "16px", color: "#94A3B8", marginBottom: "36px", lineHeight: 1.6 }}>
                Describe your idea and let WebCraft AI turn it into a stunning website.
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/describe" style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "14px 28px", borderRadius: "12px",
                  fontSize: "15px", fontWeight: "600", color: "#fff", textDecoration: "none",
                  background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
                  boxShadow: "0 0 30px rgba(139,92,246,0.35)",
                }}>
                  Start Building <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </Section>
        </div>
      </section>
    </div>
  );
}
