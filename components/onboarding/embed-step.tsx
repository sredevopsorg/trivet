"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AccountResponse {
  uuid: string;
  adminHost: string | null;
  googleMode: "custom" | "trivet";
}

export function EmbedStep({ baseUrl }: { baseUrl: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const response = await fetch("/api/account");
      if (!response.ok) {
        throw new Error("Unable to load account");
      }
      return (await response.json()) as AccountResponse;
    }
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-11 w-64 rounded-full" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    );
  }

  const canUseOneTap = data.googleMode === "custom";
  const codeInjectionUrl = data.adminHost
    ? `${data.adminHost.replace(/\/$/, "")}/ghost/#/settings/code-injection`
    : "";

  const embedScript = `<script src=\"${baseUrl}/embed/trivet-one-tap.js?account=${data.uuid}&v=1\"></script>`;
  const linkUrl = `${baseUrl}/sign-in/${data.uuid}`;
  const themeSnippet = `{{#if @member}}
  {{!-- Member already logged in --}}
{{else}}
  <a href=\"${linkUrl}\" class=\"trivet-signin\">Sign in with Google</a>
{{/if}}`;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="one-tap">
        <TabsList>
          <TabsTrigger value="one-tap">One Tap (custom required)</TabsTrigger>
          <TabsTrigger value="link">Link / Href</TabsTrigger>
          <TabsTrigger value="theme">Theme template</TabsTrigger>
        </TabsList>

        <TabsContent value="one-tap" className="space-y-4">
          {canUseOneTap ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Paste this in Ghost Code Injection (Site Header) to enable One
                Tap.
              </p>
              {codeInjectionUrl ? (
                <a
                  href={codeInjectionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold"
                >
                  Open Ghost Code Injection
                </a>
              ) : null}
              <pre className="rounded-2xl border border-gray-100 bg-gray-050 p-4 text-xs text-gray-700 dark:border-gray-900 dark:bg-gray-900 dark:text-gray-200">
                <code>{embedScript}</code>
              </pre>
            </>
          ) : (
            <div className="rounded-2xl border border-yellow/40 bg-yellow/10 p-4 text-sm text-gray-700 dark:border-yellow/40 dark:bg-yellow/10 dark:text-gray-100">
              One Tap requires a custom Google OAuth app. Go back and enter your
              own credentials to enable it.
              <div className="mt-3">
                <Button asChild size="sm">
                  <Link href="/onboarding/google">Update Google setup</Link>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="link" className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Use this link for Ghost Navigation or any custom button.
          </p>
          <p className="text-xs text-gray-500">
            Note: Ghost Navigation cannot hide links for logged-in members.
          </p>
          <pre className="rounded-2xl border border-gray-100 bg-gray-050 p-4 text-xs text-gray-700 dark:border-gray-900 dark:bg-gray-900 dark:text-gray-200">
            <code>{linkUrl}</code>
          </pre>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Hide the button for logged-in members using Ghost&apos;s @member
            conditional.
          </p>
          <pre className="rounded-2xl border border-gray-100 bg-gray-050 p-4 text-xs text-gray-700 dark:border-gray-900 dark:bg-gray-900 dark:text-gray-200">
            <code>{themeSnippet}</code>
          </pre>
          <p className="text-xs text-gray-500">
            Google button SVG: {" "}
            <a
              href="https://developers.google.com/static/identity/images/branding_guideline_sample_lt_sq_lg.svg"
              target="_blank"
              rel="noreferrer"
            >
              branding_guideline_sample_lt_sq_lg.svg
            </a>
          </p>
        </TabsContent>
      </Tabs>

      <Button asChild>
        <Link href="/dashboard">Done</Link>
      </Button>
    </div>
  );
}
