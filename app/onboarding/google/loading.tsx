import { OnboardingShell } from "@/components/onboarding/step-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function GoogleOnboardingLoading() {
  return (
    <OnboardingShell
      step="3 of 4"
      title="Set up Google sign-in"
      description="Choose Trivet branded or bring your own Google OAuth credentials."
    >
      <div className="space-y-6">
        <Skeleton className="h-11 w-72 rounded-full" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </OnboardingShell>
  );
}
