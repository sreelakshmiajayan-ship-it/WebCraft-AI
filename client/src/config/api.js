/**
 * Centralized API configuration.
 *
 * In development (npm run dev):
 *   VITE_API_URL is not set → falls back to http://localhost:5000
 *
 * In production (Vercel):
 *   VITE_API_URL is set as an Environment Variable in the Vercel dashboard
 *   → e.g. https://webcraft-ai-98c2.onrender.com
 *
 * NEVER put GEMINI_API_KEY, MONGO_URI, or JWT_SECRET here.
 * Those live only in server/.env and are never exposed to the frontend.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/** Convenience helper — build a full API path */
export const apiUrl = (path) => `${API_BASE_URL}${path}`;
