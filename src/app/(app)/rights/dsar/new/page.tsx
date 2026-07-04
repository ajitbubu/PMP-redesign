import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { SubmitRequestForm } from "@/components/sections/rights/submit-request-form";

export const metadata: Metadata = {
  title: "Submit DSR",
  description: "Submit a new Data Subject access request.",
};

export default function NewDsarPage() {
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
