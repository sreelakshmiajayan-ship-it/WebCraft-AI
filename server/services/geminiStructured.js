/**
 * services/geminiStructured.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Gemini AI provider service for structured output.
 * Returns { html, css, js } in JSON format.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { GoogleGenAI } from "@google/genai";

export const STRUCTURED_SYSTEM_INSTRUCTION = `You are an expert web developer.
Your ONLY job is to generate complete, valid, production-ready web code in strict JSON format.

The JSON MUST have exactly these three string keys:
{
  "html": "<!DOCTYPE html><html>...</html>",
  "css": "/* CSS styles here */",
  "js": "/* JavaScript logic here */"
}

STRICT RULES:
1. The HTML should NOT include the <style> or <script> tags for the generated CSS and JS; assume they will be injected later.
2. The HTML MUST include a standard boilerplate (<!DOCTYPE html>, <html>, <head>, <body>).
3. Include Tailwind CSS CDN in the HTML head: <script src="https://cdn.tailwindcss.com"></script>.
4. Do NOT use external CSS (except Tailwind and Google Fonts) and do not use CDN links for icons that might fail in a sandbox (use inline SVGs or standard safe CDNs).
5. Provide a beautiful, premium, responsive design.
6. Return raw JSON without markdown formatting (no \`\`\`json ... \`\`\`).
`;

const TIMEOUT_MS = 60_000;

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

function stripFences(text = "") {
  return text
    .replace(/^```(?:json)?\s*\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim();
}

/**
 * @param {string} prompt
 * @param {string} existingCode Optional existing code for editing
 * @returns {Promise<{ html: string, css: string, js: string }>}
 */
export async function generateStructuredWebFiles(prompt, existingCode = null) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let finalPrompt = prompt;
  if (existingCode) {
    finalPrompt = `You are editing an existing project.
Current Code:
${existingCode}

User Request:
${prompt}

Apply the requested changes to the current code and return the updated structured JSON format.`;
  }

  const callPrimary = () =>
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt.trim(),
      config: {
        systemInstruction: STRUCTURED_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 65536,
        responseMimeType: "application/json",
      },
    });

  let response;
  try {
    response = await withTimeout(callPrimary(), TIMEOUT_MS);
  } catch (err) {
    throw new Error(`Gemini structured generation failed: ${err.message}`);
  }

  const textOutput = stripFences(response.text?.trim() ?? "{}");

  try {
    const parsed = JSON.parse(textOutput);
    return {
      html: parsed.html || "<h1>Error generating HTML</h1>",
      css: parsed.css || "",
      js: parsed.js || "",
    };
  } catch (e) {
    throw new Error("Gemini did not return valid JSON.");
  }
}
