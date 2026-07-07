import type { Metadata } from "next";
import { RightsModule } from "@/components/sections/rights/rights-module";
import { requireFeature } from "@/lib/flags/server";
import { FLAGS } from "@/lib/flags/keys";

export const metadata: Metadata = {
  title: "DPAR — Data Principal Requests",
  description: "Track your Data Principal access requests.",
};

export default async function DparPage() {
  await requireFeature(FLAGS.DSAR_ENABLE_DSAR);
  return <RightsModule kind="dpar" />;
}
