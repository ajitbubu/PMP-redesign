import type { Metadata } from "next";
import { RightsModule } from "@/components/sections/rights/rights-module";

export const metadata: Metadata = {
  title: "DPAR — Data Principal Requests",
  description: "Track your Data Principal access requests.",
};

export default function DparPage() {
  return <RightsModule kind="dpar" />;
}
