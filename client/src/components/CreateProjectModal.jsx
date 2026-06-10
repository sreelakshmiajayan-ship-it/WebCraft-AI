import { useState } from "react";
import { X, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateProjectModal({ isOpen, onClose }) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteType, setWebsiteType] = useState("Landing Page");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !description.trim()) {
      setError("Project Name and Description are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      // 1. Generate the site
      const genRes = await fetch("http://localhost:5000/api/projects/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: `Create a ${websiteType} named "${projectName}". Description: ${description}`
        })
      });
      const genData = await genRes.json();
      
      if (!genRes.ok || !genData.success) {
        throw new Error(genData.message || "Generation failed.");
      }

      // 2. Save the project
      const { html, css, js } = genData.data;
      const saveRes = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          projectName,
          description,
          websiteType,
          html,
          css,
          js
        })
      });
      
      const saveData = await saveRes.json();
      if (!saveRes.ok || !saveData.success) {
        throw new Error(saveData.message || "Failed to save project.");
      }

      // 3. Redirect to editor
      onClose();
      navigate(`/projects/${saveData.project._id}`);
      
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[var(--accent)] opacity-[0.03] blur-[100px] pointer-events-none"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--accent)]" />
          Create New Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Project Name *</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
              placeholder="e.g. My Portfolio"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Website Category *</label>
            <select
              value={websiteType}
              onChange={(e) => setWebsiteType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all cursor-pointer"
              disabled={loading}
            >
              <option value="Portfolio">Portfolio</option>
              <option value="Business">Business</option>
              <option value="Landing Page">Landing Page</option>
              <option value="Blog">Blog</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="SaaS">SaaS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Project Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all resize-none"
              placeholder="Describe the styling, sections, and features of your website..."
              disabled={loading}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="relative px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] cursor-pointer overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Building AI...
                </>
              ) : (
                "Build Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
