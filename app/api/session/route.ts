import { NextResponse } from "next/server";
import { getOrCreateGuestUser } from "@/lib/session";

export async function GET() {
  const user = await getOrCreateGuestUser();
  return NextResponse.json({
    id: user.id,
    name: user.name,
    level: user.level,
    exp: user.exp,
    unitNumber: user.unitNumber,
  });
}
