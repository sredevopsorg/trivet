import { headers } from "next/headers";
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

  const headerList = headers();
  const host =
    headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const baseUrl =
    process.env.TRIVET_PUBLIC_BASE_URL ?? `${protocol}://${host}`;

  const defaultMode = account.googleOauthConfigured
    ? account.googleOauthClientId
      ? "custom"
      : "trivet"
    : "custom";
  const blogOrigin = account.blogHost ?? baseUrl;

  return (
    <OnboardingShell
      step={3}
      title="Set up Google sign-in"
    >
      <GoogleStep
        defaultMode={defaultMode}
        defaultClientId={account.googleOauthClientId}
        defaultClientSecret={account.googleOauthClientSecret}
        baseUrl={baseUrl}
        blogOrigin={blogOrigin}
      />
    </OnboardingShell>
  );
}
