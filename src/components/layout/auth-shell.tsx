import { IdPrivacyHero } from "@/components/shared/id-privacy-hero";
import { PoweredByDataSafeguard } from "@/components/shared/datasafeguard-wordmark";

/**
 * Auth layout. Figma only ships mobile auth frames, so the desktop adaptation
 * (proposed in the plan) is a two-column split: brand hero left, form right.
 * Mobile keeps the stacked hero-over-card layout from the mockups.
 */
export function AuthShell({
  heading,
  description,
  footer,
  children,
}: {
  heading: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand hero */}
      <div className="auth-hero-gradient flex items-center justify-center px-6 pb-16 pt-14 lg:min-h-dvh lg:py-16">
        <IdPrivacyHero />
      </div>

      {/* Form panel */}
      <main className="-mt-8 rounded-t-[2rem] bg-card px-6 pb-10 pt-8 shadow-xl lg:mt-0 lg:flex lg:items-center lg:rounded-none lg:px-12 lg:shadow-none">
        <div className="mx-auto w-full max-w-md">
          <div className="flex justify-center lg:justify-start">
            <PoweredByDataSafeguard />
          </div>
          <div className="mt-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
              {heading}
            </h2>
            {description ? (
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <div className="mt-8">{children}</div>
          {footer ? (
            <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
