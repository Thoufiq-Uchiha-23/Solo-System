import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getRank, xpProgressInCurrentLevel } from "@/lib/leveling";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ChevronLeft, LogOut } from "lucide-react";
import { ProfileEditClient } from "@/components/ProfileEditClient";
import { getWeeklyMetrics } from "@/lib/metrics";
import { CircularProgress } from "@/components/CircularProgress";
import Image from "next/image";
import { ProfileMetrics } from "@/components/ProfileMetrics";

async function updateProfile(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const image = formData.get("image") as string;
  const banner = formData.get("banner") as string;
  const socialLinksJson = formData.get("socialLinks") as string;

  let socialLinks = [];
  try {
    socialLinks = JSON.parse(socialLinksJson || "[]");
  } catch {
    socialLinks = [];
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name || undefined,
      image: image || undefined,
      banner: banner || undefined,
      socialLinks: socialLinks.length > 0 ? socialLinks : null,
    },
  });

  revalidatePath("/dashboard/profile");
}

async function handleLogout() {
  "use server";
  redirect("/api/auth/signout");
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return <p>User not found</p>;

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const metrics = await getWeeklyMetrics(session.user.id);
  const completedGoals = goals.filter((g) => g.status === "COMPLETED").length;
  const inProgressGoals = goals.filter((g) => g.status !== "COMPLETED").length;

  const rank = getRank(user.level);
  const { current, needed } = xpProgressInCurrentLevel(user.totalXp);
  const progressPercent = (current / needed) * 100;

  return (
    <div
      className="h-auto text-white bg-[#020c1f]"
      // style={{
      //   backgroundImage: user.banner ? `url('${user.banner}')` : undefined,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundAttachment: "fixed",
      // }}
    >
      {/* Black Overlay */}
      <div className="inset-0 bg-black/60"></div>
      <div className="mx-auto px-20 pb-8 pt-[100px]">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 font-aeo text-slate-400 hover:text-amber-400 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Banner & Profile Hero Section */}
        <div className="mb-8 rounded-xl overflow-hidden">
          {/* Banner */}
          <div className="relative h-[200px] overflow-hidden">
            {user.banner ? (
              <img
                src={user.banner}
                alt="banner"
                className="w-full h-full object-cover object-center filter brightness-100 contrast-110 saturate-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#2355c1]/20 to-[#042469]/20"></div>
            )}
          </div>

          {/* Profile Info Overlapping Banner */}
          <div className="bg-[#010f2d] px-6 pb-6 pt-0">
            <div className="flex items-end gap-6 py-2">
              {/* Profile Image */}
              <div className="relative">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-[150] h-[150] rounded-lg object-cover "
                  />
                ) : (
                  <div className="w-28 h-28 rounded-lg bg-gradient-to-br from-[#2355c1] to-[#042469] flex items-center justify-center text-5xl font-bold border-4 border-slate-900">
                    {(user.name || "H").charAt(0)}
                  </div>
                )}
              </div>

              {/* Name & Email */}
              <div className="flex-1 pb-2">
                <h1 className="text-5xl font-semibold font-sato uppercase mb-1">
                  {user.name || "Hunter"}
                </h1>
                <p className="text-slate-400 text-sm font-aeo">{user.email}</p>
              </div>

              {/* Level & Rank Badge */}
              <div className="text-right pb-2">
                
                {/* Edit Profile Button */}
                <div className="mb-8">
                  <ProfileEditClient
                    user={user}
                    updateProfileAction={updateProfile}
                  />
                </div>
                <div className="text-6xl bg-gradient-to-r from-[#2355c1] to-[#042469] bg-clip-text text-transparent font-vega font-semibold uppercase tracking-widest font-vega">
                  Level {user.level}
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-2 font-aeo text-white mb-6">
              <div className="flex justify-between text-xs">
                <span>XP Progress</span>
                <span>
                  {current} / {needed}
                </span>
              </div>
              <div className="w-full bg-black/20 border-[0.3px] border-solid border-[#010f2d] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#2355c1] to-[#042469] h-full transition-all rounded-2xl"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 ">
              <div className="bg-blue-700/5 rounded-lg p-3 text-center">
                <div className="text-[#2355c1] text-4xl font-vega mb-1">
                  Rank
                </div>
                <div className="text-4xl font-semibold  font-aeo">{rank}</div>
              </div>
              <div className="bg-blue-700/5 rounded-lg p-3 text-center">
                <div className="text-[#2355c1] text-4xl font-vega mb-1">
                  Total XP
                </div>
                <div className="text-4xl font-semibold font-aeo">
                  {user.totalXp.toLocaleString()}
                </div>
              </div>
              <div className="bg-blue-700/5 rounded-lg p-3 text-center">
                <div className="text-[#2355c1] text-4xl font-vega mb-1">
                  Goals Done
                </div>
                <div className="text-4xl font-semibold font-aeo">
                  {completedGoals}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProfileMetrics
          totalXpThisWeek={metrics.totalXpThisWeek}
          goalsCompleted={metrics.goalsCompleted}
          streak={metrics.streak}
          questsCompleted={metrics.questsCompleted}
          dailyXp={metrics.dailyXp}
        />

        {/* Additional Stats */}
        <div className="bg-[#010f2d] rounded-lg p-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[#2355c1] text-4xl font-vega mb-1">
                In Progress
              </div>
              <div className="text-2xl font-bold font-aeo">
                {inProgressGoals}
              </div>
            </div>
            <div>
              <div className="text-[#2355c1] text-4xl font-vega mb-1">
                Member Since
              </div>
              <div className="text-2xl font-aeo">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        {/* <form action={handleLogout} className="mb-12">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-red-600/20 border border-red-600/50 hover:bg-red-600/30 text-red-400 font-semibold py-3 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </form> */}

        {/* Social Links Section */}
        {user.socialLinks && user.socialLinks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold font-vega mb-4">Social Links</h2>
            <div className="space-y-2">
              {(
                user.socialLinks as Array<{ platform: string; url: string }>
              ).map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-amber-500/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-aeo text-white">{link.platform}</span>
                    <span className="text-slate-400 text-sm">→</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1 break-all">
                    {link.url}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Completed Goals Section */}
        {goals.some((g) => g.status === "COMPLETED") && (
          <div>
            <h2 className="text-2xl font-bold font-vega mb-4">
              Completed Goals
            </h2>
            <div className="space-y-3">
              {goals
                .filter((g) => g.status === "COMPLETED")
                .map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white line-through opacity-75">
                          {goal.title}
                        </h3>
                        {goal.description && (
                          <p className="text-sm text-slate-400 mt-1">
                            {goal.description}
                          </p>
                        )}
                      </div>
                      <span className="inline-block px-3 py-1 bg-green-600/20 border border-green-600/50 text-green-400 text-xs rounded-full font-medium font-aeo">
                        ✓ Complete
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
