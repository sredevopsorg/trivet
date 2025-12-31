"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState, useTransition } from "react";
import { z } from "zod";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const schema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("trivet")
  }),
  z.object({
    mode: z.literal("custom"),
    clientId: z.string().min(1, "Client ID required"),
    clientSecret: z.string().min(1, "Client secret required")
  })
]);

type FormValues = z.infer<typeof schema>;

export function GoogleStep({
  defaultMode,
  defaultClientId,
  defaultClientSecret,
  baseUrl,
  blogOrigin
}: {
  defaultMode: "trivet" | "custom";
  defaultClientId?: string | null;
  defaultClientSecret?: string | null;
  baseUrl: string;
  blogOrigin: string;
}) {
  const router = useRouter();
  const [isSwitching, startTransition] = useTransition();
  const clientIdRef = useRef<HTMLInputElement>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const trivetOrigin = new URL(baseUrl).origin;
  const resolvedBlogOrigin = blogOrigin || trivetOrigin;
  const redirectUri = `${trivetOrigin}/api/auth/callback`;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mode: defaultMode,
      clientId: defaultClientId ?? "",
      clientSecret: defaultClientSecret ?? ""
    }
  });

  const mutation = useMutation<unknown, Error, FormValues>({
    mutationFn: async (values: FormValues) => {
      const response = await fetch("/api/onboarding/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to save");
      }
      return response.json();
    },
    onSuccess: () => {
      router.push("/onboarding/embed");
    }
  });

  const mode = form.watch("mode");
  const errors = form.formState.errors as Record<
    string,
    { message?: string } | undefined
  >;

  useEffect(() => {
    if (mode === "custom" && !isSwitching) {
      clientIdRef.current?.focus();
    }
  }, [mode, isSwitching]);

  useEffect(() => {
    if (!copiedField) {
      return;
    }
    const timeout = window.setTimeout(() => setCopiedField(null), 1500);
    return () => window.clearTimeout(timeout);
  }, [copiedField]);

  const handleCopy = async (value: string, field: string) => {
    if (!navigator.clipboard) {
      return;
    }
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) =>
        void form.handleSubmit((values) => mutation.mutate(values))(event)
      }
    >
      <Tabs
        value={mode}
        onValueChange={(value) =>
          startTransition(() =>
            form.setValue("mode", value as "trivet" | "custom")
          )
        }
      >
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="custom">Custom (Recommended)</TabsTrigger>
            <TabsTrigger value="trivet">Trivet-branded (Easy)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="trivet">
          {isSwitching ? (
            <Skeleton className="h-24 w-full rounded-2xl" />
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-gray-050 p-4 text-sm text-gray-700">
              Use Trivet&apos;s Google app for basic sign-in links. One Tap
              requires your own Google OAuth app.
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom">
          {isSwitching ? (
            <Skeleton className="h-24 w-full rounded-2xl" />
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-gray-050 p-4">
                <ol className="list-decimal space-y-3 pl-4 text-sm text-gray-700">
                  <li>
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold"
                    >
                      Open Google Cloud Console →
                    </a>{" "}
                    and create an OAuth client ID for a web application.
                  </li>
                  <li className="space-y-3">
                    Add the following values:
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-gray-600">
                          Authorized JavaScript origins
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-xs text-gray-700">
                          <span className="break-all font-mono text-[11px]">
                            {resolvedBlogOrigin}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(resolvedBlogOrigin, "origin")}
                            className="rounded-full p-2 text-gray-500 transition hover:text-gray-900"
                            aria-label="Copy JavaScript origin"
                          >
                            {copiedField === "origin" ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-gray-600">
                          Authorized redirect URIs
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-xs text-gray-700">
                          <span className="break-all font-mono text-[11px]">
                            {redirectUri}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(redirectUri, "redirect")}
                            className="rounded-full p-2 text-gray-500 transition hover:text-gray-900"
                            aria-label="Copy redirect URI"
                          >
                            {copiedField === "redirect" ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    Configure the OAuth consent screen as External. Add your app
                    name and support email, then publish the app (or add yourself
                    as a test user while in testing).
                  </li>
                </ol>
              </div>
              <div className="flex justify-end">
                <a
                  href="https://developers.google.com/identity/sign-in/web/sign-in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold"
                >
                  Read Google docs →
                </a>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  ref={clientIdRef}
                  {...form.register("clientId")}
                />
                {errors.clientId ? (
                  <p className="text-xs text-red">
                    {errors.clientId.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input id="clientSecret" {...form.register("clientSecret")} />
                {errors.clientSecret ? (
                  <p className="text-xs text-red">
                    {errors.clientSecret.message}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {mutation.isError ? (
        <p className="text-sm text-red">{mutation.error.message}</p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="ghost" asChild>
          <Link href="/onboarding/admin-key">Back</Link>
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}
