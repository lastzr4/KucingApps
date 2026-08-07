"use client";

import Link from "next/link";
import CatCard, { type CatCardData } from "./CatCard";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";
import { playMeow } from "@/lib/sound";

export default function CatCardGrid({ cats }: { cats: CatCardData[] }) {
  if (cats.length === 0) {
    return (
      <p className="text-slate-400 text-sm">
        Tiada kucing lagi. Guna Snap & Tag untuk daftar kucing pertama!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cats.map((cat) => (
        <div key={cat.id} className="relative">
          <Link href={`/cats/${cat.id}`} onClick={() => playMeow()}>
            <CatCard cat={cat} />
          </Link>
          <AdminDeleteButton
            url={`/api/cats/${cat.id}`}
            confirmMessage={`Padam kucing "${cat.name}" beserta semua sighting log? Tindakan ini tidak boleh diundur.`}
            className="absolute -bottom-2 -left-2 z-30 w-8 h-8"
          />
        </div>
      ))}
    </div>
  );
}
