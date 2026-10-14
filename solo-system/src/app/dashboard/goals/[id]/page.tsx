// src/app/dashboard/goals/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { awardXp } from "@/lib/leveling";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import AiQuestPlanner from "./AiQuestPlanner";
import type { VideoResource } from "@/lib/youtube";

async function addQuest(goalId: string, formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  if (!title) return;

  const questCount = await prisma.quest.count({ where: { goalId } });

  await prisma.quest.create({
    data: {
      title,
      goalId,
      order: questCount + 1,
      xpReward: 10,
    },
  });

  revalidatePath(`/dashboard/goals/${goalId}`);
}

async function completeQuest(questId: string, goalId: string) {
  "use server";

  const quest = await prisma.quest.update({
    where: { id: questId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    select: { userId: true },
  });

  if (goal) {
    await awardXp(goal.userId, quest.xpReward);
  }

  const remainingQuests = await prisma.quest.count({
    where: { goalId, status: { not: "COMPLETED" } },
  });

  if (remainingQuests === 0 && goal) {
    await prisma.goal.update({
      where: { id: goalId },
      data: { status: "COMPLETED" },
    });
    await awardXp(goal.userId, 50);
  }

  revalidatePath(`/dashboard/goals/${goalId}`);
}

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const goal = await prisma.goal.findUnique({
    where: { id },
    include: { quests: { orderBy: { order: "asc" } } },
  });

  if (!goal) notFound();

  const addQuestWithGoal = addQuest.bind(null, goal.id);
  const completedCount = goal.quests.filter(
    (q) => q.status === "COMPLETED",
  ).length;
  const videos = (goal.resources as VideoResource[] | null) ?? [];
  const totalQuests = goal.quests.length;

  return (
    <div className="h-auto bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Goal Header */}
        <div className="mb-8 font-aeo">
          <h1 className="text-4xl font-bold capitalize mb-2">{goal.title}</h1>
          {goal.description && (
            <p className="text-slate-400 text-lg">{goal.description}</p>
          )}
        </div>

        {/* Progress Bar */}
        {totalQuests > 0 && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-end mb-4 font-vega text-white">
              <div>
                <div className="text-xl uppercase tracking-wider font-medium">
                  Quest Progress
                </div>
                <div className="text-5xl font-aeo font-bold bg-gradient-to-r from-[#2355c1] to-[#042469] bg-clip-text text-transparent">
                  {completedCount} / {totalQuests}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white font-semibold font-aeo">
                  {Math.round((completedCount / totalQuests) * 100)}% Complete
                </div>
              </div>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#2355c1] to-[#042469] h-full rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalQuests) * 100}%` }}
              />
            </div>
          </div>
        )}

        {goal.status !== "COMPLETED" && <AiQuestPlanner goalId={goal.id} />}

        {/* Add Quest Form */}
        <form
          action={addQuestWithGoal}
          className="bg-slate-900 rounded-lg font-aeo p-4 mb-8"
        >
          <div className="flex gap-2">
            <input
              name="title"
              placeholder="Quest title"
              required
              className="flex-1 bg-slate-800 rounded-3xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#2355c1] focus:ring-2 focus:ring-amber-500/20 transition-colors"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#2355c1] to-[#042469] hover:from-[#376cdf] hover:to-[#0740b9] text-white font-semibold px-4 py-2 rounded-l-3xl rounded-tr-3xl rounded-br-lg transition-all"
            >
              Add Quest
            </button>
          </div>
        </form>

        {/* Quests Section */}
        <div>
          <h2 className="text-4xl font-bold mb-6 font-vega uppercase">
            Quests
          </h2>

          {goal.quests.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
              <p className="text-slate-400">
                No quests yet — add one above to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3 font-aeo">
              {goal.quests.map((quest) => {
                const isUpNext =
                  goal.quests.find((q) => q.status !== "COMPLETED")?.id ===
                  quest.id;
                const isCompleted = quest.status === "COMPLETED";

                return (
                  <div
                    key={quest.id}
                    className={`rounded-lg p-4 transition-all flex items-center justify-between ${
                      isCompleted
                        ? "bg-slate-900/50 border-slate-700 opacity-60"
                        : "bg-slate-900 border-slate-700 hover:border-amber-500/50"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        {isUpNext && (
                          <span className="py-1 px-5 border-[0.3px] border-solid border-white/30 bg-[#042469]/30 text-white/40 text-xs rounded-3xl font-extralight">
                            ▶ Up Next
                          </span>
                        )}
                        {isCompleted && (
                          <span className="py-1 px-5 bg-green-500/20 border border-green-500/50 text-white/40 text-xs rounded-3xl font-extralight">
                            ✓ Complete
                          </span>
                        )}
                      </div>
                      <h3
                        className={`font-extralight ${isCompleted ? "line-through text-slate-500" : "text-white"}`}
                      >
                        {quest.title}
                      </h3>
                      {quest.description && (
                        <p className="text-slate-500 text-sm mt-1">
                          {quest.description}
                        </p>
                      )}
                    </div>

                    {!isCompleted && (
                      <form
                        action={completeQuest.bind(null, quest.id, goal.id)}
                        className="ml-4 shrink-0"
                      >
                        <button
                          type="submit"
                          className="font-aeo font-extralight bg-gradient-to-r from-[#2355c1] to-[#042469] hover:from-[#376cdf] hover:to-[#0740b9]text-white font-semibold py-2 px-3 rounded-l-3xl rounded-tr-3xl rounded-br-lg text-sm transition-all whitespace-nowrap"
                        >
                          +{quest.xpReward} XP
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* YOUTUBE RECOMMENDATIONS VIDEOS */}
      {videos.length > 0 && (
        <div className="mt-10 font-aeo py-10 px-20">
          <h2 className="text-4xl font-bold mb-6 font-vega uppercase">
            Resources
          </h2>
          <div className="grid grid-cols-4 grid-rows-2 gap-3">
            {videos.map((v) => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-[#2355c1] transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-3">
                  <p className="text-sm text-white line-clamp-2">{v.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{v.channel}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
