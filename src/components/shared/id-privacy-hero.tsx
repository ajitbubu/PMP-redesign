/**
 * ID-PRIVACY® brand hero used on the auth screens. ID-PRIVACY® is the primary,
 * end-user-facing product mark (design-review brand decision); DataSafeguard
 * appears only as a "Powered by" credit on the form card.
 *
 * Artwork: public/login-hero.svg — the Figma DSG/Login export (documents →
 * AI-profile head with DL/ML/AI + CCE® labels → shield, over a circuit grid)
 * with its gradient background stripped, so the pattern sits on the hero's
 * own `.auth-hero-gradient`.
 */
export function IdPrivacyHero() {
  return (
    <div className="flex flex-col items-center text-center text-white">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        ID-PRIVACY<sup className="text-xl">®</sup>
      </h1>
      <p className="mt-1 text-sm font-medium text-white/80">AI Powered Privacy Management</p>

      {/* Decorative — the meaning is carried by the surrounding text.
          Compact on mobile so the form stays reachable; larger on desktop
          where the hero panel has room. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login-hero.svg"
        alt=""
        aria-hidden
        className="my-6 w-full max-w-[260px] sm:max-w-xs lg:my-8 lg:max-w-lg"
      />

      <p className="font-display text-lg font-semibold text-white/95 sm:text-xl">
        Automate&nbsp;:&nbsp;Privacy &amp; Compliance
      </p>
    </div>
  );
}
