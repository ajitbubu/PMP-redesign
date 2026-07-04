import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { ConsentDetail } from "@/components/sections/consent/consent-detail";
import { consentGroups, getConsentGroup, getConsentRecords } from "@/lib/data/consents";

type ConsentGroupPageProps = {
  params: Promise<{ group: string }>;
};

export function generateStaticParams() {
  return consentGroups.map((group) => ({ group: group.slug }));
}

export async function generateMetadata({
  params,
}: ConsentGroupPageProps): Promise<Metadata> {
  const { group: slug } = await params;
  const group = getConsentGroup(slug);
  return {
    title: group?.name ?? "Consent",
    description: group
      ? `Review and manage consents for ${group.name}.`
      : "Review and manage consents.",
  };
}

export default async function ConsentGroupPage({ params }: ConsentGroupPageProps) {
  const { group: slug } = await params;
  const group = getConsentGroup(slug);

  if (!group) {
    notFound();
  }

  return (
    <PageContainer>
      <nav className="mb-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/consent" className="text-primary hover:underline">
          Consent
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">{group.name}</span>
      </nav>
      <h1 className="font-display text-2xl font-bold">{group.name}</h1>
      <ConsentDetail groupName={group.name} records={getConsentRecords(slug)} />
    </PageContainer>
  );
}
