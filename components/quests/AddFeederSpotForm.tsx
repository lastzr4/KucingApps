"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { BLOCKS } from "@/lib/zones";
import { playClick, playSuccess, playError } from "@/lib/sound";

export default function AddFeederSpotForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [block, setBlock] = useState(BLOCKS[0].label);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/feeder-spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, block }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal daftar");

      setName("");
      setOpen(false);
      playSuccess();
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal daftar Feeder Spot.");
      playError();
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-slate-800 border border-dashed border-amber-400/40 text-amber-300 text-sm font-display font-bold uppercase tracking-wide py-2.5 rounded-xl mb-3"
      >
        <Plus className="w-4 h-4" /> Tambah Feeder Spot
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-b from-slate-800 to-slate-900 border border-amber-400/30 rounded-xl p-4 space-y-2 mb-3"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama Feeder Spot (cth: Feeder Belakang Block A)"
        className="w-full rounded-lg bg-slate-800/80 border border-slate-600 px-3 py-2 text-sm outline-none focus:border-amber-400"
        required
      />
      <select
        value={block}
        onChange={(e) => setBlock(e.target.value)}
        className="w-full rounded-lg bg-slate-800/80 border border-slate-600 px-3 py-2 text-sm outline-none focus:border-amber-400"
      >
        {BLOCKS.map((b) => (
          <option key={b.zoneId} value={b.label}>
            {b.label}
          </option>
        ))}
      </select>

      {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-gold-shine text-black text-sm font-display font-bold uppercase tracking-wide py-2 rounded-lg"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Daftar
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={saving}
          className="px-4 bg-slate-800 border border-slate-600 text-slate-300 text-sm rounded-lg"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
