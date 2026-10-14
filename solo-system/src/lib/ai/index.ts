import { geminiProvider } from "./gemini";
import { groqProvider } from "./groq";
import type { GeneratedPlan } from "./types";

const providers = [geminiProvider, groqProvider];

export async function generatePlan(
  title: string,
  description?: string
): Promise<GeneratedPlan> {
  for (const p of providers) {
    try {
      return await p.generatePlan(title, description);
    } catch (e) {
      console.error(`[ai] ${p.name} failed:`, e);
    }
  }
  throw new Error("AI_UNAVAILABLE");
}