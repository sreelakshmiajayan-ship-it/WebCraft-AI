/**
 * services/gemini.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Gemini AI provider service.
 * Wraps @google/genai with structured error codes so aiRouter.js can decide
 * whether to fall back to the next provider.
 *
 * Exported error codes (on the thrown Error):
 *   "RATE_LIMIT"   — HTTP 429 / quota exceeded
 *   "UNAVAILABLE"  — HTTP 503 / service unavailable
 *   "NETWORK"      — fetch/network failure
 *   "TIMEOUT"      — request timed out
 *   "INVALID"      — bad / empty model output (not retriable, skip fallback)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { GoogleGenAI } from "@google/genai";

// ── Shared system instruction (was previously inlined in index.js) ──────────
export const SYSTEM_INSTRUCTION = `You are an expert front-end web developer. Your ONLY job is to generate complete, valid, production-ready HTML pages.

STRICT RULES — you MUST follow every one:
1. Return ONLY raw HTML code. Start with <!DOCTYPE html> and end with </html>.
2. NEVER wrap output in markdown code fences (\`\`\`html … \`\`\`) or any other formatting.
3. NEVER include explanations, commentary, or any text outside the HTML tags.
4. Every page must be fully responsive using inline CSS or Tailwind CSS via the CDN: <script src="https://cdn.tailwindcss.com"></script>.
5. Include all styles inline or inside a <style> block within <head>. Do NOT reference external CSS files.
6. You may add interactivity using vanilla JavaScript inside <script> tags at the bottom of <body>.
7. Use modern, premium, visually stunning design — rich color palettes, smooth gradients, micro-animations, elegant typography via Google Fonts, and generous whitespace.
8. The page must render perfectly as a standalone file — no missing dependencies.
9. Include a proper <meta charset="UTF-8">, <meta name="viewport" …>, and a meaningful <title>.
10. Use semantic HTML5 elements (header, nav, main, section, footer) where appropriate.
11. If using icons (e.g. FontAwesome), ONLY use the free stylesheet CSS CDN link: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">. NEVER use kit.fontawesome.com scripts because they cause CORS blocking errors inside sandboxed environments.
12. Never use href="#" for links (<a> tags) or buttons. Use href="javascript:void(0)" or target="_blank" instead. Using href="#" causes sandboxed iframe navigation issues.`;

// ── Timeout helper ──────────────────────────────────────────────────────────
const TIMEOUT_MS = 60_000; // 60 s

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => {
        const err = new Error("Gemini request timed out");
        err.code = "TIMEOUT";
        reject(err);
      }, ms)
    ),
  ]);
}

// ── Classify SDK / HTTP errors into structured codes ────────────────────────
function classifyError(err) {
  const msg = (err?.message || "").toLowerCase();
  const status = err?.status ?? err?.httpStatus ?? err?.statusCode ?? null;

  if (status === 429 || msg.includes("quota") || msg.includes("rate limit") || msg.includes("resource_exhausted")) {
    return "RATE_LIMIT";
  }
  if (status === 503 || msg.includes("service unavailable") || msg.includes("unavailable")) {
    return "UNAVAILABLE";
  }
  if (
    msg.includes("network") ||
    msg.includes("econnrefused") ||
    msg.includes("fetch failed") ||
    msg.includes("enotfound") ||
    msg.includes("etimedout") ||
    err?.code === "ECONNREFUSED"
  ) {
    return "NETWORK";
  }
  if (err?.code === "TIMEOUT") return "TIMEOUT";
  // Anything else (bad prompt, model error, etc.) — not worth falling back for
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
 * @returns {Promise<{ html: string, provider: "Gemini" }>}
 * @throws {Error & { code: string }} structured error
 */
export async function generateWithGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error("GEMINI_API_KEY is not set — skipping Gemini");
    err.code = "UNAVAILABLE";
    throw err;
  }

  const ai = new GoogleGenAI({ apiKey });

  // Primary model
  const callPrimary = () =>
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt.trim(),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 65_536,
      },
    });

  // Fallback model (same key, cheaper model)
  const callFallback = () =>
    ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt.trim(),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

  let response;
  try {
    response = await withTimeout(callPrimary(), TIMEOUT_MS);
  } catch (primaryErr) {
    const code = primaryErr.code ?? classifyError(primaryErr);
    // Only try the fallback model for retriable errors
    if (["RATE_LIMIT", "UNAVAILABLE", "NETWORK", "TIMEOUT"].includes(code)) {
      console.warn(`  ⚠️  gemini-2.5-flash failed (${code}). Trying gemini-2.0-flash…`);
      try {
        response = await withTimeout(callFallback(), TIMEOUT_MS);
      } catch (fallbackErr) {
        const fallbackCode = fallbackErr.code ?? classifyError(fallbackErr);
        const structured = new Error(`Gemini fallback model also failed: ${fallbackErr.message}`);
        structured.code = fallbackCode;
        throw structured;
      }
    } else {
      const structured = new Error(`Gemini primary model failed: ${primaryErr.message}`);
      structured.code = code;
      throw structured;
    }
  }

  let html = stripFences(response.text?.trim() ?? "");

  if (!html || !html.includes("<")) {
    const err = new Error("Gemini returned an empty or invalid response");
    err.code = "INVALID";
    throw err;
  }

  return { html, provider: "Gemini" };
}
