"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import {
  Line,
  LineChart,
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

interface ChartPoint extends AnalyticsPoint {
  total: number;
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

  const chartData = analyticsQuery.data
    ? buildChartData(analyticsQuery.data)
    : null;
  const hasAnalytics = chartData?.some((point) => point.total > 0) ?? false;

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
    <main className="min-h-[calc(100vh-4rem)] py-12">
      <div className="content-container space-y-12 text-left">
        <section className="space-y-4">
          <div className="text-sm font-semibold">Sign-ins per day</div>
          {analyticsQuery.isLoading ? (
            <Skeleton className="mt-4 h-64 w-full rounded-3xl" />
          ) : chartData ? (
            <>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip content={<AnalyticsTooltip />} cursor={false} />
                    <Line
                      type="linear"
                      dataKey="total"
                      name="Sign-ins"
                      stroke="#111111"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#111111", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#111111", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {!hasAnalytics ? (
                <p className="mt-4 text-sm text-gray-500">No sign-ins yet.</p>
              ) : null}
            </>
          ) : (
            <p className="mt-4 text-sm text-red">Unable to load analytics.</p>
          )}
        </section>

        <section className="space-y-6">
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
                    <div className="text-sm font-medium text-gray-500">
                      {item.label}
                    </div>
                    <div className="text-sm font-mono text-gray-900">
                      {item.value}
                    </div>
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

  const point = payload[0]?.payload as ChartPoint | undefined;
  if (!point) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-3 py-2 text-xs text-gray-700 shadow-sm">
      <div className="mb-1 text-gray-500">{label}</div>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span>New users</span>
          <span className="font-semibold text-gray-900">{point.new}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Returning users</span>
          <span className="font-semibold text-gray-900">{point.returning}</span>
        </div>
      </div>
    </div>
  );
}

function buildChartData(points: AnalyticsPoint[]): ChartPoint[] {
  const normalized = points.map((point) => ({
    ...point,
    total: point.new + point.returning
  }));

  if (normalized.length >= 7) {
    return normalized;
  }

  const byDate = new Map<string, ChartPoint>();
  for (const point of normalized) {
    byDate.set(point.date, point);
  }

  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const result: ChartPoint[] = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(end);
    day.setUTCDate(end.getUTCDate() - offset);
    const key = day.toISOString().split("T")[0];
    result.push(
      byDate.get(key) ?? {
        date: key,
        new: 0,
        returning: 0,
        total: 0
      }
    );
  }

  return result;
}
