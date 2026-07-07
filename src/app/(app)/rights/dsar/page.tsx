import type { Metadata } from "next";
import { RightsModule } from "@/components/sections/rights/rights-module";
import { requireFeature } from "@/lib/flags/server";
import { FLAGS } from "@/lib/flags/keys";

export const metadata: Metadata = {
  title: "DSAR — Data Subject Requests",
  description: "Track your Data Subject access requests.",
};

export default async function DsarPage() {
  await requireFeature(FLAGS.DSAR_ENABLE_DSAR);
  return <RightsModule kind="dsar" />;
}
