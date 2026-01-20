import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.TRIVET_PUBLIC_BASE_URL ?? "https://trivet.sredevops.org";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/settings", "/onboarding/"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
