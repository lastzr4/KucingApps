"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { playClick, playSuccess, playError } from "@/lib/sound";

export default function SpottingCheckinButton({ catId }: { catId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [expGained, setExpGained] = useState(0);

  async function handleClick() {
    playClick();
    setState("loading");
    try {
      const res = await fetch(`/api/cats/${catId}/checkin`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal check-in");
      setExpGained(data.user.expGained);
      setState("done");
      playSuccess();
    } catch (err) {
      console.error(err);
      setState("error");
      playError();
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={state === "loading" || state === "done"}
        className="flex items-center gap-2 bg-amber-500 disabled:bg-slate-600 text-black font-bold px-4 py-2.5 rounded-xl"
      >
        {state === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
        {state === "done" && <CheckCircle2 className="w-4 h-4" />}
        {state === "done" ? `Direkodkan! +${expGained} EXP` : "Saya Nampak Kucing Ni Hari Ni!"}
      </button>
      {state === "error" && (
        <p className="text-red-400 text-xs">Gagal rekod. Cuba lagi.</p>
      )}
    </div>
  );
}
