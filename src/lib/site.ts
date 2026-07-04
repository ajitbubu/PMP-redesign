/** Central site configuration used by metadata, sitemap and robots. */
export const siteConfig = {
  name: "ID-PRIVACY® Privacy Management Portal",
  shortName: "ID-PRIVACY® PMP",
  vendor: "DataSafeguard",
  description:
    "Manage your consent, communication preferences, data rights requests and privacy impact assessments in one place — ID-PRIVACY®, powered by DataSafeguard.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pmp.datasafeguard.ai",
  ogImage: "/og.png",
} as const;

export type SiteConfig = typeof siteConfig;
