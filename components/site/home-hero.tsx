"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeHero({
  googleClientId,
  toast
}: {
  googleClientId: string;
  toast?: string | null;
}) {
  const [oneTapReady, setOneTapReady] = useState(false);
  const [oneTapError, setOneTapError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [showToast, setShowToast] = useState(toast === "deleted");

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const loadOneTap = async () => {
      setOneTapError(null);

      try {
        if (!window.google?.accounts?.id) {
          await new Promise<void>((resolve, reject) => {
            const existing = document.querySelector(
              'script[src="https://accounts.google.com/gsi/client"]'
            );
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
        }

        if (!window.google?.accounts?.id) {
          setOneTapError("Google One Tap unavailable");
          return;
        }

        const handleCredential = async (response: { credential?: string }) => {
          if (!response.credential) {
            return;
          }
          setSigningIn(true);
          try {
            const result = await fetch("/api/auth/callback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                credential: response.credential,
                flow: "owner"
              })
            });
            const data = (await result.json()) as { redirect?: string };
            if (result.ok && data.redirect) {
              window.location.assign(data.redirect);
            } else {
              setOneTapError("Unable to complete sign in");
            }
          } catch (error) {
            console.error("One Tap sign-in failed", error);
            setOneTapError("Unable to complete sign in");
          } finally {
            setSigningIn(false);
          }
        };

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          auto_select: false,
          callback: (response) => {
            void handleCredential(response);
          }
        });

        window.google.accounts.id.prompt();
        setOneTapReady(true);
      } catch (error) {
        console.error("One Tap init failed", error);
        setOneTapError("Google One Tap unavailable");
      }
    };

    void loadOneTap();
  }, [googleClientId]);

  useEffect(() => {
    if (toast !== "deleted") {
      return;
    }

    const timeout = window.setTimeout(() => setShowToast(false), 4000);
    const url = new URL(window.location.href);
    url.searchParams.delete("toast");
    window.history.replaceState({}, "", url.toString());

    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <section className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="max-w-2xl text-center">
        {showToast ? (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 rounded-2xl border border-green/30 bg-white px-4 py-3 text-sm text-gray-900 dark:border-green/40 dark:bg-gray-950 dark:text-gray-050"
          >
            Account deleted. You have been signed out.
          </div>
        ) : null}
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          Free Google sign-in for Ghost blogs
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Replace magic links with a Google button your readers already trust.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-050">
            Do you use Ghost?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {oneTapReady || Boolean(oneTapError) || !googleClientId ? (
              <Button asChild size="lg" disabled={signingIn}>
                <Link href="/api/auth/google?flow=owner">
                  {signingIn ? "Signing you in..." : "Yes, sign up"}
                </Link>
              </Button>
            ) : (
              <Skeleton className="h-12 w-40 rounded-full" />
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  No
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Trivet isn&apos;t for you</DialogTitle>
                  <DialogDescription>
                    Trivet only helps Ghost publishers add Google sign-in. If you
                    need anything else, Contraption can help.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button asChild>
                    <a
                      href="https://www.contraption.co"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit Contraption
                    </a>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {oneTapError ? (
            <p className="text-xs text-red">{oneTapError}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
