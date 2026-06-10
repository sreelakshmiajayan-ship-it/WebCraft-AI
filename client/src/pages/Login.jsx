import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  TriangleAlert,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, {
    stiffness: 40,
    damping: 20,
  });

  const springY = useSpring(mouseY, {
    stiffness: 40,
    damping: 20,
  });

  const blob1X = useTransform(springX, [0, 1], ["-10%", "10%"]);
  const blob1Y = useTransform(springY, [0, 1], ["-10%", "10%"]);

  const blob2X = useTransform(springX, [0, 1], ["10%", "-10%"]);
  const blob2Y = useTransform(springY, [0, 1], ["10%", "-10%"]);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } =
      currentTarget.getBoundingClientRect();

    mouseX.set((clientX - left) / width);
    mouseY.set((clientY - top) / height);
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex-1 min-h-[calc(100vh-72px)] flex bg-[var(--bg-primary)] text-[var(--text-primary)]"
      onMouseMove={handleMouseMove}
    >
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--bg-secondary)] border-r border-[var(--border)] flex-col justify-between p-12">

        {/* Animated Background */}
        <motion.div
          style={{
            x: blob1X,
            y: blob1Y,
          }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/10 blur-[100px]"
        />

        <motion.div
          style={{
            x: blob2X,
            y: blob2Y,
          }}
          className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[90px]"
        />

        {/* Top Content */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-[var(--text-primary)]"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity"
          >


            <span className="text-xl font-bold tracking-tight">
              WebCraft
              <span className="text-purple-400"> AI</span>
            </span>
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
            Welcome back to <br />
            <span className="text-gradient">
              the future of web design.
            </span>
          </h1>

          <p className="text-lg text-[var(--text-secondary)] max-w-md mb-8 leading-relaxed">
            Sign in to access your dashboard, generate stunning websites in
            seconds, and manage your projects.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
              <span>AI-powered component generation</span>
            </div>

            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
              <span>Unlimited website exports</span>
            </div>

            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
              <span>Smart responsive layouts</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-md w-full space-y-8 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl"
        >


          <div className="text-left mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">
              Sign In
            </h2>

            <p className="text-[var(--text-secondary)]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors inline-flex items-center gap-1"
              >
                Create one now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div
                className="flex items-start gap-3 rounded-xl border border-[var(--error-border)] bg-[var(--error-bg)] px-4 py-3 text-sm text-[var(--error-text)] font-medium animate-fade-in"
              >
                <TriangleAlert className="w-5 h-5 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                >
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
                    placeholder="you@example.com"
                    className="input-field pl-12"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                >
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
                    placeholder="••••••••"
                    className="input-field pl-12"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="checkbox-custom" />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        </motion.div>
      </div>
    </div>
  );
}
