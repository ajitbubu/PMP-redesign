import { LayoutGrid } from "lucide-react";
import { ConsentIcon, PreferencesIcon, DparIcon, PiaIcon } from "@/components/shared/nav-icons";
import { FLAGS } from "@/lib/flags/keys";
import type { NavItem, CurrentUser } from "@/lib/types";

/**
 * Primary navigation. A single "DPAR" rail entry covers the rights section: it
 * shares the `RightsModule` implementation with DSAR and keeps distinct
 * routes/audit trails, but only DPAR is surfaced in the rail (the /rights/dsar
 * route still exists and is highlighted under DPAR via `matches`). Icons are the
 * design glyphs from `public/*-icon.svg` (see `nav-icons.tsx`); Dashboard keeps
 * lucide's LayoutGrid as no matching asset exists.
 */
export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  {
    label: "Consent",
    href: "/consent",
    icon: ConsentIcon,
    matches: ["/consent/"],
    flag: FLAGS.UCM_ENABLE_CONSENT,
  },
  {
    label: "Preferences",
    href: "/preferences",
    icon: PreferencesIcon,
    matches: ["/preferences/"],
    flag: FLAGS.UCM_ENABLE_PREFERENCE,
  },
  {
    label: "DPAR",
    href: "/rights/dpar",
    icon: DparIcon,
    matches: ["/rights/dsar", "/rights/"],
    flag: FLAGS.DSAR_ENABLE_DSAR,
  },
  {
    label: "PIA",
    href: "/pia",
    icon: PiaIcon,
    matches: ["/pia/"],
    flag: FLAGS.PIA_ENABLE_PIA,
  },
];

/**
 * Filter nav entries by their feature flag. Unflagged items (e.g. Dashboard)
 * are always visible; flagged items appear only when `isEnabled` returns true,
 * so a disabled or unknown flag hides the entry (fail closed).
 */
export function visibleNavItems(
  isEnabled: (flag: string) => boolean,
  items: NavItem[] = navItems,
): NavItem[] {
  return items.filter((item) => !item.flag || isEnabled(item.flag));
}

export const currentUser: CurrentUser = {
  firstName: "Jane",
  fullName: "Jane Doe",
  shortName: "Jane D.",
  avatarUrl: "https://i.pravatar.cc/128?img=47",
};
