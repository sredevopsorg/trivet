import type { Metadata } from "next";

import { AuthRedirect } from "@/components/auth-redirect";
import { Footer } from "@/components/site/footer";
import { HomeHero } from "@/components/site/home-hero";

export const metadata: Metadata = {
  title: "Free Google sign-in for Ghost blogs",
  description: "Give Ghost members Google sign-in without magic links."
};

export default function HomePage({
  searchParams
}: {
  searchParams?: { toast?: string | string[] };
}) {
  const toast =
    typeof searchParams?.toast === "string" ? searchParams.toast : null;

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col justify-between">
      <AuthRedirect />
      <HomeHero
        googleClientId={process.env.GOOGLE_OAUTH_CLIENT_ID ?? ""}
        toast={toast}
      />
      <Footer />
    </main>
  );
}
