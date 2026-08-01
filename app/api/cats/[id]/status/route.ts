import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateGuestUser } from "@/lib/session";
import { awardBadge } from "@/lib/badges";

const VALID_STATUSES = ["OWNED", "STRAY_GUARDIAN", "TNR", "EMERGENCY"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const status = body.status;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Status tidak sah" }, { status: 400 });
    }

    const cat = await prisma.cat.findUnique({ where: { id: params.id } });
    if (!cat) {
      return NextResponse.json({ error: "Kucing tidak dijumpai" }, { status: 404 });
    }

    const user = await getOrCreateGuestUser();

    const updated = await prisma.cat.update({
      where: { id: cat.id },
      data: {
        status,
        // TNR biasanya disahkan melalui ear-tipping
        earTipped: status === "TNR" ? true : cat.earTipped,
      },
    });

    let newBadge = null;
    if (status === "TNR") {
      newBadge = await awardBadge(user.id, "PAKAR_TNR");
    }

    return NextResponse.json({
      success: true,
      cat: { id: updated.id, status: updated.status, earTipped: updated.earTipped },
      newBadge,
    });
  } catch (err) {
    console.error("[api/cats/status] error", err);
    return NextResponse.json({ error: "Gagal kemaskini status" }, { status: 500 });
  }
}
