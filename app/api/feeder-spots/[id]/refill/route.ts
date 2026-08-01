import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateGuestUser } from "@/lib/session";
import { applyExpGain } from "@/lib/gamification";

const EXP_GAIN = 8;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spot = await prisma.feederSpot.findUnique({ where: { id: params.id } });
    if (!spot) {
      return NextResponse.json({ error: "Feeder Spot tidak dijumpai" }, { status: 404 });
    }

    const user = await getOrCreateGuestUser();

    await prisma.feederSpot.update({
      where: { id: spot.id },
      data: { status: "FULL", lastRefilledById: user.id, lastRefilledAt: new Date() },
    });

    await prisma.feederRefillLog.create({
      data: { feederSpotId: spot.id, userId: user.id },
    });

    const progress = applyExpGain(user.level, user.exp, EXP_GAIN);
    await prisma.user.update({
      where: { id: user.id },
      data: { level: progress.level, exp: progress.exp },
    });

    return NextResponse.json({ success: true, expGained: EXP_GAIN });
  } catch (err) {
    console.error("[api/feeder-spots/refill] error", err);
    return NextResponse.json({ error: "Gagal kemaskini" }, { status: 500 });
  }
}
