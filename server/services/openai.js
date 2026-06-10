/**
 * services/openai.js
 * ─────────────────────────────────────────────────────────────────────────────
 * OpenAI provider service (fallback #1 after Gemini).
 * Uses the official "openai" npm package with GPT-4o as primary model.
 *
 * Skips itself gracefully (throws UNAVAILABLE) when OPENAI_API_KEY is missing
 * so the router continues to Ollama without crashing.
 *
 * Exported error codes (on the thrown Error):
 *   "RATE_LIMIT"   — HTTP 429
 *   "UNAVAILABLE"  — HTTP 503 / key missing
 *   "NETWORK"      — fetch/network failure
 *   "TIMEOUT"      — request timed out
 *   "UNKNOWN"      — anything else
 * ─────────────────────────────────────────────────────────────────────────────
 */

import OpenAI from "openai";
import { SYSTEM_INSTRUCTION } from "./gemini.js";

const TIMEOUT_MS = 60_000;

// ── Timeout helper ──────────────────────────────────────────────────────────
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => {
        const err = new Error("OpenAI request timed out");
        err.code = "TIMEOUT";
        reject(err);
      }, ms)
    ),
  ]);
}

// ── Classify OpenAI SDK errors ───────────────────────────────────────────────
function classifyError(err) {
  const msg = (err?.message || "").toLowerCase();
  const status = err?.status ?? err?.statusCode ?? null;
  // OpenAI SDK sets err.code = "insufficient_quota" for depleted accounts
  const sdkCode = (err?.code || "").toLowerCase();

  if (
    status === 429 ||
    sdkCode === "insufficient_quota" ||
    msg.includes("rate limit") ||
    msg.includes("quota")
  ) {
    return "RATE_LIMIT";
  }
  if (
    status === 503 ||
    msg.includes("service unavailable") ||
    msg.includes("unavailable") ||
    msg.includes("overloaded")
  ) {
    return "UNAVAILABLE";
  }
  if (
    msg.includes("network") ||
    msg.includes("econnrefused") ||
    msg.includes("fetch failed") ||
    msg.includes("enotfound") ||
    err?.code === "ECONNREFUSED"
  ) {
    return "NETWORK";
  }
  if (err?.code === "TIMEOUT") return "TIMEOUT";
  return "UNKNOWN";
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
 * @returns {Promise<{ html: string, provider: "OpenAI" }>}
 * @throws {Error & { code: string }} structured error
 */
export async function generateWithOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    const err = new Error("OPENAI_API_KEY is not set — skipping OpenAI");
    err.code = "UNAVAILABLE";
    throw err;
  }

  const client = new OpenAI({ apiKey });

  const callModel = () =>
    client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: prompt.trim() },
      ],
      temperature: 0.7,
      max_tokens: 16_384,
    });

  let completion;
  try {
    completion = await withTimeout(callModel(), TIMEOUT_MS);
  } catch (err) {
    // Always run classifyError so SDK-specific codes (e.g. insufficient_quota)
    // are correctly mapped to RATE_LIMIT before the router sees them.
    const code = classifyError(err);
    const structured = new Error(`OpenAI generation failed: ${err.message}`);
    structured.code = code;
    throw structured;
  }

  let html = stripFences(
    completion.choices?.[0]?.message?.content?.trim() ?? ""
  );

  if (!html || !html.includes("<")) {
    const err = new Error("OpenAI returned an empty or invalid response");
    err.code = "INVALID";
    throw err;
  }

  return { html, provider: "OpenAI" };
}
