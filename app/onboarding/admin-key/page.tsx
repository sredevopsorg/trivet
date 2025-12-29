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
      step="2 of 4"
      title="Create a new integration for Trivet"
      description="Paste the Admin API key so Trivet can create members for you."
    >
      <AdminKeyStep adminHost={account.adminHost} />
    </OnboardingShell>
  );
}
