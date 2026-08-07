import { NextRequest } from "next/server";

/**
 * Semakan admin ringkas guna shared-secret (header x-admin-secret).
 * TODO (Fasa 7): gantikan dengan sistem role/login sebenar bila komuniti dah grow.
 */
export function isAdminRequest(request: NextRequest): boolean {
  const provided = request.headers.get("x-admin-secret");
  const expected = process.env.ADMIN_SECRET;
  return !!provided && !!expected && provided === expected;
}
