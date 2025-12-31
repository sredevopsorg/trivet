"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps
} from "recharts";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface AnalyticsPoint {
  date: string;
  new: number;
  returning: number;
}

interface AccountResponse {
  uuid: string;
  blogHost: string | null;
  adminHost: string | null;
  googleMode: "custom" | "trivet";
}

export function DashboardClient() {
  const accountQuery = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const response = await fetch("/api/account");
      if (!response.ok) {
        throw new Error("Unable to load account");
      }
      return (await response.json()) as AccountResponse;
    }
  });

  const analyticsQuery = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/analytics");
      if (!response.ok) {
        throw new Error("Unable to load analytics");
      }
      const payload = (await response.json()) as { data: AnalyticsPoint[] };
      return payload.data;
    }
  });

  const hasAnalytics =
    analyticsQuery.data?.some((point) => point.new > 0 || point.returning > 0) ??
    false;

  const configItems = [
    {
      label: "Blog URL",
      value: accountQuery.data?.blogHost ?? "Not set",
      href: "/onboarding/blog",
      action: "Edit blog URL"
    },
    {
      label: "Admin API key",
      value: accountQuery.data?.adminHost ?? "Not set",
      href: "/onboarding/admin-key",
      action: "Update Admin API key"
    },
    {
      label: "Google",
      value:
        accountQuery.data?.googleMode === "custom"
          ? "Custom OAuth"
          : "Trivet branded",
      href: "/onboarding/google",
      action: "Update Google settings"
    },
    {
      label: "Embed",
      value: "Member sign-in",
      href: "/onboarding/embed",
      action: "View embed options"
    }
  ];

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl space-y-12 text-center">
        <section className="space-y-4">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 text-left shadow-sm">
            <div className="text-sm font-semibold">Sign-ins per day</div>
            {analyticsQuery.isLoading ? (
              <Skeleton className="mt-4 h-64 w-full rounded-3xl" />
            ) : analyticsQuery.data ? (
              hasAnalytics ? (
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsQuery.data} margin={{ top: 10 }}>
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip content={<AnalyticsTooltip />} cursor={false} />
                      <Bar dataKey="new" name="New" stackId="a" fill="#111111" />
                      <Bar
                        dataKey="returning"
                        name="Returning"
                        stackId="a"
                        fill="#B1B1B1"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No sign-ins yet.</p>
              )
            ) : (
              <p className="mt-4 text-sm text-red">Unable to load analytics.</p>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 text-left shadow-sm">
            <div className="text-sm font-semibold">Configuration</div>
            {accountQuery.isLoading ? (
              <div className="mt-6 space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : accountQuery.data ? (
              <div className="mt-6 space-y-5">
                {configItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs uppercase tracking-[0.2em] text-gray-400">
                        {item.label}
                      </div>
                      <div className="text-sm text-gray-900">{item.value}</div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={item.href} className="no-underline">
                        <Pencil className="h-3 w-3" />
                        {item.action}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-red">Unable to load configuration.</p>
            )}
          </div>
        </section>

        <div className="flex justify-center pt-4">
          <a
            href="https://contraption.co"
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
          >
            <Image
              src="/contraption-wordmark.svg"
              alt="Contraption"
              width={120}
              height={24}
              className="h-5 w-24"
            />
          </a>
        </div>
      </div>
    </main>
  );
}

function AnalyticsTooltip({
  active,
  payload,
  label
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-3 py-2 text-xs text-gray-700 shadow-sm">
      <div className="mb-1 text-gray-500">{label}</div>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div
            key={`${entry.dataKey ?? entry.name}`}
            className="flex items-center justify-between gap-4"
          >
            <span>{entry.name ?? entry.dataKey}</span>
            <span className="font-semibold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
