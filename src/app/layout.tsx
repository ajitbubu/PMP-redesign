import type { Metadata, Viewport } from "next";
import { Inter, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteConfig } from "@/lib/site";
import { AnalyticsPageView } from "@/components/analytics/analytics-page-view";
import { FlagsProvider, Flag, FLAGS } from "@/lib/flags";
import { loadFlags } from "@/lib/flags/load-flags.server";
import { CookieConsentBanner } from "@/components/features/cookie-consent-banner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  keywords: [
    "privacy management",
    "consent management",
    "DPDP",
    "GDPR",
    "data subject access request",
    "privacy impact assessment",
    "DataSafeguard",
    "ID-PRIVACY",
  ],
  authors: [{ name: siteConfig.vendor }],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.shortName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#092339",
  width: "device-width",
  initialScale: 1,
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load flags server-side and seed the provider so gated UI is correct on the
  // first paint — no flash, no client-side loading gate for the initial render.
  const initialFlags = await loadFlags();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <FlagsProvider initial={initialFlags}>
          {children}
          {/* Example gated feature: only mounts when `ucm.enable_cookie` is on. */}
          <Flag name={FLAGS.UCM_ENABLE_COOKIE}>
            <CookieConsentBanner />
          </Flag>
        </FlagsProvider>
        {gaId ? (
          <>
            <GoogleAnalytics gaId={gaId} />
            <AnalyticsPageView gaId={gaId} />
          </>
        ) : null}
      </body>
    </html>
  );
}
