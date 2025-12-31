import { cn } from "@/lib/utils";

export function OnboardingShell({
  title,
  step,
  children
}: {
  title: string;
  step: number;
  children: React.ReactNode;
}) {
  const steps = ["Blog", "Admin key", "Google", "Embed"];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl">
        <ol
          className="flex items-center justify-center"
          aria-label="Onboarding progress"
        >
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isComplete = stepNumber <= step;
            const isActive = stepNumber === step;
            return (
              <li key={label} className="flex items-center">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full border-2 border-black",
                    isComplete && "bg-black"
                  )}
                  aria-current={isActive ? "step" : undefined}
                />
                <span className="sr-only">
                  {`Step ${stepNumber}: ${label}`}
                </span>
                {stepNumber < steps.length ? (
                  <span className="h-0.5 w-10 bg-black" aria-hidden="true" />
                ) : null}
              </li>
            );
          })}
        </ol>
        <div className="mt-10 text-center">
          <h1 className="text-2xl font-semibold text-gray-950">{title}</h1>
        </div>
        <div className="mt-8 mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
