import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { StatCard } from "@/components/shared/stat-card";
import { PreferenceList } from "@/components/sections/preferences/preference-list";
import { preferenceStats } from "@/lib/data/preferences";
import { requireFeature } from "@/lib/flags/server";
import { FLAGS } from "@/lib/flags/keys";

export const metadata: Metadata = {
  title: "Manage Preference",
  description:
    "Review and adjust how your data is processed across services and communication channels.",
};

export default async function PreferencesPage() {
  await requireFeature(FLAGS.UCM_ENABLE_PREFERENCE);
  return (
    <PageContainer
      title="Manage Preference"
      subtitle="Review and adjust how your data is processed across services."
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {preferenceStats.map((tile) => (
          <StatCard key={tile.label} tile={tile} />
        ))}
      </div>

      <h2 className="mb-4 mt-8 font-display text-xl font-bold tracking-tight text-foreground">
        Preference
      </h2>
      <PreferenceList />
    </PageContainer>
  );
}
