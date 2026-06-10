import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Project from "./models/Project.js";
import { generateWithFallback } from "./services/aiRouter.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

// ── Configuration ───────────────────────────────────────────────────────────
const PORT      = process.env.PORT      || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ai-site-builder";

// Warn early if no AI provider keys are present at all
if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
  console.warn("⚠️  Neither GEMINI_API_KEY nor OPENAI_API_KEY is set.");
  console.warn("    Only the local Ollama provider will be attempted.");
}

// ── Initialise Express ──────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// ── Register Routes ─────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// ── POST /api/generate ──────────────────────────────────────────────────────
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "A valid prompt string is required.",
      });
    }

    // Delegate to the AI Router (Gemini → OpenAI → Ollama)
    const result = await generateWithFallback(prompt.trim());

    // All providers failed
    if (!result.success) {
      return res.status(503).json({
        success: false,
        message: result.message,
      });
    }

    // Persist to MongoDB (best-effort — never blocks the response)
    let projectId = null;
    try {
      if (mongoose.connection.readyState === 1) {
        const project = await Project.create({
          prompt:        prompt.trim(),
          generatedHtml: result.website,
        });
        projectId = project._id;
        console.log(`🗄️   Saved project ${projectId} (provider: ${result.provider})`);
      } else {
        console.warn("⚠️  MongoDB not connected — skipping persistence.");
      }
    } catch (dbErr) {
      console.warn(`⚠️  Failed to save project to MongoDB: ${dbErr.message}`);
    }

    return res.status(200).json({
      success:   true,
      projectId,
      provider:  result.provider,
      website:   result.website,
    });
  } catch (err) {
    console.error("❌  Unhandled error in /api/generate:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({
    status:      "ok",
    uptime:      process.uptime(),
    providers:   ["Gemini", "OpenAI", "Ollama"],
    geminiReady: Boolean(process.env.GEMINI_API_KEY),
    openaiReady: Boolean(process.env.OPENAI_API_KEY),
    ollamaModel: process.env.OLLAMA_MODEL || "llama3.1",
  })
);

// ── Connect to MongoDB & start server ────────────────────────────────────────
async function boot() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🗄️   MongoDB connected");
  } catch (err) {
    console.error("❌  MongoDB connection failed:", err.message);
    console.log("ℹ️   Continuing without MongoDB persistence…");
  }

  app.listen(PORT, () =>
    console.log(`🚀  Server running → http://localhost:${PORT}`)
  );
}

boot();
