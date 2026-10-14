"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  return (
    <div className="h-auto bg-slate-950 text-white overflow-x-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-6 py-4 border-b border-white/5 backdrop-blur-sm">
        <h1 className="text-2xl font-bold font-solo bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Solo System
        </h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-2 text-sm font-aeo text-zinc-300 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 text-sm font-aeo bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg font-semibold transition-all"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-6xl md:text-7xl font-black font-solo leading-tight">
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                Level Up
              </span>
              <br />
              <span className="text-white">Your Real Life</span>
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-aeo max-w-2xl mx-auto">
              Turn your goals into quests. Earn XP, gain ranks, and master your life like an RPG. 
              Every goal completed is your next level.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/register"
              className="px-8 py-4 text-lg font-semibold font-aeo bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg transition-all transform hover:scale-105 active:scale-95"
            >
              Start Your Journey
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 text-lg font-semibold font-aeo border border-white/20 hover:border-white/40 rounded-lg backdrop-blur-sm hover:bg-white/5 transition-all"
            >
              Already a Hunter?
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
        <div className="space-y-12">
          {/* Feature 1: XP & Leveling */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold font-solo text-white">Gain XP, Rise Through Ranks</h3>
              <p className="text-zinc-300 font-aeo leading-relaxed">
                Complete real-life goals and earn XP. Progress from E-rank to S-rank as you master your objectives. 
                Your level reflects your actual growth and commitment.
              </p>
            </div>
            <div className="backdrop-blur-md bg-blue-950/20 border border-blue-500/30 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-aeo text-zinc-300">Level 15</span>
                <span className="font-aeo text-amber-400">E-Rank Hunter</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full w-2/3"></div>
              </div>
              <p className="text-xs font-aeo text-zinc-400">2,450 / 3,200 XP</p>
            </div>
          </div>

          {/* Feature 2: Quest System */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:order-2">
            <div className="backdrop-blur-md bg-amber-950/20 border border-amber-500/30 rounded-xl p-6 space-y-3 md:order-2">
              <p className="font-aeo font-semibold text-amber-300">Daily Quest</p>
              <div className="space-y-2">
                <p className="text-sm text-white">Run 5km</p>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-400"></div>
                  <span className="text-xs text-zinc-400 font-aeo">4/5 km complete</span>
                </div>
              </div>
              <p className="text-xs font-aeo text-amber-300">+200 XP reward</p>
            </div>
            <div className="space-y-4 md:order-1">
              <h3 className="text-3xl font-bold font-solo text-white">Transform Goals into Quests</h3>
              <p className="text-zinc-300 font-aeo leading-relaxed">
                Break down your ambitions into actionable quests. Track progress in real-time and watch your 
                momentum build. Each quest cleared pushes you closer to mastery.
              </p>
            </div>
          </div>

          {/* Feature 3: Progression */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold font-solo text-white">Permanent Progress</h3>
              <p className="text-zinc-300 font-aeo leading-relaxed">
                Your achievements compound over time. Lifetime levels, rank progression, and cumulative stats 
                create a real sense of evolution and accomplishment.
              </p>
            </div>
            <div className="backdrop-blur-md bg-slate-800/50 border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-aeo text-white">Total XP Earned</span>
                <span className="font-solo text-2xl text-blue-400">24,850</span>
              </div>
              <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-aeo text-zinc-400 text-xs">Goals Completed</p>
                  <p className="font-solo text-2xl text-white">42</p>
                </div>
                <div>
                  <p className="font-aeo text-zinc-400 text-xs">Current Rank</p>
                  <p className="font-solo text-2xl text-amber-400">D-Rank</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
        <h3 className="text-4xl font-bold font-solo text-center mb-16">Your Ascension Begins</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="backdrop-blur-md bg-blue-950/10 border border-blue-500/20 rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-solo text-lg font-bold">
              1
            </div>
            <h4 className="text-xl font-bold font-aeo text-white">Create Your Goal</h4>
            <p className="text-zinc-400 font-aeo leading-relaxed">
              Define what you want to achieve. Set the scope, difficulty, and watch it transform into your first quest.
            </p>
          </div>

          <div className="backdrop-blur-md bg-blue-950/10 border border-blue-500/20 rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-solo text-lg font-bold">
              2
            </div>
            <h4 className="text-xl font-bold font-aeo text-white">Complete Quests</h4>
            <p className="text-zinc-400 font-aeo leading-relaxed">
              Take action and mark progress. Each milestone gets you closer to goal completion and rank advancement.
            </p>
          </div>

          <div className="backdrop-blur-md bg-blue-950/10 border border-blue-500/20 rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-solo text-lg font-bold">
              3
            </div>
            <h4 className="text-xl font-bold font-aeo text-white">Level & Evolve</h4>
            <p className="text-zinc-400 font-aeo leading-relaxed">
              Earn XP, unlock new ranks, and watch your stats grow. Your progress is permanent and always visible.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 max-w-3xl mx-auto text-center">
        <div className="backdrop-blur-md bg-gradient-to-r from-blue-950/30 to-slate-900/30 border border-blue-500/30 rounded-2xl p-12 space-y-8">
          <div className="space-y-4">
            <h3 className="text-4xl font-bold font-solo text-white">Ready to Begin?</h3>
            <p className="text-lg text-zinc-300 font-aeo">
              Every legend starts as an E-rank hunter. Start your ascension today.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-block px-10 py-4 text-lg font-semibold font-aeo bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg transition-all transform hover:scale-105 active:scale-95"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/5 backdrop-blur-sm text-center text-zinc-500 font-aeo text-sm">
        <p>Solo System © 2024. Level up your real life.</p>
      </footer>
    </div>
  )
}