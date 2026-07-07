import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PreferenceDetail } from "@/components/sections/preferences/preference-detail";
import {
  getPreferenceChannel,
  getPreferenceRecords,
  preferenceChannels,
} from "@/lib/data/preferences";
import { requireFeature } from "@/lib/flags/server";
import { FLAGS } from "@/lib/flags/keys";

type PageProps = { params: Promise<{ channel: string }> };

export function generateStaticParams() {
  return preferenceChannels.map((channel) => ({ channel: channel.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { channel } = await params;
  const found = getPreferenceChannel(channel);
  if (!found) {
    return { title: "Preference Not Found", description: "Unknown preference channel." };
  }
  return {
    title: `${found.name} Preferences`,
    description: `Review consent groups and preference records for the ${found.name} channel.`,
  };
}

export default async function PreferenceChannelPage({ params }: PageProps) {
  await requireFeature(FLAGS.UCM_ENABLE_PREFERENCE);
  const { channel } = await params;
  const found = getPreferenceChannel(channel);
  if (!found) {
    notFound();
  }

  const records = getPreferenceRecords(channel);

  return (
    <PageContainer>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <li>
            <Link
              href="/preferences"
              className="rounded-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Preference
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page" className="font-medium text-foreground">
            {found.name}
          </li>
        </ol>
      </nav>

      <h1 className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {found.name}
      </h1>

      <PreferenceDetail channelName={found.name} records={records} />
    </PageContainer>
  );
}
