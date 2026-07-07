import type { Metadata } from "next";
import { ConsentWorkspace } from "@/components/sections/consent/consent-workspace";
import { consentGroups } from "@/lib/data/consents";
import { requireFeature } from "@/lib/flags/server";
import { FLAGS } from "@/lib/flags/keys";

export const metadata: Metadata = {
  title: "Manage Consent",
  description: "Review and adjust how your data is processed across services.",
};

export default async function ConsentPage() {
  await requireFeature(FLAGS.UCM_ENABLE_CONSENT);
  // No group in the URL — default to the first group so the workspace always
  // shows a selected detail (matches the mockup, where a group is preselected).
  return <ConsentWorkspace group={consentGroups[0]!} />;
}
