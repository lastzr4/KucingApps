"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { isAdmin, adminFetch } from "@/lib/adminClient";
import { playError } from "@/lib/sound";

type Variant = "icon" | "full";

export default function AdminDeleteButton({
  url,
  confirmMessage,
  redirectTo,
  variant = "icon",
  className = "",
}: {
  url: string;
  confirmMessage: string;
  /** Jika diberi, navigate ke sini selepas padam berjaya. Jika tidak, refresh page semasa. */
  redirectTo?: string;
  variant?: Variant;
  className?: string;
}) {
  const router = useRouter();
  const [admin, setAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  if (!admin) return null;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(confirmMessage)) return;

    setDeleting(true);
    try {
      const res = await adminFetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal padam");

      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    } catch (err) {
      playError();
      alert("Gagal padam. Sila cuba lagi.");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  if (variant === "full") {
    return (
      <button
        onClick={handleDelete}
        disabled={deleting}
        className={`flex items-center justify-center gap-2 bg-red-700 border border-red-500 text-white text-xs font-bold py-2 rounded-lg disabled:opacity-60 ${className}`}
      >
        {deleting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
        Padam
      </button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      aria-label="Padam"
      className={`rounded-full bg-red-600 border-2 border-red-300/70 flex items-center justify-center shadow-lg disabled:opacity-60 ${className}`}
    >
      {deleting ? (
        <Loader2 className="w-4 h-4 text-white animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4 text-white" />
      )}
    </button>
  );
}
