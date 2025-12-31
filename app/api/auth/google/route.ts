import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { signAuthState } from "@/lib/auth-state";
import { prisma } from "@/lib/db";
import { buildGoogleAuthUrl } from "@/lib/google";
import { ensureSafeRedirect, getPublicBaseUrl } from "@/lib/url";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const baseUrl = getPublicBaseUrl(request.headers, request.nextUrl.origin);
  const origin = new URL(baseUrl).origin;
  const flow = searchParams.get("flow") as "owner" | "member" | null;

  if (!flow) {
    return NextResponse.redirect(new URL("/", origin));
  }

  let clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  let accountUuid: string | undefined;

  if (flow === "member") {
    accountUuid = searchParams.get("account") ?? undefined;
    if (!accountUuid) {
      return NextResponse.redirect(new URL("/?error=missing-account", origin));
    }

    const account = await prisma.account.findUnique({
      where: { uuid: accountUuid }
    });

    if (!account) {
      return NextResponse.redirect(
        new URL(`/sign-in/${accountUuid}?error=not-found`, origin)
      );
    }
    if (!account.adminApiKey || !account.adminHost) {
      return NextResponse.redirect(
        new URL(`/sign-in/${accountUuid}?error=not-configured`, origin)
      );
    }

    if (account.googleOauthClientId && account.googleOauthClientSecret) {
      clientId = account.googleOauthClientId;
    }
  }

  if (!clientId) {
    return NextResponse.redirect(new URL("/?error=oauth", origin));
  }

  const redirectParam = searchParams.get("redirect");
  const redirect = ensureSafeRedirect(redirectParam, origin);

  const state = await signAuthState({
    flow,
    accountUuid,
    redirect,
    nonce: crypto.randomUUID()
  });

  const redirectUri = new URL("/api/auth/callback", origin).toString();
  const url = buildGoogleAuthUrl({
    clientId,
    redirectUri,
    state
  });

  return NextResponse.redirect(url);
}
