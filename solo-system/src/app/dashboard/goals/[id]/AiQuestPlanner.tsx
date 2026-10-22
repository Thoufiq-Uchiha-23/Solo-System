"use client";

import { useState, useTransition } from "react";
import { generateQuestDraft, saveQuestDraft, type DraftQuest } from "./actions";

export default function AiQuestPlanner({ goalId }: { goalId: string }) {
  const [draft, setDraft] = useState<DraftQuest[] | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function generate() {
    setError("");
    startTransition(async () => {
      try {
        const res = await generateQuestDraft(goalId);
        if (res.error || !res.quests)
          setError(res.error ?? "Something went wrong");
        else setDraft(res.quests);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  function save() {
    if (!draft) return;
    startTransition(async () => {
      const res = await saveQuestDraft(goalId, draft);
      if (res.error) setError(res.error);
      else setDraft(null);
    });
  }

  const update = (i: number, patch: Partial<DraftQuest>) =>
    setDraft(
      (d) => d && d.map((q, idx) => (idx === i ? { ...q, ...patch } : q)),
    );

  const remove = (i: number) =>
    setDraft((d) => d && d.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) =>
    setDraft((d) => {
      if (!d || i + dir < 0 || i + dir >= d.length) return d;
      const copy = [...d];
      [copy[i], copy[i + dir]] = [copy[i + dir], copy[i]];
      return copy;
    });

  const add = () =>
    setDraft((d) => d && [...d, { title: "", difficulty: "easy" }]);

  if (!draft) {
    return (
      <div className="mb-8 font-aeo">
        <button
          onClick={generate}
          disabled={pending}
          className="bg-gradient-to-r from-[#2355c1] to-[#042469] text-white font-semibold px-4 py-2 rounded-l-3xl rounded-tr-3xl rounded-br-lg disabled:opacity-50"
        >
          {pending ? "Generating..." : "✨ Generate quests with AI"}
        </button>

        {pending && (
          <div className="space-y-3 mt-4">
            <p className="text-slate-500 text-sm">
              Planning your quests, this can take a few seconds...
            </p>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-800 rounded-lg h-24 animate-pulse"
              />
            ))}
          </div>
        )}

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-lg p-4 mb-8 font-aeo">
      <p className="text-slate-400 text-sm mb-4">
        Edit anything you want, then save. Nothing is added until you press
        Save.
      </p>

      <div className="space-y-3">
        {draft.map((q, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-3 space-y-2">
            <input
              value={q.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="Quest title"
              className="w-full bg-slate-700 rounded-xl px-3 py-2 text-white"
            />
            <textarea
              value={q.description ?? ""}
              onChange={(e) => update(i, { description: e.target.value })}
              placeholder="Description (optional)"
              rows={2}
              className="w-full bg-slate-700 rounded-xl px-3 py-2 text-white text-sm"
            />
            <div className="flex items-center gap-2 text-sm">
              <select
                value={q.difficulty}
                onChange={(e) =>
                  update(i, {
                    difficulty: e.target.value as DraftQuest["difficulty"],
                  })
                }
                className="bg-slate-700 rounded-xl px-2 py-1 text-white"
              >
                <option value="easy">Easy · 10 XP</option>
                <option value="medium">Medium · 15 XP</option>
                <option value="hard">Hard · 25 XP</option>
              </select>
              <button
                onClick={() => move(i, -1)}
                className="px-2 text-slate-400"
              >
                ↑
              </button>
              <button
                onClick={() => move(i, 1)}
                className="px-2 text-slate-400"
              >
                ↓
              </button>
              <button
                onClick={() => remove(i)}
                className="ml-auto text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

      <div className="flex gap-2 mt-4">
        <button onClick={add} className="text-slate-300 px-3 py-2">
          + Add quest
        </button>
        <button
          onClick={() => setDraft(null)}
          className="text-slate-400 px-3 py-2 ml-auto"
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={pending}
          className="bg-gradient-to-r from-[#2355c1] to-[#042469] text-white font-semibold px-4 py-2 rounded-l-3xl rounded-tr-3xl rounded-br-lg disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save quests"}
        </button>
      </div>
    </div>
  );
}
