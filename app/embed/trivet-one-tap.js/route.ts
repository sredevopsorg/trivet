import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const accountUuid = searchParams.get("account");

  if (!accountUuid) {
    return new NextResponse("// Missing account parameter", {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }

  const account = await prisma.account.findUnique({
    where: { uuid: accountUuid }
  });

  const clientId = account?.googleOauthClientId ?? process.env.GOOGLE_OAUTH_CLIENT_ID;
  const baseUrl = process.env.TRIVET_PUBLIC_BASE_URL ?? origin;

  if (!account || !clientId || !account.adminApiKey || !account.adminHost) {
    return new NextResponse("// Trivet account not configured", {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }

  const script = `(() => {
  const TRIVET_ACCOUNT = "${accountUuid}";
  const TRIVET_BASE = "${baseUrl}";
  const GOOGLE_CLIENT_ID = "${clientId}";

  const loadGoogleScript = () =>
    new Promise((resolve, reject) => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        resolve();
        return;
      }

      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject());
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.head.appendChild(script);
    });

  const checkMember = async () => {
    try {
      const response = await fetch("/members/api/member/", {
        credentials: "include"
      });
      return response.status === 200;
    } catch (error) {
      console.warn("Trivet One Tap member check failed", error);
      return false;
    }
  };

  const start = async () => {
    const loggedIn = await checkMember();
    if (loggedIn) return;

    try {
      await loadGoogleScript();
    } catch (error) {
      console.warn("Trivet One Tap script failed to load", error);
      return;
    }

    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      auto_select: true,
      callback: async (response) => {
        if (!response || !response.credential) return;
        try {
          const result = await fetch(`${TRIVET_BASE}/api/auth/callback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              credential: response.credential,
              flow: "member",
              accountUuid: TRIVET_ACCOUNT,
              redirect: window.location.href
            })
          });
          const data = await result.json();
          if (result.ok && data.signInUrl) {
            window.location.assign(data.signInUrl);
          }
        } catch (error) {
          console.warn("Trivet One Tap sign-in failed", error);
        }
      }
    });

    window.google.accounts.id.prompt();
  };

  start();
})();`;

  const minified = script.replace(/\n\s+/g, "");

  return new NextResponse(minified, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
