import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { Card } from "@/components/ui/card";
import { PrivacySearch } from "@/components/sections/dashboard/privacy-search";
import { SuggestedActions } from "@/components/sections/dashboard/suggested-actions";
import { QuickNotifications } from "@/components/sections/dashboard/quick-notifications";
import { ConsentNoticeDialog } from "@/components/sections/dashboard/consent-notice-dialog";
import { PrivacyHeroArt } from "@/components/shared/privacy-hero-art";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your privacy rights at a glance.",
};

export default function DashboardPage() {
  return (
    <PageContainer>
      <Card className="rounded-xl border-transparent bg-brand-50/60 p-6 shadow-sm lg:p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-bold text-brand-600 lg:text-4xl">
              Let&apos;s help you with your Privacy Rights
            </h1>
            <div className="mt-6">
              <PrivacySearch />
            </div>
          </div>
          <PrivacyHeroArt aria-hidden className="hidden w-56 shrink-0 lg:block" />
        </div>
        <p className="mt-8 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Suggested Actions
        </p>
        <div className="mt-4">
          <SuggestedActions />
        </div>
      </Card>

      <h2 className="mb-4 mt-8 font-display text-xl font-bold">Quick Notification</h2>
      <QuickNotifications />

      <ConsentNoticeDialog />
    </PageContainer>
  );
}
