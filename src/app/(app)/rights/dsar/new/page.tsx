import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { SubmitRequestForm } from "@/components/sections/rights/submit-request-form";
import { requireFeature } from "@/lib/flags/server";
import { FLAGS } from "@/lib/flags/keys";

export const metadata: Metadata = {
  title: "Submit DSR",
  description: "Submit a new Data Subject access request.",
};

export default async function NewDsarPage() {
  await requireFeature(FLAGS.DSAR_ENABLE_DSAR);
  return (
    <PageContainer
      title="Submit DSR"
      subtitle="Tell us what you'd like to do with your personal data, we'll handle the rest."
      actions={
        <Button asChild variant="outline">
          <Link href="/rights/dsar">View My DSR(s)</Link>
        </Button>
      }
    >
      <SubmitRequestForm kind="dsar" />
    </PageContainer>
  );
}
