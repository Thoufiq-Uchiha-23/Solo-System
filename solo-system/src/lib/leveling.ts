// src/lib/leveling.ts
import { prisma } from '@/lib/prisma'

// XP needed per level — flat 100 for now, easy to make it scale later (e.g. level * 100)
const XP_PER_LEVEL = 100

export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1
}

export function xpForNextLevel(level: number): number {
  return level * XP_PER_LEVEL
}

export function xpProgressInCurrentLevel(totalXp: number): { current: number; needed: number } {
  const current = totalXp % XP_PER_LEVEL
  return { current, needed: XP_PER_LEVEL }
}

export function getRank(level: number): string {
  if (level >= 41) return 'S'
  if (level >= 31) return 'A'
  if (level >= 21) return 'B'
  if (level >= 11) return 'C'
  if (level >= 6) return 'D'
  return 'E'
}

export async function awardXp(userId: string, amount: number) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { totalXp: { increment: amount } },
  })

  const newLevel = calculateLevel(user.totalXp)
  if (newLevel !== user.level) {
    await prisma.user.update({
      where: { id: userId },
      data: { level: newLevel },
    })
  }
}