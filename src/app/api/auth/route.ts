import { NextRequest } from "next/server";
import { verifyPassword, createToken, setTokenCookie, clearTokenCookie } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!password) return apiError("Password required", 400);

  const valid = await verifyPassword(password);
  if (!valid) return apiError("Invalid password", 401);

  const token = await createToken();
  await setTokenCookie(token);
  return apiResponse({ ok: true });
}

export async function DELETE() {
  await clearTokenCookie();
  return apiResponse({ ok: true });
}
