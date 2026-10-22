import { GeneratedPlanSchema, type AIProvider } from "./types";
import { buildPrompt } from "./prompt";

export const geminiProvider: AIProvider = {
  name: "gemini",
  async generatePlan(goalTitle, goalDescription) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY missing");
    const model = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(goalTitle, goalDescription) }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );
    if (!res.ok) throw new Error(`gemini ${res.status}`);

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return GeneratedPlanSchema.parse(JSON.parse(text));
  },
};