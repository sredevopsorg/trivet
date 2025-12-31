import { redirect } from "next/navigation";

import { BlogStep } from "@/components/onboarding/blog-step";
import { OnboardingShell } from "@/components/onboarding/step-shell";
import { getAccountForSession } from "@/lib/account";

export default async function BlogOnboardingPage() {
  const account = await getAccountForSession();
  if (!account) {
    redirect("/");
  }

  return (
    <OnboardingShell
      step={1}
      title="What's the link to your blog?"
    >
      <BlogStep defaultValue={account.blogHost} />
    </OnboardingShell>
  );
}
