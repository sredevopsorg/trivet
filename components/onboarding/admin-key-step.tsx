"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  adminApiKey: z
    .string()
    .regex(/^[a-f0-9]{24}:[a-f0-9]{64}$/i, "Invalid Admin API key format")
});

type FormValues = z.infer<typeof schema>;

export function AdminKeyStep({ adminHost }: { adminHost: string }) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      adminApiKey: ""
    }
  });

  const mutation = useMutation<unknown, Error, FormValues>({
    mutationFn: async (values: FormValues) => {
      const response = await fetch("/api/onboarding/admin-key", {
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
      router.push("/onboarding/google");
    }
  });

  const integrationLink = `${adminHost.replace(/\/$/, "")}/ghost/#/settings/integrations/new`;

  return (
    <form
      className="space-y-6"
      onSubmit={(event) =>
        void form.handleSubmit((values) => mutation.mutate(values))(event)
      }
    >
      <div className="space-y-2 rounded-2xl border border-gray-100 bg-gray-050 p-4 text-sm text-gray-700">
        <p>
          Create a new Ghost integration called <strong>Trivet</strong>, then
          paste the Admin API key here.
        </p>
        <a
          href={integrationLink}
          target="_blank"
          rel="noreferrer"
          className="font-semibold"
        >
          Open Ghost Integrations
        </a>
      </div>

      <div className="space-y-2">
        <Label htmlFor="adminApiKey">Admin API Key</Label>
        <Input
          id="adminApiKey"
          placeholder="0123456789abcdef01234567:012345..."
          {...form.register("adminApiKey")}
        />
        {form.formState.errors.adminApiKey ? (
          <p className="text-xs text-red">
            {form.formState.errors.adminApiKey.message}
          </p>
        ) : null}
      </div>

      {mutation.isError ? (
        <p className="text-sm text-red">{mutation.error.message}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" asChild>
          <Link href="/onboarding/blog">Back</Link>
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Testing..." : "Continue"}
        </Button>
        {mutation.isPending ? (
          <Skeleton className="h-10 w-40 rounded-full" />
        ) : null}
      </div>
    </form>
  );
}
