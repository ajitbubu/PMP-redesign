import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PiaAttentionList } from "@/components/sections/pia/pia-attention-list";
import { piaStats, piaAttention } from "@/lib/data/pia";

export const metadata: Metadata = {
  title: "PIA",
  description: "Privacy Impact Assessments tracked across vendors.",
};

export default function PiaDashboardPage() {
  return (
    <PageContainer
      title="PIA"
      subtitle="Privacy Impact Assessments tracked across vendors."
      actions={
        <Button asChild>
          <Link href="/pia/assessments">My Assessments</Link>
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {piaStats.map((tile) => (
          <StatCard key={tile.label} tile={tile} />
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-display font-bold text-foreground">Needs your attention</h2>
          <p className="text-sm text-muted-foreground">
            Sorted by Urgency · {piaAttention.length} items
          </p>
        </CardHeader>
        <CardContent>
          <PiaAttentionList />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
