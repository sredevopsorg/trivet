"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  adminApiKey: z
    .string()
    .regex(/^[a-f0-9]{24}:[a-f0-9]{64}$/i, "Invalid Admin API key format")
});

type FormValues = z.infer<typeof schema>;

export function AdminKeyStep({
  adminHost,
  defaultValue
}: {
  adminHost: string;
  defaultValue?: string | null;
}) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      adminApiKey: defaultValue ?? ""
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
      <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-050 p-4 text-sm text-gray-700">
        <ol className="list-decimal space-y-2 pl-4">
          <li>
            <a
              href={integrationLink}
              target="_blank"
              rel="noreferrer"
              className="font-semibold"
            >
              Open your Ghost integrations →
            </a>
          </li>
          <li>
            Create a new integration called <strong>Trivet</strong>.
          </li>
          <li>Paste the <strong>Admin API key</strong> here.</li>
        </ol>
      </div>

      <div className="space-y-2">
        <Input
          id="adminApiKey"
          placeholder="0123456789abcdef01234567:012345..."
          aria-label="Admin API key"
          autoFocus
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

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="ghost" asChild>
          <Link href="/onboarding/blog">Back</Link>
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Testing..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}
