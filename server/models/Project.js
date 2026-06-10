import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // Old fields (kept for backwards compatibility with /api/generate)
    prompt: {
      type: String,
      trim: true,
      maxlength: [5000, "Prompt cannot exceed 5 000 characters"],
    },
    generatedHtml: {
      type: String,
    },
    
    // New fields for Project Management
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    projectName: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    websiteType: {
      type: String,
    },
    html: {
      type: String,
    },
    css: {
      type: String,
    },
    js: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
