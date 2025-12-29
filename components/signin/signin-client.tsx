"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function SignInClient({
  accountUuid,
  blogHost,
  error,
  redirect
}: {
  accountUuid: string;
  blogHost?: string | null;
  error?: string | null;
  redirect?: string | null;
}) {
  const [hasRedirected, setHasRedirected] = useState(false);

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

    setHasRedirected(true);
    window.location.assign(url.toString());
  }, [accountUuid, error, redirect]);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col items-center justify-center px-6 text-center">
      <div className="rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-sm backdrop-blur dark:border-gray-900 dark:bg-gray-950/90">
        {error ? (
          <>
            <h1 className="text-2xl font-semibold text-gray-950 dark:text-white">
              We couldn&apos;t sign you in
            </h1>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Please try again. If this keeps happening, reach out to the blog
              owner.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link href={`/sign-in/${accountUuid}`}>Try again</Link>
              </Button>
              {blogHost ? (
                <Button variant="outline" asChild>
                  <a href={blogHost}>Back to blog</a>
                </Button>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Signing you in
            </p>
            <h1 className="mt-4 text-2xl font-semibold text-gray-950 dark:text-white">
              Signing you in with Google
            </h1>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {hasRedirected
                ? "Redirecting to Google..."
                : "Preparing your sign-in..."}
            </p>
            <div className="mt-6 flex justify-center">
              <Skeleton className="h-10 w-40 rounded-full" />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
