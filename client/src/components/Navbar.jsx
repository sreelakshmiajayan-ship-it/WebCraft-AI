import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/describe", label: "Builder" },
  { path: "/preview", label: "Preview" },
  { path: "/about", label: "About" },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: "72px",
          display: "flex",
          alignItems: "center",
          transition: "all 0.3s ease",
          background: scrolled
            ? "rgba(3,7,18,0.85)"
            : "rgba(3,7,18,0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
          >
            <img
              src="/logo.png"
              alt="WebCraft AI"
              style={{
                height: "44px",
                width: "auto",
                objectFit: "contain",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#fff",
                letterSpacing: "-0.5px",
              }}
            >
              WebCraft<span style={{ color: "#A78BFA" }}> AI</span>
            </span>
          </Link>

          {/* Center Nav — desktop */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            className="hidden md:flex"
          >
            {navLinks.map(({ path, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  style={{
                    position: "relative",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: isActive ? "#fff" : "#94A3B8",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    background: isActive ? "rgba(139,92,246,0.12)" : "transparent",
                  }}
                >
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{
                        position: "absolute",
                        bottom: "2px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "16px",
                        height: "2px",
                        borderRadius: "999px",
                        background: "linear-gradient(90deg, #8B5CF6, #6366F1)",
                      }}
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA — desktop */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {user ? (
              <Link
                to="/dashboard"
                className="hidden md:flex items-center gap-2"
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#fff",
                  textDecoration: "none",
                  background: "rgba(139,92,246,0.12)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  transition: "all 0.2s",
                }}
              >
                <User size={16} />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex"
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#fff",
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.2s",
                }}
              >
                Sign In
              </Link>
            )}

            <Link
              to="/describe"
              className="hidden md:flex"
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#fff",
                textDecoration: "none",
                background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
                boxShadow: "0 0 20px rgba(139,92,246,0.3)",
                transition: "all 0.2s",
              }}
            >
              Start Building
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex md:hidden"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "8px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: "72px",
              left: 0,
              right: 0,
              zIndex: 99,
              background: "rgba(3,7,18,0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              padding: "16px 24px 24px",
            }}
          >
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={{
                  display: "block",
                  padding: "14px 0",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: location.pathname === path ? "#A78BFA" : "#94A3B8",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {label}
              </Link>
            ))}
            {user ? (
              <Link
                to="/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "16px",
                  padding: "14px 0",
                  textAlign: "center",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#fff",
                  textDecoration: "none",
                  background: "rgba(139,92,246,0.12)",
                  border: "1px solid rgba(139,92,246,0.3)",
                }}
              >
                <User size={18} />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                style={{
                  display: "block",
                  marginTop: "16px",
                  padding: "14px 0",
                  textAlign: "center",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#fff",
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Sign In
              </Link>
            )}

            <Link
              to="/describe"
              style={{
                display: "block",
                marginTop: "12px",
                padding: "14px 0",
                textAlign: "center",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "600",
                color: "#fff",
                textDecoration: "none",
                background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
              }}
            >
              Start Building
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
