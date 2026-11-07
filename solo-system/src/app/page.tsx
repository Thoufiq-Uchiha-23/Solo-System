import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // adjust to wherever your NextAuth v5 `auth` export lives

// landing page pics
import {
  aiQuests,
  youtubePics,
  xpRank,
  stats,
  dashPic,
} from "../landing/index.js";
import { ChevronsRight, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Solo System - Turn your goals into quests",
  description:
    "Break any goal into quests, earn XP for every one you finish, and rank up from E to S. AI-generated quests and video guides included.",
};

const steps = [
  {
    title: "Set a goal",
    body: "Name what you want to achieve. Solo System also finds starter YouTube videos for it right away.",
  },
  {
    title: "Generate your quests",
    body: "AI drafts a list of quests for the goal. Edit, add or remove any of them before they are saved.",
  },
  {
    title: "Finish quests, earn XP",
    body: "Each completed quest gives XP. Finish them all and the goal completes with a bonus.",
  },
];

const showcase = [
  {
    title: "Describe the goal. Get the plan.",
    body: "Tell Solo System what you want to achieve and AI drafts the quests for you. Spend your energy doing the work, not planning it.",
    points: [
      "Review the draft and edit, add or remove quests before anything is saved",
      "Every quest carries a difficulty, and its XP follows from it",
      "If one AI provider is down, another takes over automatically",
    ],
    image: aiQuests,
    alt: "Goal page showing a list of AI-generated quests in an editable draft, each with a difficulty and XP reward",
    glow: "bg-amber-500/20",
  },
  {
    title: "Learn while you work",
    body: "Every goal comes with a shelf of videos, so you never start from a blank search bar.",
    points: [
      "Starter YouTube tutorials, tips and roadmaps are found from your goal title",
      "They are added automatically when you create the goal",
      "Saved with the goal, so they are waiting every time you come back",
    ],
    image: youtubePics,
    alt: "Goal page with a row of recommended YouTube video cards for learning the goal",
    glow: "bg-[#2355c1]/30",
  },
  {
    title: "Every quest pays out",
    body: "Finishing real work moves a real number. XP turns progress you can feel into a level and rank you can see.",
    points: [
      "Easy quests give 10 XP, medium 15 and hard 25",
      "Finish the last quest and the goal completes with bonus XP",
      "Your level and rank, from E up to S, update as you earn",
    ],
    image: xpRank,
    alt: "Profile page showing level, rank badge and XP progress toward the next level",
    glow: "bg-amber-500/20",
  },
  {
    title: "See your week at a glance",
    body: "Your profile shows how the week is really going, so you can tell when you are on a roll and when you have slipped.",
    points: [
      "XP earned this week, with a daily XP bar chart",
      "Goals completed and your current streak",
      "A progress ring for your quests",
    ],
    image: stats,
    alt: "Profile page weekly stats: XP this week, goals completed, streak, a quest progress ring and a daily XP bar chart",
    glow: "bg-[#2355c1]/30",
  },
];

const extras = [
  {
    title: "Always know what is next",
    body: "The next quest in line is marked “Up Next”, so you never wonder where to start. It is a nudge, not a lock, so you can still tackle quests in any order.",
  },
  {
    title: "A profile worth showing",
    body: "Set a banner and profile picture, add your social links, and keep a list of every goal you have completed.",
  },
];

const ranks = [
  { letter: "E" },
  { letter: "D" },
  { letter: "C" },
  { letter: "B" },
  { letter: "A" },
  { letter: "S" },
];

const faqs = [
  {
    q: "Is Solo System free?",
    a: "Yes. You can create an account and use every feature at no cost.",
  },
  {
    q: "How does AI quest generation work?",
    a: "You give a goal, and the AI drafts quests for it. Nothing is saved until you have reviewed the list, and you can edit, add or delete quests first.",
  },
  {
    q: "Do I have to finish quests in order?",
    a: "No. The next quest in line is marked “Up Next” as a suggestion, but you can complete them in any order.",
  },
  {
    q: "How do XP, levels and ranks work?",
    a: "Each quest awards 10, 15 or 25 XP for easy, medium or hard. Your total XP sets your level, and your level sets your rank from E up to S.",
  },
  {
    q: "Where do the video recommendations come from?",
    a: "They come from YouTube, searched using your goal title. You get tutorials, tips and roadmaps without leaving the goal page.",
  },
  {
    q: "How do I sign in?",
    a: "Use your Google account, or register with an email and password.",
  },
];

function Check() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="mt-1 h-5 w-5 flex-none text-amber-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

function Frame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-blue-950/60 backdrop-blur-xl">
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1000}
        className="rounded-2xl"
      />
    </div>
  );
}

const primaryBtn =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#2355c1] to-[#042469] px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/40 ring-1 ring-white/15 transition hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";
const ghostBtn =
  "inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="relative overflow-x-hidden bg-slate-950 text-white">
      {/* background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-[#2355c1]/30 blur-3xl" />
        <div className="absolute right-[-10rem] top-[40rem] h-[30rem] w-[30rem] rounded-full bg-[#042469]/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="h-auto bg-slate-950 text-white overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative z-10 mx-auto text-center pt-[70px] md:pt-[150px] px-10 md:px-20">
          <div className="space-y-8 py-20">
            <h2 className="text-5xl md:text-7xl font-black font-vega leading-tight">
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                Level Up
              </span>
              <br />
              <span className="text-white">Your Real Life</span>
            </h2>
            <p className="text-lg md:text-xl text-white/50 font-aeo max-w-2xs md:max-w-2xl mx-auto">
              Turn your goals into quests. Earn XP, gain ranks, and master your
              life like an RPG. Every goal completed is your next level.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/register"
                className="px-8 py-4 text-xl font-medium font-aeo bg-gradient-to-r from-[#2355c1] to-[#042469] hover:from-[#376cdf] hover:to-[#0740b9] rounded-l-3xl rounded-r-3xl rounded-bl-lg transition-all transform hover:scale-105 active:scale-95 duration-300"
              >
                Start Your Journey
              </Link>

              <Link
                href="/login"
                className="px-8 py-4 text-xl font-extralight font-aeo border border-white/20 hover:border-white/40 rounded-l-3xl rounded-tr-3xl rounded-br-lg backdrop-blur-sm hover:bg-white/5 transition-all"
              >
                Already a Hunter?
              </Link>
            </div>
          </div>
        </section>
      </div>
      <div className="relative mx-auto px-6">
        {/* HERO */}
        <section className="flex-col items-center gap-12 py-20 w-full px-20">
          <div className="mx-auto max-w-3xl text-center px-10 py-20">
            <h1 className="font-vega text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Turn your goals into quests, and level up for real.
            </h1>
            <p className="font-sato mt-6 text-lg text-zinc-300 text-center">
              Solo System breaks any goal into quests you can finish, gives you
              XP for every one, and ranks you up from E to S.
            </p>
          </div>

          <div className="px-20">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-blue-950/60 backdrop-blur-xl">
              <Image
                src={dashPic}
                alt="Solo System dashboard showing goals, level and XP"
                className="rounded-2xl w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 px-20">
          <h2 className="font-vega text-4xl text-center font-bold sm:text-5xl lg:text-6xl">
            Less planning. More doing.
          </h2>
          <p className="font-sato mt-3 text-lg text-center text-slate-300">
            Four tools that take you from a vague goal to finished work, and
            reward you on the way.
          </p>

          <div className="mt-16 space-y-24">
            {showcase.map((f, i) => {
              const flip = i % 2 === 1;
              return (
                <article
                  key={f.title}
                  className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                >
                  <div className={flip ? "lg:order-2" : ""}>
                    <h3 className="font-sato text-2xl font-semibold sm:text-5xl">
                      {f.title}
                    </h3>
                    <p className="font-sato mt-4 max-w-lg text-xl text-slate-300">
                      {f.body}
                    </p>
                    <ul className="font-sato font-light mt-6 space-y-3 text-slate-200">
                      {f.points.map((p) => (
                        <li key={p} className="flex items-center gap-3">
                          <ChevronsRight className="w-4 h-4 text-blue-400" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className={`relative isolate ${flip ? "lg:order-1" : ""}`}
                  >
                    <div
                      aria-hidden
                      className={`absolute -inset-6 -z-10 rounded-full blur-3xl ${f.glow}`}
                    />
                    <Frame src={f.image} alt={f.alt} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* RANK LADDER */}
        {/* <section className="py-16 px-20">
          <h2 className="font-vega text-4xl text-center font-bold sm:text-5xl lg:text-6xl">
            Level up your Rank
          </h2>

          <p className="font-sato mt-3 text-center text-slate-300">
            Every finished quest adds XP. As your level grows, so does your
            rank.
          </p>
          <div className="mt-10 flex justify-around items-center gap-3">
            {ranks.map((r) => {
              const isTop = r.letter === "S";
              const isRank = r.letter === "A" || r.letter === "B" || r.letter === "C" || r.letter === "D" || r.letter === "E";
              return (
                <div
                  key={r.letter}
                  className={`font-solo flex flex-1 items-start justify-center rounded-xl border-[0.3px] border-blue-400/50 text- pt-4 font-light backdrop-blur-xl ${
                    isTop
                      ? " bg-gradient-to-b from-amber-400/30 to-amber-400/5 text-amber-300"
                      : " bg-gradient-to-b from-[#2355c1]/30 to-white/5 text-white"
                  }`}
                >
                  {r.letter}
                </div>
              );
            })}
          </div>
        </section> */}

        {/* FAQ */}
        <section className="py-16 px-20">
          <h2 className="font-vega text-6xl text-center font-bold">FAQ</h2>
          <div className="mt-10 px-20 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border-[.2px] border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl open:bg-white/10"
              >
                <summary className="font-sato flex cursor-pointer list-none items-center justify-between gap-4 text-xl transition-all active::scale-95 duration-300 font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="text-2xl text-blue-500 transition-transform group-open:rotate-45 duration-300"
                  >
                    <Plus />
                  </span>
                </summary>
                <p className="font-sato mt-3 text-slate-300">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 px-20">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#2355c1]/30 to-[#042469]/30 p-10 text-center backdrop-blur-xl sm:p-16">
            <h2 className="font-vega text-3xl font-bold sm:text-4xl lg:text-6xl">
              Your first quest is one goal away
            </h2>
            <p className="font-sato mx-auto mt-4 font-extralight text-2xl text-slate-300">
              Create an account, add a goal, and let Solo System draft the
              quests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/register"
                className="px-8 py-4 text-xl font-medium font-aeo bg-gradient-to-r from-[#2355c1] to-[#042469] hover:from-[#376cdf] hover:to-[#0740b9] rounded-l-3xl rounded-r-3xl rounded-bl-lg transition-all transform hover:scale-105 active:scale-95 duration-300"
              >
                Join Now
              </Link>

              <Link
                href="/login"
                className="px-8 py-4 text-xl font-extralight font-aeo border border-white/20 hover:border-white/40 rounded-l-3xl rounded-tr-3xl rounded-br-lg backdrop-blur-sm hover:bg-white/5 transition-all"
              >
                Login Here
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="font-sato flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-8 text-sm text-slate-400">
          <p>Built by Thoufiq. Inspired by Solo Leveling.</p>
          <p>Solo System &copy; 2026. Level up your real life.</p>
        </footer>
      </div>
    </main>
  );
}
