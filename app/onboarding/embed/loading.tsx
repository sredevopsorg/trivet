import { OnboardingShell } from "@/components/onboarding/step-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmbedOnboardingLoading() {
  return (
    <OnboardingShell
      step="4 of 4"
      title="Add sign-in to your website"
      description="Pick the integration method that best fits your Ghost setup."
    >
      <div className="space-y-6">
        <Skeleton className="h-11 w-64 rounded-full" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </OnboardingShell>
  );
}
