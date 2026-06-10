import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Layout, Calendar, Trash2, Search, ArrowUpDown, Sparkles, LogOut, ExternalLink, Plus, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

const TYPE_COLORS = {
  "SaaS": "#8B5CF6",
  "E-Commerce": "#EC4899",
  "Portfolio": "#3B82F6",
  "Blog": "#10B981",
  "Business": "#F59E0B",
  "Landing Page": "#06B6D4",
};

function ProjectCard({ project, onDelete, onClick }) {
  const typeColor = TYPE_COLORS[project.websiteType] || "#8B5CF6";
  const date = new Date(project.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="card-base group relative flex flex-col cursor-pointer"
    >
      {/* Colour accent bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${typeColor}, ${typeColor}88)` }} />

      {/* Card preview area */}
      <div className="h-36 bg-gradient-to-br from-slate-900 to-[var(--bg-tertiary)] flex items-center justify-center border-b border-[var(--border)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 30% 50%, ${typeColor}44, transparent 60%)` }} />
        <div className="flex flex-col items-center gap-2 relative z-10 select-none">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${typeColor}20`, border: `1px solid ${typeColor}40` }}>
            <Layout size={16} style={{ color: typeColor }} />
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: `${typeColor}15`, color: typeColor, border: `1px solid ${typeColor}30` }}>
            {project.websiteType || "Website"}
          </span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="text-xs font-semibold text-white bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ExternalLink size={12} /> Open Editor
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-bold text-white leading-snug line-clamp-1 flex-1" title={project.projectName || "Untitled"}>
            {project.projectName || "Untitled Project"}
          </h3>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(project._id, e); }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2 flex-1 mb-4">
          {project.description || project.prompt || "No description provided."}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Calendar size={11} />
            <span>{date}</span>
          </div>
          <span className="text-xs font-semibold text-[var(--accent)]">Edit →</span>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-1 w-full bg-slate-800" />
      <div className="h-36 bg-slate-900" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-800 rounded w-2/3" />
        <div className="h-3 bg-slate-800/60 rounded w-full" />
        <div className="h-3 bg-slate-800/40 rounded w-4/5" />
        <div className="h-3 bg-slate-800/30 rounded w-1/2 mt-4" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/api/projects"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setProjects(data.projects);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/api/projects/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const filteredProjects = projects
    .filter(p =>
      (p.projectName || p.prompt || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const diff = new Date(b.updatedAt) - new Date(a.updatedAt);
      return sortOrder === "desc" ? diff : -diff;
    });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex-1 bg-[#020617] min-h-screen">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="relative border-b border-white/5 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-black text-[var(--accent)] uppercase tracking-widest mb-2">
                {greeting()}, {user?.name?.split(" ")[0] || "Architect"}
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                Workspace
              </h1>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate("/describe")}
                className="btn-primary"
              >
                <Plus size={18} /> New Project
              </button>
    <button
  onClick={logout}
  className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
  title="Sign Out"
>
  <LogOut size={20} />
  <span>Sign Out</span>
</button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-10 border-t border-white/5">
            {[
              { label: "Total Projects", value: projects.length, icon: Folder },
              { label: "Avg. Build Time", value: "~45s", icon: Clock },
              { label: "Component Quality", value: "High", icon: Sparkles },
              { label: "Deploy Ready", value: "100%", icon: ExternalLink },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-3 text-[var(--text-muted)] mb-1">
                  <stat.icon size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-xl font-black tracking-tight">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Area ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 space-y-8">

        {/* Search & Sort toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-lg">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects by name or description…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
            className="btn-secondary py-2.5 whitespace-nowrap"
          >
            <ArrowUpDown size={14} />
            {sortOrder === "desc" ? "Newest first" : "Oldest first"}
          </button>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-full" />
              <div className="relative w-20 h-20 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl flex items-center justify-center">
                <Folder size={32} className="text-slate-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {searchQuery ? "No matching projects" : "No projects yet"}
            </h3>
            <p className="text-[var(--text-muted)] text-sm max-w-sm mb-8 leading-relaxed">
              {searchQuery
                ? `We couldn't find any projects matching "${searchQuery}". Try a different search.`
                : "Your workspace is empty. Build your first AI-powered website in seconds."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/describe")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:opacity-90 transition-all shadow-[0_0_24px_rgba(139,92,246,0.25)] cursor-pointer"
              >
                <Sparkles size={15} />
                Start Building
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-600 font-medium">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onDelete={handleDelete}
                  onClick={() => navigate(`/projects/${project._id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
