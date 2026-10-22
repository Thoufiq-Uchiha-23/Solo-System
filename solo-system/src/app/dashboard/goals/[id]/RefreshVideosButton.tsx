"use client";

import { useState, useTransition } from "react";
import { refreshVideos } from "./actions";

export default function RefreshVideosButton({ goalId }: { goalId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function refresh() {
    setError("");
    startTransition(async () => {
      try {
        const res = await refreshVideos(goalId);
        if (res.error) setError(res.error);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="text-right">
      <button
        onClick={refresh}
        disabled={pending}
        className="text-sm text-slate-300 hover:text-white border border-slate-700 rounded-full px-4 py-2 disabled:opacity-50"
      >
        {pending ? "Refreshing..." : "↻ Refresh videos"}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}