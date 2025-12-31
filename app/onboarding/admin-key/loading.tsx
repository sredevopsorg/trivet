import { OnboardingShell } from "@/components/onboarding/step-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminKeyOnboardingLoading() {
  return (
    <OnboardingShell
      step={2}
      title="Create a new integration for Trivet"
    >
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
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
