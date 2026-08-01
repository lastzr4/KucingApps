import { NextRequest, NextResponse } from "next/server";
import { getOrCreateGuestUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getOrCreateGuestUser();
  return NextResponse.json({
    id: user.id,
    name: user.name,
    level: user.level,
    exp: user.exp,
    unitNumber: user.unitNumber,
    block: user.block,
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

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      level: updated.level,
      exp: updated.exp,
      unitNumber: updated.unitNumber,
      block: updated.block,
    });
  } catch (err) {
    console.error("[api/session PATCH] error", err);
    return NextResponse.json({ error: "Gagal kemaskini profil" }, { status: 500 });
  }
}
