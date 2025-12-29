import { redirect } from "next/navigation";

import { GoogleStep } from "@/components/onboarding/google-step";
import { OnboardingShell } from "@/components/onboarding/step-shell";
import { getAccountForSession } from "@/lib/account";

export default async function GoogleOnboardingPage() {
  const account = await getAccountForSession();
  if (!account) {
    redirect("/");
  }
  if (!account.adminApiKey) {
    redirect("/onboarding/admin-key");
  }

  const defaultMode = account.googleOauthClientId ? "custom" : "trivet";

  return (
    <OnboardingShell
      step="3 of 4"
      title="Set up Google sign-in"
      description="Choose Trivet branded or bring your own Google OAuth credentials."
    >
      <GoogleStep
        defaultMode={defaultMode}
        defaultClientId={account.googleOauthClientId}
        defaultClientSecret={account.googleOauthClientSecret}
      />
    </OnboardingShell>
  );
}
