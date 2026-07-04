import { LayoutGrid, ShieldCheck, SlidersHorizontal, UserRoundCog, ShieldAlert } from "lucide-react";
import type { NavItem, CurrentUser } from "@/lib/types";

/**
 * Primary navigation. Five entries match the Figma chrome. "Data Rights"
 * covers both DPAR and DSAR — per the design-review decision they share one
 * implementation but keep separate routes/audit trails, switched inside the
 * module (matches the dense 5-item rail in the mockups).
 */
export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  {
    label: "Consent",
    href: "/consent",
    icon: ShieldCheck,
    matches: ["/consent/"],
  },
  {
    label: "Preferences",
    href: "/preferences",
    icon: SlidersHorizontal,
    matches: ["/preferences/"],
  },
  {
    label: "Data Rights",
    href: "/rights/dpar",
    icon: UserRoundCog,
    matches: ["/rights/dsar", "/rights/"],
  },
  {
    label: "PIA",
    href: "/pia",
    icon: ShieldAlert,
    matches: ["/pia/"],
  },
];

export const currentUser: CurrentUser = {
  firstName: "Jane",
  fullName: "Jane Doe",
  shortName: "Jane D.",
  avatarUrl: "https://i.pravatar.cc/128?img=47",
};
