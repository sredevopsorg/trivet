import { OnboardingShell } from "@/components/onboarding/step-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogOnboardingLoading() {
  return (
    <OnboardingShell
      step="1 of 4"
      title="What's the link to your blog?"
      description="We'll verify the site and find your Ghost admin panel."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </OnboardingShell>
  );
}
