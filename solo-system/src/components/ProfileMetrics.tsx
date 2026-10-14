'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { CircularProgress } from './CircularProgress'

interface ProfileMetricsProps {
  totalXpThisWeek: number
  goalsCompleted: number
  streak: number
  questsCompleted: number
  dailyXp: Array<{ day: string; xp: number }>
}

export function ProfileMetrics({
  totalXpThisWeek,
  goalsCompleted,
  streak,
  questsCompleted,
  dailyXp,
}: ProfileMetricsProps) {
  return (
    <>
      {/* Weekly Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#010f2d] rounded-xl p-6 backdrop-blur-xl">
          <div className="text-[#2355c1] text-3xl font-vega uppercase tracking-wider mb-4">XP This Week</div>
          <div className="text-4xl font-semibold font-aeo">{totalXpThisWeek}</div>
          <div className="text-xs text-slate-500 mt-2">+{Math.round(totalXpThisWeek / 7)}/day avg</div>
        </div>

        <div className="bg-[#010f2d] rounded-xl p-6 backdrop-blur-xl">
          <div className="text-[#2355c1] text-3xl font-vega uppercase tracking-wider mb-4">Goals Completed</div>
          <div className="text-4xl font-semibold font-aeo">{goalsCompleted}</div>
          <div className="text-xs text-slate-500 mt-2">This week</div>
        </div>

        <div className="bg-[#010f2d] rounded-xl p-6 backdrop-blur-xl">
          <div className="text-[#2355c1] text-3xl font-vega uppercase tracking-wider mb-4">Streak</div>
          <div className="text-4xl font-semibold font-aeo">{streak}</div>
          <div className="text-xs text-slate-500 mt-2">Day{streak !== 1 ? 's' : ''}</div>
        </div>

        <div className="bg-[#010f2d] rounded-xl p-6 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="text-[#2355c1] text-3xl font-vega uppercase tracking-wider mb-4">Quests</div>
          <CircularProgress current={questsCompleted} total={Math.max(questsCompleted + 3, 5)} label="Quests" />
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-[#010f2d] rounded-xl p-6 mb-8 backdrop-blur-xl">
        <h3 className="text-[#2355c1] text-3xl font-vega mb-4">XP by Day</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dailyXp}>
            <XAxis dataKey="day" stroke="rgb(148, 163, 184)" />
            <YAxis stroke="rgb(148, 163, 184)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(15, 23, 42)',
                border: '1px solid rgb(51, 65, 85)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'white' }}
            />
            <Bar dataKey="xp" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2355c1" />
                <stop offset="100%" stopColor="#042469" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}