/**
 * services/aiRouter.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central AI orchestrator — tries each provider in PROVIDER_PIPELINE order.
 * Falls back automatically on retriable errors; short-circuits on fatal ones.
 *
 * To change provider priority, simply reorder the PROVIDER_PIPELINE array.
 *
 * Success response:
 *   { success: true,  provider: "Gemini"|"OpenAI"|"Ollama", website: "<html>…</html>" }
 *
 * All-fail response:
 *   { success: false, message: "All AI providers unavailable" }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { generateWithGemini }  from "./gemini.js";
import { generateWithOpenAI }  from "./openai.js";
import { generateWithOllama }  from "./ollama.js";

// ── Retriable error codes — router moves to the next provider ───────────────
const RETRIABLE_CODES = new Set(["RATE_LIMIT", "UNAVAILABLE", "NETWORK", "TIMEOUT"]);

// ── Provider pipeline — change order here to alter priority ─────────────────
const PROVIDER_PIPELINE = [
  { name: "Gemini",  fn: generateWithGemini  },
  { name: "OpenAI",  fn: generateWithOpenAI  },
  { name: "Ollama",  fn: generateWithOllama  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatDuration(ms) {
  return (ms / 1000).toFixed(2) + " s";
}

function logDivider() {
  console.log("─".repeat(60));
}

// ── Main export ──────────────────────────────────────────────────────────────
/**
 * Tries each provider in order and returns the first successful result.
 *
 * @param {string} prompt  — the assembled user prompt
 * @returns {Promise<{
 *   success: boolean,
 *   provider?: string,
 *   website?: string,
 *   message?: string
 * }>}
 */
export async function generateWithFallback(prompt) {
  const routerStart = Date.now();
  logDivider();
  console.log(`🤖  AI Router — starting generation pipeline`);
  console.log(`📝  Prompt preview: "${prompt.slice(0, 80)}${prompt.length > 80 ? "…" : ""}"`);
  logDivider();

  const errors = [];

  for (const { name, fn } of PROVIDER_PIPELINE) {
    const providerStart = Date.now();
    console.log(`\n🟢  Trying provider: ${name}`);

    try {
      const result = await fn(prompt);
      const elapsed = Date.now() - providerStart;
      const totalElapsed = Date.now() - routerStart;

      console.log(`✅  ${name} succeeded in ${formatDuration(elapsed)}`);
      console.log(`⏱️   Total pipeline time: ${formatDuration(totalElapsed)}`);
      logDivider();

      return {
        success:  true,
        provider: result.provider,
        website:  result.html,
      };
    } catch (err) {
      const elapsed = Date.now() - providerStart;
      const code    = err?.code ?? "UNKNOWN";
      const retriable = RETRIABLE_CODES.has(code);

      console.warn(
        `⚠️   ${name} failed after ${formatDuration(elapsed)} — code: ${code} — ${err.message}`
      );

      errors.push({ provider: name, code, message: err.message });

      if (!retriable) {
        // Non-retriable (e.g., INVALID output) — log and break immediately.
        // There is no point trying other providers if the prompt itself is bad.
        console.error(`❌  Non-retriable error from ${name}. Stopping pipeline.`);
        break;
      }

      // Determine next provider for the log message
      const currentIndex = PROVIDER_PIPELINE.findIndex((p) => p.name === name);
      const next = PROVIDER_PIPELINE[currentIndex + 1];
      if (next) {
        console.log(`🔄  Falling back to: ${next.name}`);
      }
    }
  }

  // ── All providers failed ──────────────────────────────────────────────────
  const totalElapsed = Date.now() - routerStart;
  console.error(`\n❌  All providers exhausted after ${formatDuration(totalElapsed)}`);
  console.error("    Provider failure summary:");
  errors.forEach(({ provider, code, message }) =>
    console.error(`      • ${provider}: [${code}] ${message}`)
  );
  logDivider();

  return {
    success: false,
    message: "All AI providers unavailable. Please try again later.",
  };
}
