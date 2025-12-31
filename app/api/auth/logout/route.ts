import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { clearSessionCookie } from "@/lib/auth";
import { getPublicBaseUrl } from "@/lib/url";

export function GET(request: NextRequest) {
  const baseUrl = getPublicBaseUrl(request.headers, request.nextUrl.origin);
  const response = NextResponse.redirect(new URL("/", baseUrl));
  clearSessionCookie(response);
  return response;
}
