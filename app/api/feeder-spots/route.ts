import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const block = typeof body.block === "string" ? body.block.trim() : null;

    if (!name) {
      return NextResponse.json({ error: "Nama Feeder Spot diperlukan" }, { status: 400 });
    }

    const spot = await prisma.feederSpot.create({
      data: { name, block: block || null, status: "EMPTY" },
    });

    return NextResponse.json({ success: true, spot });
  } catch (err) {
    console.error("[api/feeder-spots POST] error", err);
    return NextResponse.json({ error: "Gagal daftar Feeder Spot" }, { status: 500 });
  }
}
