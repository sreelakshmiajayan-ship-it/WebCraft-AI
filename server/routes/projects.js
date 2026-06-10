import express from "express";
import { ZipArchive } from "archiver";
import Project from "../models/Project.js";
import { verifyToken } from "../middleware/auth.js";
import { generateStructuredWebFiles } from "../services/geminiStructured.js";

const router = express.Router();

// ── GET /api/projects ────────────────────────────────────────────────────────
router.get("/", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    console.error("Fetch projects error:", err);
    res.status(500).json({ success: false, message: "Error fetching projects." });
  }
});

// ── POST /api/projects ───────────────────────────────────────────────────────
router.post("/", verifyToken, async (req, res) => {
  try {
    const { projectName, description, websiteType, html, css, js } = req.body;
    
    const newProject = await Project.create({
      userId: req.user.userId,
      projectName,
      description,
      websiteType,
      html,
      css,
      js,
    });
    
    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ success: false, message: "Error creating project." });
  }
});

// ── GET /api/projects/:id ────────────────────────────────────────────────────
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found." });
    
    res.json({ success: true, project });
  } catch (err) {
    console.error("Get project error:", err);
    res.status(500).json({ success: false, message: "Error fetching project." });
  }
});

// ── PUT /api/projects/:id ────────────────────────────────────────────────────
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { html, css, js, projectName, description } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { html, css, js, projectName, description },
      { new: true }
    );
    
    if (!project) return res.status(404).json({ success: false, message: "Project not found." });
    
    res.json({ success: true, project });
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ success: false, message: "Error updating project." });
  }
});

// ── DELETE /api/projects/:id ─────────────────────────────────────────────────
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found." });
    
    res.json({ success: true, message: "Project deleted." });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ success: false, message: "Error deleting project." });
  }
});

// ── POST /api/projects/generate ──────────────────────────────────────────────
router.post("/generate", verifyToken, async (req, res) => {
  try {
    const { prompt, existingCode } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required." });
    
    const structuredCode = await generateStructuredWebFiles(prompt, existingCode);
    res.json({ success: true, data: structuredCode });
  } catch (err) {
    console.error("Generate code error:", err);
    res.status(500).json({ success: false, message: err.message || "Generation failed." });
  }
});

// ── POST /api/projects/export ────────────────────────────────────────────────
router.post("/export", verifyToken, async (req, res) => {
  try {
    const { html, css, js } = req.body;
    
    res.attachment("website.zip");
    const archive = new ZipArchive({ zlib: { level: 9 } });
    
    archive.on("error", (err) => { throw err; });
    
    archive.pipe(res);
    
    if (html) archive.append(html, { name: "index.html" });
    if (css) archive.append(css, { name: "style.css" });
    if (js) archive.append(js, { name: "script.js" });
    
    await archive.finalize();
  } catch (err) {
    console.error("Export project error:", err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Error exporting project." });
    }
  }
});

export default router;
