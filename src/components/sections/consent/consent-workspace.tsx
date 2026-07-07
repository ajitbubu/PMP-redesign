import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { StatCard } from "@/components/shared/stat-card";
import { ConsentGroupsList } from "@/components/sections/consent/consent-groups-list";
import { ConsentDetail } from "@/components/sections/consent/consent-detail";
import { consentStats, getConsentRecords } from "@/lib/data/consents";
import type { ConsentGroup } from "@/lib/types";

/**
 * Master-detail consent screen: page-level stat tiles, the "Consents" group
 * panel on the left, and the selected group's detail table on the right. Both
 * `/consent` (first group) and `/consent/[group]` render this shell.
 */
export function ConsentWorkspace({ group }: { group: ConsentGroup }) {
  const records = getConsentRecords(group.slug);

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

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ConsentGroupsList selectedSlug={group.slug} />
        </div>

        <div className="min-w-0">
          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/consent" className="text-primary hover:underline">
              Consent
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">{group.name}</span>
          </nav>
          <h2 className="mt-1 font-display text-2xl font-bold text-foreground">{group.name}</h2>
          <ConsentDetail groupName={group.name} records={records} />
        </div>
      </div>
    </PageContainer>
  );
}
