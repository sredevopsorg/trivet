"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Client-side component that redirects authenticated users to the dashboard.
 * Used on the homepage to allow static rendering while still handling auth redirects.
 */
export function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/session");
        const data = (await response.json()) as { authenticated: boolean };
        if (data.authenticated) {
          router.replace("/dashboard");
        }
      } catch {
        // Silently fail - user stays on homepage
      }
    };

    void checkAuth();
  }, [router]);

  return null;
}
