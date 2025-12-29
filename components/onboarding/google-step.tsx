"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { z } from "zod";

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
  defaultClientSecret
}: {
  defaultMode: "trivet" | "custom";
  defaultClientId?: string | null;
  defaultClientSecret?: string | null;
}) {
  const router = useRouter();
  const [isSwitching, startTransition] = useTransition();

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

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <Tabs
        value={mode}
        onValueChange={(value) =>
          startTransition(() =>
            form.setValue("mode", value as "trivet" | "custom")
          )
        }
      >
        <TabsList>
          <TabsTrigger value="trivet">Trivet-branded (Easy)</TabsTrigger>
          <TabsTrigger value="custom">Custom (Advanced)</TabsTrigger>
        </TabsList>

        <TabsContent value="trivet">
          {isSwitching ? (
            <Skeleton className="h-24 w-full rounded-2xl" />
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-gray-050 p-4 text-sm text-gray-700 dark:border-gray-900 dark:bg-gray-900 dark:text-gray-300">
              Use Trivet&apos;s Google OAuth credentials. No extra setup required.
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom">
          {isSwitching ? (
            <Skeleton className="h-24 w-full rounded-2xl" />
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-gray-050 p-4 text-sm text-gray-700 dark:border-gray-900 dark:bg-gray-900 dark:text-gray-300">
                Create OAuth credentials in Google Cloud Console and add the
                redirect URI for this app. Then paste the Client ID and Client
                Secret here.
              </div>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold"
              >
                Open Google Cloud Console
              </a>
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input id="clientId" {...form.register("clientId")} />
                {form.formState.errors.clientId ? (
                  <p className="text-xs text-red">
                    {form.formState.errors.clientId.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input id="clientSecret" {...form.register("clientSecret")} />
                {form.formState.errors.clientSecret ? (
                  <p className="text-xs text-red">
                    {form.formState.errors.clientSecret.message}
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

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" asChild>
          <Link href="/onboarding/admin-key">Back</Link>
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Continue"}
        </Button>
        {mutation.isPending ? (
          <Skeleton className="h-10 w-40 rounded-full" />
        ) : null}
      </div>
    </form>
  );
}
