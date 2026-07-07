import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AssessmentsTable } from "@/components/sections/pia/assessments-table";
import { requireFeature } from "@/lib/flags/server";
import { FLAGS } from "@/lib/flags/keys";

export const metadata: Metadata = {
  title: "My Assessments",
  description: "Privacy Impact Assessments",
};

export default async function MyAssessmentsPage() {
  await requireFeature(FLAGS.PIA_ENABLE_PIA);
  return (
    <PageContainer
      title="My Assessments"
      subtitle="Privacy Impact Assessments"
      actions={
        <Button asChild variant="default">
          <Link href="/pia">Dashboard</Link>
        </Button>
      }
    >
      <Card className="p-6">
        <AssessmentsTable />
      </Card>
    </PageContainer>
  );
}
