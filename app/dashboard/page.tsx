import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getAccountForSession } from "@/lib/account";

export const metadata: Metadata = {
  title: "Dashboard"
};

export default async function DashboardPage() {
  const account = await getAccountForSession();
  if (!account) {
    redirect("/");
  }
  if (!account.blogHost) {
    redirect("/onboarding/blog");
  }
  if (!account.adminApiKey) {
    redirect("/onboarding/admin-key");
  }
  if (!account.googleOauthConfigured) {
    redirect("/onboarding/google");
  }

  return <DashboardClient />;
}
