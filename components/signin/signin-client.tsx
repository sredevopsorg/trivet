"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function SignInClient({
  accountUuid,
  error,
  redirect
}: {
  accountUuid: string;
  error?: string | null;
  redirect?: string | null;
}) {
  useEffect(() => {
    if (error) {
      return;
    }

    const url = new URL("/api/auth/google", window.location.origin);
    url.searchParams.set("flow", "member");
    url.searchParams.set("account", accountUuid);
    if (redirect) {
      url.searchParams.set("redirect", redirect);
    }

    window.location.assign(url.toString());
  }, [accountUuid, error, redirect]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Loader2 className="h-6 w-6 animate-spin text-gray-900" />
      <span className="sr-only">
        {error ? "Unable to sign in." : "Signing you in."}
      </span>
    </main>
  );
}
