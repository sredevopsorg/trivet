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
      step="1 of 4"
      title="What's the link to your blog?"
      description="We'll verify the site and find your Ghost admin panel."
    >
      <BlogStep defaultValue={account.blogHost ?? "https://contraption.co/"} />
    </OnboardingShell>
  );
}
