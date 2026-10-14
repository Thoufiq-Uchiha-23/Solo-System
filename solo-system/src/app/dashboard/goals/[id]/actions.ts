"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generatePlan } from "@/lib/ai";
import { searchVideos } from "@/lib/youtube";

type Difficulty = "easy" | "medium" | "hard";
export type DraftQuest = {
  title: string;
  description?: string;
  difficulty: Difficulty;
};

const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 10,
  medium: 15,
  hard: 25,
};

export async function generateQuestDraft(
  goalId: string,
): Promise<{ error?: string; quests?: DraftQuest[] }> {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    select: { title: true, description: true },
  });
  if (!goal) return { error: "Goal not found" };

  try {
    const plan = await generatePlan(goal.title, goal.description ?? undefined);

    const videos = await searchVideos(plan.youtubeQueries);
    if (videos.length > 0) {
      await prisma.goal.update({
        where: { id: goalId },
        data: { resources: videos },
      });
      revalidatePath(`/dashboard/goals/${goalId}`);
    }

    return { quests: plan.quests };
  } catch {
    return {
      error:
        "AI is busy right now. Try again in a minute, or add quests manually.",
    };
  }
}

export async function saveQuestDraft(
  goalId: string,
  drafts: DraftQuest[],
): Promise<{ error?: string }> {
  const clean = drafts.filter((d) => d.title.trim()).slice(0, 12);
  if (clean.length === 0) return { error: "Add at least one quest" };

  const count = await prisma.quest.count({ where: { goalId } });

  await prisma.$transaction(
    clean.map((d, i) =>
      prisma.quest.create({
        data: {
          goalId,
          title: d.title.trim().slice(0, 80),
          description: d.description?.trim().slice(0, 200) || null,
          order: count + i + 1,
          xpReward: XP_BY_DIFFICULTY[d.difficulty] ?? 10,
        },
      }),
    ),
  );

  revalidatePath(`/dashboard/goals/${goalId}`);
  return {};
}
