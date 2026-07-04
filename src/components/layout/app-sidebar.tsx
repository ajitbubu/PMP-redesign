"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/data/nav";
import type { NavItem } from "@/lib/types";
import { BrandLogo } from "@/components/shared/brand-logo";
import { cn } from "@/lib/utils";

export function isNavActive(item: NavItem, pathname: string): boolean {
  if (pathname === item.href) return true;
  if (pathname.startsWith(item.href + "/")) return true;
  return (item.matches ?? []).some((m) => pathname === m || pathname.startsWith(m));
}

/** Desktop navy sidebar (hidden below lg — mobile uses the bottom tab bar). */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-[104px] shrink-0 flex-col items-center bg-sidebar py-6 text-sidebar-foreground lg:flex">
      <Link
        href="/dashboard"
        className="flex items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        aria-label="ID-PRIVACY dashboard"
      >
        <BrandLogo className="size-10" />
      </Link>

      <nav aria-label="Primary" className="mt-8 flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const active = isNavActive(item, pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex w-[72px] flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-5" />
              <span className="text-center leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 px-2 text-center text-[10px] font-medium leading-tight text-sidebar-foreground/60">
        Privacy
        <br />
        Management
        <br />
        Portal
        <span className="mt-1 block font-semibold text-sidebar-foreground/80">V 3.0</span>
      </div>
    </aside>
  );
}
