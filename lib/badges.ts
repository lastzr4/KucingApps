import { prisma } from "@/lib/prisma";

export const BADGE_DEFS = {
  WIRA_SNAPSHOT: {
    name: "Wira Snapshot",
    description: "Snap & tag kucing pertama anda!",
  },
  DETEKTIF_BULU: {
    name: "Detektif Bulu",
    description: "Rekod sighting untuk 3 kucing berbeza.",
  },
  PAKAR_TNR: {
    name: "Pakar TNR",
    description: "Bantu tandakan kucing sebagai TNR (mandul/ear-tipped).",
  },
} as const;

export type BadgeCode = keyof typeof BADGE_DEFS;

/**
 * Beri lencana kepada user (idempoten - tak beri dua kali).
 * Auto-cipta rekod Badge jika belum wujud dalam DB.
 * Pulangkan {code, name} jika baru diberi, atau null jika user dah ada lencana ni.
 */
export async function awardBadge(userId: string, code: BadgeCode) {
  const def = BADGE_DEFS[code];

  const badge = await prisma.badge.upsert({
    where: { code },
    update: {},
    create: { code, name: def.name, description: def.description },
  });

  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });

  if (existing) return null;

  await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
  return { code, name: def.name };
}

/**
 * Semak & beri lencana berdasarkan aktiviti sighting user.
 * Dipanggil selepas setiap sighting berjaya dihantar.
 */
export async function checkSightingBadges(userId: string) {
  const newBadges: { code: BadgeCode; name: string }[] = [];

  const first = await awardBadge(userId, "WIRA_SNAPSHOT");
  if (first) newBadges.push(first);

  const distinctCats = await prisma.catSighting.findMany({
    where: { userId },
    distinct: ["catId"],
    select: { catId: true },
  });

  if (distinctCats.length >= 3) {
    const detektif = await awardBadge(userId, "DETEKTIF_BULU");
    if (detektif) newBadges.push(detektif);
  }

  return newBadges;
}
