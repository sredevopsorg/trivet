import { OnboardingShell } from "@/components/onboarding/step-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogOnboardingLoading() {
  return (
    <OnboardingShell
      step={1}
      title="What's the link to your blog?"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-11 w-full" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </OnboardingShell>
  );
}
