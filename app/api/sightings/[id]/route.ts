import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/admin";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Tidak dibenarkan" }, { status: 403 });
  }

  try {
    await prisma.catSighting.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/sightings DELETE] error", err);
    return NextResponse.json({ error: "Gagal padam sighting" }, { status: 500 });
  }
}
