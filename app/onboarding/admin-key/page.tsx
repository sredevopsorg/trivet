import { redirect } from "next/navigation";

import { AdminKeyStep } from "@/components/onboarding/admin-key-step";
import { OnboardingShell } from "@/components/onboarding/step-shell";
import { getAccountForSession } from "@/lib/account";

export default async function AdminKeyOnboardingPage() {
  const account = await getAccountForSession();
  if (!account) {
    redirect("/");
  }
  if (!account.blogHost || !account.adminHost) {
    redirect("/onboarding/blog");
  }

  return (
    <OnboardingShell
      step={2}
      title="Create a new integration for Trivet"
    >
      <AdminKeyStep
        adminHost={account.adminHost}
        defaultValue={account.adminApiKey}
      />
    </OnboardingShell>
  );
}
