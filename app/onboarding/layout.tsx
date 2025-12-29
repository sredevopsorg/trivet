import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";

export default async function OnboardingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return <div className="min-h-[calc(100vh-4rem)]">{children}</div>;
}
