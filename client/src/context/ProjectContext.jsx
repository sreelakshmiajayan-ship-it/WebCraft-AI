import { createContext, useContext, useState, useCallback } from "react";
import { apiUrl } from "../config/api";

const ProjectContext = createContext(undefined);

export function ProjectProvider({ children }) {
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState(""); // Which AI generated the result

  // Advanced options
  const [theme, setTheme] = useState("Dark");
  const [projectType, setProjectType] = useState("SaaS Landing Page");
  const [features, setFeatures] = useState([]);

  const generateWebsite = useCallback(async (fullPromptOverride) => {
    // If a full prompt override is provided, use it (useful when assembling prompt + features)
    // Otherwise use the base prompt
    const finalPrompt = fullPromptOverride ? fullPromptOverride.trim() : prompt.trim();
    if (!finalPrompt) return false;

    setLoading(true);
    setError("");
    setHtml("");
    setProvider("");

    try {
      const res = await fetch(apiUrl("/api/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Generation failed");
      }

      // New response shape: { success, provider, website }
      setHtml(data.website || data.html || "");
      setProvider(data.provider || "");
      return true; // Success
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      return false; // Failed
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  const value = {
    prompt,
    setPrompt,
    html,
    setHtml,
    loading,
    error,
    setError,
    provider,
    theme,
    setTheme,
    projectType,
    setProjectType,
    features,
    setFeatures,
    generateWebsite
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
