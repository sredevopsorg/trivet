import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SettingsClient } from "@/components/settings/settings-client";
import { getAccountForSession } from "@/lib/account";

export const metadata: Metadata = {
  title: "Settings"
};

export default async function SettingsPage() {
  const account = await getAccountForSession();
  if (!account) {
    redirect("/");
  }

  return <SettingsClient email={account.email} name={account.name} />;
}
