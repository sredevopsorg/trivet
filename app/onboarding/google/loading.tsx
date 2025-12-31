import { OnboardingShell } from "@/components/onboarding/step-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function GoogleOnboardingLoading() {
  return (
    <OnboardingShell
      step={3}
      title="Set up Google sign-in"
    >
      <div className="space-y-6">
        <Skeleton className="h-11 w-72 rounded-full" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="flex justify-center">
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </OnboardingShell>
  );
}
