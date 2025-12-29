import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  return NextResponse.json({
    authenticated: Boolean(session),
    user: session ? { email: session.email, name: session.name } : undefined
  });
}
