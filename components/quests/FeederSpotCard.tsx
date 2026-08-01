"use client";

import { useState } from "react";
import { Droplets, CheckCircle2, Loader2 } from "lucide-react";

type FeederStatus = "FULL" | "LOW" | "EMPTY" | "NEEDS_ATTENTION";

export type FeederSpotData = {
  id: string;
  name: string;
  block: string | null;
  status: FeederStatus;
};

const STATUS_META: Record<FeederStatus, { label: string; color: string }> = {
  FULL: { label: "Penuh", color: "bg-emerald-600" },
  LOW: { label: "Sikit Lagi", color: "bg-amber-600" },
  EMPTY: { label: "Kosong", color: "bg-red-600" },
  NEEDS_ATTENTION: { label: "Perlu Perhatian", color: "bg-red-700" },
};

export default function FeederSpotCard({ spot }: { spot: FeederSpotData }) {
  const [status, setStatus] = useState<FeederStatus>(spot.status);
  const [loading, setLoading] = useState(false);

  async function handleRefill() {
    setLoading(true);
    try {
      const res = await fetch(`/api/feeder-spots/${spot.id}/refill`, { method: "POST" });
      if (res.ok) setStatus("FULL");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const meta = STATUS_META[status];

  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-white text-sm">{spot.name}</h3>
        <span className={`text-[10px] text-white px-2 py-0.5 rounded-full ${meta.color}`}>
          {meta.label}
        </span>
      </div>
      {spot.block && <p className="text-xs text-slate-400">📍 {spot.block}</p>}
      <button
        onClick={handleRefill}
        disabled={loading || status === "FULL"}
        className="w-full flex items-center justify-center gap-2 bg-sky-600 disabled:bg-slate-600 text-white text-xs font-bold py-2 rounded-lg"
      >
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {status === "FULL" ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : (
          <Droplets className="w-3.5 h-3.5" />
        )}
        {status === "FULL" ? "Baru Diisi" : "Saya Dah Isi"}
      </button>
    </div>
  );
}
