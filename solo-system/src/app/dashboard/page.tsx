// src/app/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getRank, xpProgressInCurrentLevel } from "@/lib/leveling";
import { auth } from "@/lib/auth";
import { DashboardClient } from "@/components/DashboardClient";
import { searchVideos } from "@/lib/youtube";

async function createGoal(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  if (!title) return;

  const goal = await prisma.goal.create({
    data: { title, description, userId: session.user.id },
  });

  // Fetch starter videos using the goal title. If YouTube fails or the
  // quota is used up, searchVideos returns [] and the goal still exists.
  const videos = await searchVideos([title, `${title} tutorial`]);
  if (videos.length > 0) {
    await prisma.goal.update({
      where: { id: goal.id },
      data: { resources: videos },
    });
  }

  revalidatePath("/dashboard");
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!user) return <p>User not found</p>;

  const rank = getRank(user.level);
  const { current, needed } = xpProgressInCurrentLevel(user.totalXp);
  const progressPercent = (current / needed) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8 mt-[100px]">
        {/* Header */}
        <div className="">
          <h1 className="text-4xl font-bold tracking-tight mb-1 font-vega">
            Level up your goals
          </h1>
          {/* <p className="text-slate-400">Level up your goals</p> */}
        </div>

        {/* Level Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4 font-vega text-white">
            <div>
              <div className="text-sm font-medium uppercase tracking-wider">
                Level
              </div>
              <div className="text-5xl font-bold bg-gradient-to-r from-[#2355c1] to-[#042469] bg-clip-text text-transparent">
                {user.level}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium uppercase tracking-wider">
                Rank
              </div>
              <div className="text-5xl font-bold bg-gradient-to-r from-[#2355c1] to-[#042469] bg-clip-text text-transparent">
                {rank}
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2 font-aeo text-white">
            <div className="flex justify-between text-xs">
              <span>XP Progress</span>
              <span>
                {current} / {needed}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#2355c1] to-[#042469] hover:from-[#376cdf] hover:to-[#0740b9] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Create Goal Form */}
        <DashboardClient createGoalAction={createGoal} />

        {/* Goals Section */}
        <div className="mt-12">
          <h2 className="text-4xl font-bold font-vega mb-4">Your Goals</h2>

          {goals.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
              <p className="text-slate-400">
                No goals yet — create one above to begin your journey.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => (
                <Link key={goal.id} href={`/dashboard/goals/${goal.id}`}>
                  <div className="bg-slate-900 border-slate-700 rounded-lg p-4 transition-all hover:bg-[#030c21] cursor-pointer group">
                    <div className="flex items-start justify-between font-sato">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-[#2355c1] transition-colors">
                          {goal.title}
                        </h3>
                        {goal.description && (
                          <p className="text-sm text-slate-400 mt-1">
                            {goal.description}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <span className="inline-block px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full font-medium font-sato">
                          {goal.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
