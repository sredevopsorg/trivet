"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  blogUrl: z.string().min(1, "Blog URL is required")
});

type FormValues = z.infer<typeof schema>;

export function BlogStep({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      blogUrl: defaultValue
    }
  });

  const mutation = useMutation<unknown, Error, FormValues>({
    mutationFn: async (values: FormValues) => {
      const response = await fetch("/api/onboarding/blog", {
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
      router.push("/onboarding/admin-key");
    }
  });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <div className="space-y-2">
        <Label htmlFor="blogUrl">Blog URL</Label>
        <Input
          id="blogUrl"
          placeholder="https://contraption.co"
          {...form.register("blogUrl")}
        />
        {form.formState.errors.blogUrl ? (
          <p className="text-xs text-red">
            {form.formState.errors.blogUrl.message}
          </p>
        ) : null}
      </div>

      {mutation.isError ? (
        <p className="text-sm text-red">{mutation.error.message}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Verifying..." : "Continue"}
        </Button>
        {mutation.isPending ? (
          <Skeleton className="h-10 w-40 rounded-full" />
        ) : null}
      </div>
    </form>
  );
}
