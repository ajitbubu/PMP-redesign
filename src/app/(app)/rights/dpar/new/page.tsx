import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { SubmitRequestForm } from "@/components/sections/rights/submit-request-form";
import { requireFeature } from "@/lib/flags/server";
import { FLAGS } from "@/lib/flags/keys";

export const metadata: Metadata = {
  title: "Submit DPR",
  description: "Submit a new Data Principal access request.",
};

export default async function NewDparPage() {
  await requireFeature(FLAGS.DSAR_ENABLE_DSAR);
  return (
    <PageContainer
      title="Submit DPR"
      subtitle="Tell us what you'd like to do with your personal data, we'll handle the rest."
      actions={
        <Button asChild variant="outline">
          <Link href="/rights/dpar">View My DPR(s)</Link>
        </Button>
      }
    >
      <SubmitRequestForm kind="dpar" />
    </PageContainer>
  );
}
