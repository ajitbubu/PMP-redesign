import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConsentWorkspace } from "@/components/sections/consent/consent-workspace";
import { consentGroups, getConsentGroup } from "@/lib/data/consents";
import { requireFeature } from "@/lib/flags/server";
import { FLAGS } from "@/lib/flags/keys";

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
  await requireFeature(FLAGS.UCM_ENABLE_CONSENT);
  const { group: slug } = await params;
  const group = getConsentGroup(slug);

  if (!group) {
    notFound();
  }

  return <ConsentWorkspace group={group} />;
}
