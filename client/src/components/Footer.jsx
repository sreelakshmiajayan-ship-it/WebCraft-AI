import { Link } from "react-router-dom";
import {
  Mail,
  Globe,
  ExternalLink,
} from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Builder", to: "/describe" },
    { label: "Templates", to: "/describe" },
    { label: "Preview", to: "/preview" },
    { label: "Dashboard", to: "/dashboard" },
  ],

  Resources: [
    { label: "Documentation", to: "/" },
    { label: "Guides", to: "/" },
    { label: "Blog", to: "/" },
  ],

  Legal: [
    { label: "Privacy Policy", to: "/" },
    { label: "Terms of Service", to: "/" },
    { label: "Cookie Policy", to: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-black">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-3 mb-5"
            >
              <img
                src="/logo.png"
                alt="WebCraft AI"
                style={{
                  height: "40px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
              <h3 className="text-xl font-bold text-white">
                WebCraft
                <span className="text-violet-400"> AI</span>
              </h3>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm mb-6">
              Craft stunning, production-ready websites using AI prompts.
              Generate, edit, preview and export websites in minutes.
            </p>

            <div className="flex gap-3">
              {[Mail, Globe, ExternalLink].map((Icon, index) => (
                <button
                  key={index}
                  className="
                    w-10 h-10
                    rounded-xl
                    border border-slate-800
                    bg-slate-900/60
                    flex items-center justify-center
                    text-slate-400
                    hover:text-violet-400
                    hover:border-violet-500
                    hover:bg-violet-500/10
                    transition-all duration-300
                  "
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-5">
              Product
            </h4>

            <ul className="space-y-3">
              {footerLinks.Product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-5">
              Resources
            </h4>

            <ul className="space-y-3">
              {footerLinks.Resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-5">
              Legal
            </h4>

            <ul className="space-y-3">
              {footerLinks.Legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} WebCraft AI. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-slate-500 hover:text-violet-400 transition-colors"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="text-slate-500 hover:text-violet-400 transition-colors"
            >
              Terms
            </Link>

            <span className="text-slate-500">
              Powered by
              <span className="ml-1 text-violet-400 font-medium">
                Gemini AI
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}