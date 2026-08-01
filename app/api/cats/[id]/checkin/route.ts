import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateGuestUser } from "@/lib/session";
import { applyExpGain } from "@/lib/gamification";

const EXP_GAIN = 5;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cat = await prisma.cat.findUnique({ where: { id: params.id } });
    if (!cat) {
      return NextResponse.json({ error: "Kucing tidak dijumpai" }, { status: 404 });
    }

    const user = await getOrCreateGuestUser();

    await prisma.catSighting.create({
      data: {
        catId: cat.id,
        userId: user.id,
        locationBlock: cat.currentBlock || "Tidak diketahui",
        note: "Spotting check-in harian",
      },
    });

    const progress = applyExpGain(user.level, user.exp, EXP_GAIN);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { level: progress.level, exp: progress.exp },
    });

    return NextResponse.json({
      success: true,
      user: {
        level: updatedUser.level,
        exp: updatedUser.exp,
        expGained: EXP_GAIN,
      },
    });
  } catch (err) {
    console.error("[api/cats/checkin] error", err);
    return NextResponse.json({ error: "Gagal check-in" }, { status: 500 });
  }
}
