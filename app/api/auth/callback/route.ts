import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyAuthState } from "@/lib/auth-state";
import { setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  createGhostAdminClient,
  createMember,
  createMemberSignInUrl,
  ensureMemberLabel,
  findMemberByEmail
} from "@/lib/ghost";
import { exchangeCodeForTokens, verifyIdToken } from "@/lib/google";
import { ensureSafeRedirect, getPublicBaseUrl } from "@/lib/url";

async function handleOwnerSignIn({
  email,
  name
}: {
  email: string;
  name?: string;
}) {
  const existing = await prisma.account.findUnique({ where: { email } });
  if (existing) {
    return prisma.account.update({
      where: { email },
      data: {
        name: name ?? existing.name
      }
    });
  }

  const account = await prisma.account.create({
    data: {
      email,
      name
    }
  });

  void fetch("https://junk-drawer-api.contraption.co/newsletter/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      name,
      source: "trivet"
    })
  }).catch((error) => {
    console.error("Junk Drawer subscribe failed", error);
  });

  return account;
}

function getOwnerRedirect(account: {
  blogHost: string | null;
  adminApiKey: string | null;
  googleOauthConfigured: boolean;
}) {
  if (!account.blogHost) {
    return "/onboarding/blog";
  }
  if (!account.adminApiKey) {
    return "/onboarding/admin-key";
  }
  if (!account.googleOauthConfigured) {
    return "/onboarding/google";
  }
  return "/dashboard";
}

async function handleMemberSignIn({
  accountUuid,
  email,
  name
}: {
  accountUuid: string;
  email: string;
  name?: string;
}) {
  const account = await prisma.account.findUnique({
    where: { uuid: accountUuid }
  });

  if (!account?.adminApiKey || !account.adminHost) {
    throw new Error("Account not configured for Ghost");
  }

  const api = createGhostAdminClient({
    adminHost: account.adminHost,
    adminApiKey: account.adminApiKey
  });

  const existingMember = await findMemberByEmail(api, email);
  const member = existingMember
    ? await ensureMemberLabel(api, existingMember)
    : await createMember(api, { email, name });

  const loginType = existingMember ? "RETURNING" : "NEW";
  const signInUrl = await createMemberSignInUrl({
    adminHost: account.adminHost,
    adminApiKey: account.adminApiKey,
    memberId: member.id
  });

  await prisma.login.create({
    data: {
      accountId: account.id,
      memberEmail: email,
      type: loginType
    }
  });

  return signInUrl;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const baseUrl = getPublicBaseUrl(request.headers, request.nextUrl.origin);
  const origin = new URL(baseUrl).origin;
  const code = searchParams.get("code");
  const stateToken = searchParams.get("state");

  if (!code || !stateToken) {
    return NextResponse.redirect(new URL("/?error=oauth", origin));
  }

  let accountUuidFallback: string | undefined;

  try {
    const state = await verifyAuthState(stateToken);
    accountUuidFallback = state.accountUuid;
    const redirectUri = new URL("/api/auth/callback", origin).toString();

    if (state.flow === "owner") {
      const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        throw new Error("Missing Google OAuth credentials");
      }

      const tokens = await exchangeCodeForTokens({
        code,
        clientId,
        clientSecret,
        redirectUri
      });

      const userInfo = await verifyIdToken(tokens.id_token);
      if (userInfo.aud && userInfo.aud !== clientId) {
        throw new Error("Token audience mismatch");
      }

      const account = await handleOwnerSignIn({
        email: userInfo.email,
        name: userInfo.name
      });

      const response = NextResponse.redirect(
        new URL(getOwnerRedirect(account), origin)
      );
      await setSessionCookie(response, {
        accountId: account.id,
        email: account.email,
        name: account.name
      });
      return response;
    }

    if (!state.accountUuid) {
      throw new Error("Missing account state");
    }

    const account = await prisma.account.findUnique({
      where: { uuid: state.accountUuid }
    });

    const useCustom = Boolean(
      account?.googleOauthClientId && account?.googleOauthClientSecret
    );
    const clientId = useCustom
      ? account?.googleOauthClientId
      : process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = useCustom
      ? account?.googleOauthClientSecret
      : process.env.GOOGLE_OAUTH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Missing Google OAuth credentials");
    }

    const tokens = await exchangeCodeForTokens({
      code,
      clientId,
      clientSecret,
      redirectUri
    });

    const userInfo = await verifyIdToken(tokens.id_token);
    if (userInfo.aud && userInfo.aud !== clientId) {
      throw new Error("Token audience mismatch");
    }

    const signInUrl = await handleMemberSignIn({
      accountUuid: state.accountUuid,
      email: userInfo.email,
      name: userInfo.name
    });

    const validatedSignIn = ensureSafeRedirect(signInUrl, origin);

    return NextResponse.redirect(validatedSignIn ?? signInUrl);
  } catch (error) {
    console.error("Auth callback failed", error);
    if (accountUuidFallback) {
      return NextResponse.redirect(
        new URL(`/sign-in/${accountUuidFallback}?error=signin`, origin)
      );
    }
    return NextResponse.redirect(new URL("/?error=oauth", origin));
  }
}

export async function POST(request: NextRequest) {
  const baseUrl = getPublicBaseUrl(request.headers, request.nextUrl.origin);
  const origin = new URL(baseUrl).origin;
  try {
    const body = (await request.json()) as {
      credential?: string;
      flow?: "owner" | "member";
      accountUuid?: string;
      redirect?: string | null;
    };

    if (!body.credential || !body.flow) {
      return NextResponse.json({ error: "Missing credential" }, { status: 400 });
    }

    const userInfo = await verifyIdToken(body.credential);

    if (body.flow === "owner") {
      const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
      if (clientId && userInfo.aud && userInfo.aud !== clientId) {
        return NextResponse.json({ error: "Invalid audience" }, { status: 401 });
      }

      const account = await handleOwnerSignIn({
        email: userInfo.email,
        name: userInfo.name
      });

      const response = NextResponse.json({
        redirect: getOwnerRedirect(account)
      });
      await setSessionCookie(response, {
        accountId: account.id,
        email: account.email,
        name: account.name
      });
      return response;
    }

    if (!body.accountUuid) {
      return NextResponse.json({ error: "Missing account" }, { status: 400 });
    }

    const account = await prisma.account.findUnique({
      where: { uuid: body.accountUuid }
    });

    const useCustom = Boolean(
      account?.googleOauthClientId && account?.googleOauthClientSecret
    );
    if (!useCustom) {
      return NextResponse.json(
        { error: "Custom Google OAuth is required for One Tap" },
        { status: 400 }
      );
    }

    const clientId = account?.googleOauthClientId;
    if (clientId && userInfo.aud && userInfo.aud !== clientId) {
      return NextResponse.json({ error: "Invalid audience" }, { status: 401 });
    }

    const signInUrl = await handleMemberSignIn({
      accountUuid: body.accountUuid,
      email: userInfo.email,
      name: userInfo.name
    });

    const validatedSignIn = ensureSafeRedirect(signInUrl, origin);

    return NextResponse.json({
      signInUrl: validatedSignIn ?? signInUrl
    });
  } catch (error) {
    console.error("One Tap sign-in failed", error);
    return NextResponse.json({ error: "Unable to sign in" }, { status: 500 });
  }
}
