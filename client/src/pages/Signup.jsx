import { useState, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, ArrowRight, Loader2, TriangleAlert, Rocket, CheckCircle2 } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, user } = useAuth();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const blob1X = useTransform(springX, [0, 1], ["-10%", "10%"]);
  const blob1Y = useTransform(springY, [0, 1], ["-10%", "10%"]);
  const blob2X = useTransform(springX, [0, 1], ["10%", "-10%"]);
  const blob2Y = useTransform(springY, [0, 1], ["10%", "-10%"]);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set((clientX - left) / width);
    mouseY.set((clientY - top) / height);
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await signup(name, email, password);
      // Navigation is handled in AuthContext
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex-1 min-h-[calc(100vh-68px)] flex bg-[var(--bg-primary)]">
      {/* Left Panel - Branding & Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--bg-secondary)] border-r border-[var(--border)] flex-col justify-between p-12">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/10 blur-[120px]"></div>
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[100px]"></div>
        </div>

        {/* Top Content */}

        <motion.div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 text-white hover:opacity-80 transition-opacity">

            <span className="text-xl font-bold tracking-tight">WebCraft<span className="text-purple-400"> AI</span></span>
          </Link>
        </motion.div>

        {/* Middle Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 my-auto pt-12"
        >
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-6">
            Start building <br />
            <span className="text-gradient">
              at the speed of thought.
            </span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-md mb-8">
            Create an account to save your generated websites, manage your components, and customize your workspace.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
              <span>Full source code access</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
              <span>Beautiful React components</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
              <span>Secure cloud storage</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#020617]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-md w-full space-y-8 glass-panel p-8 sm:p-10 rounded-3xl"
        >

          <div className="text-left mb-10">
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
              Create an account
            </h2>
            <p className="text-[var(--text-muted)]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors inline-flex items-center gap-1">
                Sign in instead <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-fade-in">
                <TriangleAlert className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="name">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-12"
                    placeholder="Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="email">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
