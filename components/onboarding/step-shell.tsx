import { Card } from "@/components/ui/card";

export function OnboardingShell({
  title,
  description,
  step,
  children
}: {
  title: string;
  description: string;
  step: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-6 text-xs uppercase tracking-[0.3em] text-gray-500">
        Onboarding {step}
      </div>
      <Card>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-950">
            {title}
          </h1>
          <p className="text-sm text-gray-600">
            {description}
          </p>
        </div>
        <div className="mt-6">{children}</div>
      </Card>
    </div>
  );
}
