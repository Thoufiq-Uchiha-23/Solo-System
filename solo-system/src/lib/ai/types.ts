import { z } from "zod";

export const QuestDraftSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().max(200).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const GeneratedPlanSchema = z.object({
  quests: z.array(QuestDraftSchema).min(3).max(8),
  youtubeQueries: z.array(z.string().min(1).max(80)).max(2),
});

export type GeneratedPlan = z.infer<typeof GeneratedPlanSchema>;

export interface AIProvider {
  name: string;
  generatePlan(goalTitle: string, goalDescription?: string): Promise<GeneratedPlan>;
}