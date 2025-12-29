import { redirect } from "next/navigation";

import { EmbedStep } from "@/components/onboarding/embed-step";
import { OnboardingShell } from "@/components/onboarding/step-shell";
import { getAccountForSession } from "@/lib/account";

export default async function EmbedOnboardingPage() {
  const account = await getAccountForSession();
  if (!account) {
    redirect("/");
  }
  if (!account.adminApiKey) {
    redirect("/onboarding/admin-key");
  }
  if (!account.googleOauthConfigured) {
    redirect("/onboarding/google");
  }

  const baseUrl =
    process.env.TRIVET_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return (
    <OnboardingShell
      step="4 of 4"
      title="Add sign-in to your website"
      description="Pick the integration method that best fits your Ghost setup."
    >
      <EmbedStep baseUrl={baseUrl} />
    </OnboardingShell>
  );
}
