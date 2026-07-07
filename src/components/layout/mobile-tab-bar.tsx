"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { visibleNavItems } from "@/lib/data/nav";
import { isNavActive } from "@/components/layout/app-sidebar";
import { useFlags } from "@/lib/flags/provider";
import { cn } from "@/lib/utils";

/** Fixed bottom tab bar for mobile/tablet (hidden at lg+). Touch targets ≥44px. */
export function MobileTabBar() {
  const pathname = usePathname();
  const { isEnabled } = useFlags();
  const items = visibleNavItems(isEnabled);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-sidebar-border bg-sidebar px-1 pb-[env(safe-area-inset-bottom)] pt-1.5 text-sidebar-foreground lg:hidden"
    >
      {items.map((item) => {
        const active = isNavActive(item, pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-[52px] min-w-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              active ? "text-sidebar-primary" : "text-sidebar-foreground/70",
            )}
          >
            <Icon className="size-5" />
            <span className="leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
