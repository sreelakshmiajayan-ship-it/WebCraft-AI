/**
 * services/ollama.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Ollama local AI provider service (fallback #2 — last resort).
 * Uses native fetch against the Ollama REST API — no extra npm package needed.
 *
 * Requires Ollama to be installed and running: https://ollama.com
 *   ollama pull llama3.1   (or whichever model is set in OLLAMA_MODEL)
 *   ollama serve
 *
 * Set OLLAMA_MODEL in .env to change the model (default: llama3.1).
 * Set OLLAMA_BASE_URL in .env to change the base URL (default: http://localhost:11434).
 *
 * Exported error codes (on the thrown Error):
 *   "UNAVAILABLE"  — Ollama is not running / unreachable
 *   "TIMEOUT"      — request timed out
 *   "INVALID"      — empty or non-HTML response
 *   "UNKNOWN"      — anything else
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { SYSTEM_INSTRUCTION } from "./gemini.js";

const TIMEOUT_MS = 120_000; // Ollama local models can be slow — 2 min ceiling

// ── Timeout helper using AbortController ────────────────────────────────────
function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

// ── Strip accidental markdown fences from model output ──────────────────────
function stripFences(text = "") {
  return text
    .replace(/^```(?:html)?\s*\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim();
}

// ── Main export ─────────────────────────────────────────────────────────────
/**
 * @param {string} prompt
 * @returns {Promise<{ html: string, provider: "Ollama" }>}
 * @throws {Error & { code: string }} structured error
 */
export async function generateWithOllama(prompt) {
  const model = process.env.OLLAMA_MODEL || "llama3.1";
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const endpoint = `${baseUrl}/api/generate`;

  const body = JSON.stringify({
    model,
    prompt: `${SYSTEM_INSTRUCTION}\n\nUser Request:\n${prompt.trim()}`,
    stream: false,
    options: {
      temperature: 0.7,
      num_predict: 32_768,
    },
  });

  let res;
  try {
    res = await fetchWithTimeout(
      endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      },
      TIMEOUT_MS
    );
  } catch (err) {
    if (err.name === "AbortError") {
      const timeoutErr = new Error(`Ollama request timed out after ${TIMEOUT_MS / 1000}s`);
      timeoutErr.code = "TIMEOUT";
      throw timeoutErr;
    }

    const unavailErr = new Error(
      `Ollama is not reachable at ${baseUrl}. Is it running? (ollama serve)`
    );
    unavailErr.code = "UNAVAILABLE";
    throw unavailErr;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // 404 = model not pulled yet; 503 = service unavailable — both are retriable
    const code = [404, 503].includes(res.status) ? "UNAVAILABLE" : "NETWORK";
    const err = new Error(`Ollama returned HTTP ${res.status}: ${text}`);
    err.code = code;
    throw err;
  }

  let json;
  try {
    json = await res.json();
  } catch {
    const err = new Error("Ollama returned non-JSON response");
    err.code = "INVALID";
    throw err;
  }

  let html = stripFences(json.response?.trim() ?? "");

  if (!html || !html.includes("<")) {
    const err = new Error("Ollama returned an empty or invalid HTML response");
    err.code = "INVALID";
    throw err;
  }

  return { html, provider: "Ollama" };
}
