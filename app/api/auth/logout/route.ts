import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { clearSessionCookie } from "@/lib/auth";

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.nextUrl.origin));
  clearSessionCookie(response);
  return response;
}
