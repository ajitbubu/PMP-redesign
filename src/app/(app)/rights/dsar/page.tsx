import type { Metadata } from "next";
import { RightsModule } from "@/components/sections/rights/rights-module";

export const metadata: Metadata = {
  title: "DSAR — Data Subject Requests",
  description: "Track your Data Subject access requests.",
};

export default function DsarPage() {
  return <RightsModule kind="dsar" />;
}
