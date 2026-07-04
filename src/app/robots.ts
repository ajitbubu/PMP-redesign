import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated portal areas hold personal data — keep them out of the index.
      disallow: ["/dashboard", "/consent", "/preferences", "/rights", "/pia", "/profile"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
