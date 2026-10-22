import { GeneratedPlanSchema, type AIProvider } from "./types";
import { buildPrompt } from "./prompt";

export const groqProvider: AIProvider = {
  name: "groq",
  async generatePlan(goalTitle, goalDescription) {
    const key = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL;
    if (!key || !model) throw new Error("GROQ env missing");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: buildPrompt(goalTitle, goalDescription) }],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) throw new Error(`groq ${res.status}`);

    const data = await res.json();
    return GeneratedPlanSchema.parse(JSON.parse(data.choices[0].message.content));
  },
};