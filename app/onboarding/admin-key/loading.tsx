import { OnboardingShell } from "@/components/onboarding/step-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminKeyOnboardingLoading() {
  return (
    <OnboardingShell
      step="2 of 4"
      title="Create a new integration for Trivet"
      description="Paste the Admin API key so Trivet can create members for you."
    >
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </OnboardingShell>
  );
}
