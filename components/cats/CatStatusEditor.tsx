"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { STATUS_LABELS, type CatStatus } from "@/lib/gamification";
import { playClick, playSuccess, playError } from "@/lib/sound";

const STATUS_OPTIONS: CatStatus[] = ["OWNED", "STRAY_GUARDIAN", "TNR", "EMERGENCY"];

export default function CatStatusEditor({
  catId,
  initialStatus,
}: {
  catId: string;
  initialStatus: CatStatus;
}) {
  const [status, setStatus] = useState<CatStatus>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleChange(next: CatStatus) {
    if (next === status) return;
    playClick();
    setSaving(true);
    setSaved(false);
    setNewBadge(null);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/cats/${catId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal kemaskini");

      setStatus(next);
      setSaved(true);
      playSuccess();
      if (data.newBadge) setNewBadge(data.newBadge.name);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal kemaskini status.");
      playError();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-amber-400/20 rounded-xl p-4 space-y-2">
      <p className="text-xs font-display uppercase tracking-wide text-amber-400">
        Status Kucing
      </p>
      <div className="grid grid-cols-2 gap-2">
        {STATUS_OPTIONS.map((opt) => {
          const meta = STATUS_LABELS[opt];
          const active = status === opt;
          return (
            <button
              key={opt}
              onClick={() => handleChange(opt)}
              disabled={saving}
              className={`text-xs font-bold px-3 py-2 rounded-lg text-white transition-opacity ${meta.badgeClass} ${
                active ? "ring-2 ring-amber-300" : "opacity-50 hover:opacity-80"
              }`}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      {saving && (
        <p className="flex items-center gap-1.5 text-xs text-slate-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengemaskini...
        </p>
      )}
      {saved && !saving && (
        <p className="flex items-center gap-1.5 text-xs text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Status dikemaskini.
        </p>
      )}
      {newBadge && (
        <p className="text-xs text-amber-300 font-display">
          🏅 Lencana baru diperoleh: {newBadge}!
        </p>
      )}
      {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
    </div>
  );
}
