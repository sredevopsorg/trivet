"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-950">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Track new vs returning sign-ins and manage your configuration.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="space-y-4">
          <div className="text-sm font-semibold">Sign-ins per day</div>
          {analyticsQuery.isLoading ? (
            <Skeleton className="h-64 w-full rounded-3xl" />
          ) : analyticsQuery.data ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsQuery.data} margin={{ top: 10 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="new" stackId="a" fill="#111111" />
                  <Bar dataKey="returning" stackId="a" fill="#B1B1B1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-red">Unable to load analytics.</p>
          )}
        </Card>

        <Card className="space-y-4">
          <div className="text-sm font-semibold">Configuration</div>
          {accountQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : accountQuery.data ? (
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs uppercase text-gray-500">Blog</div>
                <div className="text-gray-900">
                  {accountQuery.data.blogHost ?? "Not set"}
                </div>
                <Link href="/onboarding/blog" className="text-xs">
                  Edit blog URL
                </Link>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500">Admin</div>
                <div className="text-gray-900">
                  {accountQuery.data.adminHost ?? "Not set"}
                </div>
                <Link href="/onboarding/admin-key" className="text-xs">
                  Update Admin API key
                </Link>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500">Google</div>
                <div className="text-gray-900">
                  {accountQuery.data.googleMode === "custom"
                    ? "Custom OAuth"
                    : "Trivet branded"}
                </div>
                <Link href="/onboarding/google" className="text-xs">
                  Update Google settings
                </Link>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500">Embed</div>
                <Link href="/onboarding/embed" className="text-xs">
                  View embed options
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red">Unable to load configuration.</p>
          )}
        </Card>
      </div>
    </main>
  );
}
