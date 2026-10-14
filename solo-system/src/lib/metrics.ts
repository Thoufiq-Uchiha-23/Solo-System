import { prisma } from "@/lib/prisma"

export async function getWeeklyMetrics(userId: string) {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Fetch completed quests this week
  const questsThisWeek = await prisma.quest.findMany({
    where: {
      goal: { userId },
      status: 'COMPLETED',
      completedAt: { gte: sevenDaysAgo },
    },
    select: { xpReward: true, completedAt: true },
  })

  // Fetch completed goals this week
  const goalsThisWeek = await prisma.goal.count({
    where: {
      userId,
      status: 'COMPLETED',
      createdAt: { gte: sevenDaysAgo },
    },
  })

  // Daily XP breakdown
  const dailyXp = Array(7)
    .fill(null)
    .map((_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayXp = questsThisWeek
        .filter(
          (q) =>
            q.completedAt &&
            q.completedAt >= date &&
            q.completedAt < nextDate
        )
        .reduce((sum, q) => sum + q.xpReward, 0)

      return { day: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'][i], xp: dayXp }
    })

  // Streak calculation
  const streak = calculateStreak(questsThisWeek)

  return {
    questsCompleted: questsThisWeek.length,
    goalsCompleted: goalsThisWeek,
    totalXpThisWeek: questsThisWeek.reduce((sum, q) => sum + q.xpReward, 0),
    dailyXp,
    streak,
  }
}

function calculateStreak(quests: Array<{ completedAt: Date | null }>) {
  if (quests.length === 0) return 0

  const dates = quests
    .filter((q) => q.completedAt)
    .map((q) => {
      const d = new Date(q.completedAt!)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
    .sort((a, b) => b - a)

  let streak = 0
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (let i = 0; i < 365; i++) {
    if (dates.includes(currentDate.getTime())) {
      streak++
    } else if (streak > 0) {
      break
    }
    currentDate.setDate(currentDate.getDate() - 1)
  }

  return streak
}