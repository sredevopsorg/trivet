import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Footer } from "@/components/site/footer";
import { HomeHero } from "@/components/site/home-hero";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Free Google sign-in for Ghost blogs",
  description: "Give Ghost members Google sign-in without magic links."
};

export default async function HomePage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col justify-between">
      <HomeHero googleClientId={process.env.GOOGLE_OAUTH_CLIENT_ID ?? ""} />
      <Footer />
    </main>
  );
}
