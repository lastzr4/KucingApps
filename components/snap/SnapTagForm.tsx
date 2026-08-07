"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Camera,
  Upload,
  MapPin,
  Loader2,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { BLOCKS } from "@/lib/zones";
import { checkImageUrlIsCat } from "@/lib/catDetection";
import { playClick, playSuccess, playError } from "@/lib/sound";

type SubmitState = "idle" | "uploading" | "success" | "error";
type CatCheckState = "idle" | "checking" | "ok" | "rejected" | "unsure";

type SubmitResult = {
  catId: string;
  expGained: number;
  level: number;
  exp: number;
  newBadges: { code: string; name: string }[];
};

export default function SnapTagForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [catName, setCatName] = useState("");
  const [block, setBlock] = useState(BLOCKS[0].label);
  const [note, setNote] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [catCheck, setCatCheck] = useState<CatCheckState>("idle");
  const [catCheckMsg, setCatCheckMsg] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setCatCheck("checking");
    setCatCheckMsg("Mengesahkan ini gambar kucing...");

    try {
      const result = await checkImageUrlIsCat(url);
      if (result.isCat) {
        setCatCheck("ok");
        setCatCheckMsg(`Disahkan kucing (${Math.round(result.confidence * 100)}% yakin)`);
        playSuccess();
      } else {
        setCatCheck("rejected");
        setCatCheckMsg(
          `Gambar ini nampak seperti "${result.topLabel}", bukan kucing. Sila tekan semula untuk pilih gambar lain.`
        );
        playError();
      }
    } catch (err) {
      console.error("[catCheck] error", err);
      // Jika model gagal load (offline / peranti lemah), jangan sekat pengguna
      setCatCheck("unsure");
      setCatCheckMsg("Tidak dapat sahkan automatik pada peranti ini - tetap boleh dihantar.");
    }
  }

  function resetForm() {
    setFile(null);
    setPreview(null);
    setCatName("");
    setNote("");
    setState("idle");
    setResult(null);
    setErrorMsg("");
    setCatCheck("idle");
    setCatCheckMsg("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || catCheck === "rejected" || catCheck === "checking") return;
    setState("uploading");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("catName", catName);
      formData.append("block", block);
      formData.append("note", note);

      const res = await fetch("/api/sightings", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal menghantar");

      setResult({
        catId: data.cat.id,
        expGained: data.user.expGained,
        level: data.user.level,
        exp: data.user.exp,
        newBadges: data.newBadges || [],
      });
      setState("success");
      playSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Gagal menghantar. Sila cuba lagi.");
      setState("error");
      playError();
    }
  }

  if (state === "success" && result) {
    return (
      <div className="max-w-md mx-auto text-center text-white space-y-4 py-10">
        <div className="relative rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 shine-sweep">
          <div className="w-16 h-16 rounded-full bg-gold-shine border-2 border-amber-200/70 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/40 animate-glow-legendary">
            <CheckCircle2 className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-xl font-display font-black uppercase tracking-wide mt-3 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Berjaya Direkodkan!
          </h2>
          <p className="text-slate-300 mt-2">
            <span className="text-amber-400 font-bold">+{result.expGained} EXP</span> diperoleh.
            Sekarang Level {result.level} ({result.exp} EXP).
          </p>
          {result.newBadges.length > 0 && (
            <p className="text-amber-300 font-display text-sm mt-2">
              🏅 Lencana baru: {result.newBadges.map((b) => b.name).join(", ")}!
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href={`/cats/${result.catId}`}
            className="bg-gold-shine text-black font-display font-bold uppercase tracking-wide px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/30 border border-amber-200/60"
          >
            Lihat Kad Kucing
          </Link>
          <button
            onClick={resetForm}
            className="flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-xl"
          >
            <RotateCcw className="w-4 h-4" /> Snap Kucing Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 text-white">
      {/* Kawasan snap gambar */}
      <div
        onClick={() => {
          playClick();
          fileInputRef.current?.click();
        }}
        className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-slate-600 bg-slate-800 flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Camera className="w-10 h-10" />
            <span className="text-sm">Tekan untuk snap / muat naik gambar</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {catCheck !== "idle" && (
        <div
          className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2 ${
            catCheck === "ok"
              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-700/50"
              : catCheck === "rejected"
                ? "bg-red-950/60 text-red-300 border border-red-700/50"
                : "bg-slate-800 text-slate-300 border border-slate-600"
          }`}
        >
          {catCheck === "checking" && <Loader2 className="w-4 h-4 animate-spin shrink-0 mt-0.5" />}
          {catCheck === "ok" && <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />}
          {catCheck === "rejected" && <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />}
          {catCheck === "unsure" && <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 opacity-60" />}
          <span>{catCheckMsg}</span>
        </div>
      )}

      <div>
        <label className="text-sm text-slate-300">Nama Kucing</label>
        <input
          value={catName}
          onChange={(e) => setCatName(e.target.value)}
          placeholder="cth: Comel, Oyen, Blackie"
          className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 text-sm outline-none focus:border-amber-400"
          required
        />
      </div>

      <div>
        <label className="text-sm text-slate-300 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> Lokasi / Block
        </label>
        <select
          value={block}
          onChange={(e) => setBlock(e.target.value)}
          className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 text-sm outline-none focus:border-amber-400"
        >
          {BLOCKS.map((b) => (
            <option key={b.zoneId} value={b.label}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-slate-300">Nota (pilihan)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="cth: Kucing ni jinak, suka bermain dekat tangga..."
          className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 text-sm outline-none focus:border-amber-400"
        />
      </div>

      <button
        type="submit"
        disabled={
          !file || state === "uploading" || catCheck === "checking" || catCheck === "rejected"
        }
        className="w-full flex items-center justify-center gap-2 bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-black font-bold px-4 py-2.5 rounded-xl"
      >
        {state === "uploading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Menghantar...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" /> Hantar Sighting
          </>
        )}
      </button>

      {state === "error" && (
        <p className="text-red-400 text-sm text-center">{errorMsg}</p>
      )}
    </form>
  );
}
