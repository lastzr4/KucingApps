"use client";

import { useRef, useState } from "react";
import { Camera, Upload, MapPin, Loader2, CheckCircle2 } from "lucide-react";

const BLOCKS = ["Block A", "Block B", "Block C", "Feeder Spot 1", "Parking B1"];

type SubmitState = "idle" | "uploading" | "success" | "error";

export default function SnapTagForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [catName, setCatName] = useState("");
  const [block, setBlock] = useState(BLOCKS[0]);
  const [note, setNote] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setState("uploading");

    try {
      // TODO: ganti dengan panggilan sebenar ke /api/sightings
      // 1. Upload imej ke Cloudinary/Supabase Storage -> dapatkan imageUrl
      // 2. POST { catName, block, note, imageUrl } ke Prisma (CatSighting / Cat)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("catName", catName);
      formData.append("block", block);
      formData.append("note", note);

      await new Promise((resolve) => setTimeout(resolve, 1200)); // simulasi upload

      setState("success");
    } catch (err) {
      console.error(err);
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 text-white">
      {/* Kawasan snap gambar */}
      <div
        onClick={() => fileInputRef.current?.click()}
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
            <option key={b} value={b}>
              {b}
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
        disabled={!file || state === "uploading"}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-black font-bold px-4 py-2.5 rounded-xl"
      >
        {state === "uploading" && <Loader2 className="w-4 h-4 animate-spin" />}
        {state === "success" && <CheckCircle2 className="w-4 h-4" />}
        {state === "idle" && <Upload className="w-4 h-4" />}
        {state === "success" ? "Berjaya Dihantar! +10 EXP" : "Hantar Sighting"}
      </button>

      {state === "error" && (
        <p className="text-red-400 text-sm text-center">
          Gagal menghantar. Sila cuba lagi.
        </p>
      )}
    </form>
  );
}
