/**
 * Central registry of every feature-flag key. Import from here so usage stays
 * consistent and greppable — never scatter raw "module.flag" strings across the
 * app. Keys are "<module>.<flag>" and map 1:1 to the flat `features` object in
 * the published config (see `flags.local.json` / the CDN JSON).
 *
 * A key living here does NOT mean the feature is on — the config decides that,
 * and anything missing from the config is treated as OFF (fail closed).
 */
export const FLAGS = {
  // ── Cookie consent ──
  /** UCM cookie-consent banner + its endpoint. */
  UCM_ENABLE_COOKIE: "ucm.enable_cookie",
  /**
   * Kill-switch for the "We value your privacy" banner UI. When `true`, the
   * banner is hidden even if `ucm.enable_cookie` is on — an independent lever to
   * suppress the banner without disabling the cookie-consent endpoint. Absent =
   * not disabled (banner shows as normal).
   */
  UCM_DISABLE_PRIVACY_BANNER: "ucm.disable_privacy_banner",
  /** Number of days a cookie choice is retained (numeric flag, read via getValue). */
  UCM_COOKIE_TTL_DAYS: "ucm.cookie_ttl_days",

  // ── Critical modules: gate the nav entry (UX) AND the route (server-enforced) ──
  /** Consent management — "Consent" nav + `/consent` routes. */
  UCM_ENABLE_CONSENT: "ucm.enable_consent",
  /** Preference management — "Preferences" nav + `/preferences` routes. */
  UCM_ENABLE_PREFERENCE: "ucm.enable_preference",
  /** Data rights (DPAR/DSAR) — "DPAR" nav + `/rights/*` routes. */
  DSAR_ENABLE_DSAR: "dsar.enable_dsar",
  /** Privacy Impact Assessment — "PIA" nav + `/pia` routes. */
  PIA_ENABLE_PIA: "pia.enable_pia",
  /** User profile — the user-menu link + `/profile` route. */
  PROFILE_ENABLE_PROFILE: "profile.enable_profile",

  // Note: the Dashboard (`/dashboard`) is intentionally NOT gated — it's the
  // post-login landing (see otp-form.tsx), so it must always stay reachable.
} as const;

/** Union of the declared flag keys. `isEnabled`/`getValue` also accept raw strings. */
export type FlagKey = (typeof FLAGS)[keyof typeof FLAGS];
