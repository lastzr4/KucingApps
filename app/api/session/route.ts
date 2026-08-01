import { NextRequest, NextResponse } from "next/server";
import { getOrCreateGuestUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getOrCreateGuestUser();

  const userBadges = await prisma.userBadge.findMany({
    where: { userId: user.id },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    level: user.level,
    exp: user.exp,
    unitNumber: user.unitNumber,
    block: user.block,
    badges: userBadges.map((ub) => ({
      code: ub.badge.code,
      name: ub.badge.name,
      description: ub.badge.description,
    })),
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getOrCreateGuestUser();
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const unitNumber =
      typeof body.unitNumber === "string" ? body.unitNumber.trim() : undefined;
    const block = typeof body.block === "string" ? body.block.trim() : undefined;

    if (name !== undefined && name.length === 0) {
      return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(unitNumber !== undefined ? { unitNumber } : {}),
        ...(block !== undefined ? { block } : {}),
      },
    });

    const userBadges = await prisma.userBadge.findMany({
      where: { userId: updated.id },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      level: updated.level,
      exp: updated.exp,
      unitNumber: updated.unitNumber,
      block: updated.block,
      badges: userBadges.map((ub) => ({
        code: ub.badge.code,
        name: ub.badge.name,
        description: ub.badge.description,
      })),
    });
  } catch (err) {
    console.error("[api/session PATCH] error", err);
    return NextResponse.json({ error: "Gagal kemaskini profil" }, { status: 500 });
  }
}
