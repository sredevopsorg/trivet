import { headers } from "next/headers";
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

  const headerList = headers();
  const host =
    headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const baseUrl =
    process.env.TRIVET_PUBLIC_BASE_URL ?? `${protocol}://${host}`;

  return (
    <OnboardingShell
      step={4}
      title="Add sign-in to your website"
    >
      <EmbedStep baseUrl={baseUrl} />
    </OnboardingShell>
  );
}
