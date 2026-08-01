import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const GUEST_COOKIE = "kucingapps_uid";

/**
 * Dapatkan user semasa dari cookie, atau daftar "guest user" baru jika belum ada.
 * TODO (Fasa 5): gantikan dengan sistem login sebenar (email/password atau OAuth).
 * Hanya boleh dipanggil dalam Route Handler / Server Action (perlu tulis cookie).
 */
export async function getOrCreateGuestUser() {
  const cookieStore = cookies();
  const uid = cookieStore.get(GUEST_COOKIE)?.value;

  if (uid) {
    const existing = await prisma.user.findUnique({ where: { id: uid } });
    if (existing) return existing;
  }

  const guest = await prisma.user.create({
    data: {
      email: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@kucingapps.local`,
      name: `Penduduk ${Math.floor(1000 + Math.random() * 9000)}`,
    },
  });

  cookieStore.set(GUEST_COOKIE, guest.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return guest;
}
