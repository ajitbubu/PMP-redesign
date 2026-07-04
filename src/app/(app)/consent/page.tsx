import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { StatCard } from "@/components/shared/stat-card";
import { ConsentGroupsList } from "@/components/sections/consent/consent-groups-list";
import { consentStats } from "@/lib/data/consents";

export const metadata: Metadata = {
  title: "Manage Consent",
  description: "Review and adjust how your data is processed across services.",
};

export default function ConsentPage() {
  return (
    <PageContainer
      title="Manage Consent"
      subtitle="Review and adjust how your data is processed across services."
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {consentStats.map((tile) => (
          <StatCard key={tile.label} tile={tile} />
        ))}
      </div>
      <h2 className="font-display text-xl font-bold mt-8 mb-4">All Consents</h2>
      <ConsentGroupsList />
    </PageContainer>
  );
}
