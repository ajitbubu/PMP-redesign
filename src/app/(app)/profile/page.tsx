import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { ProfileForm } from "@/components/sections/profile/profile-form";

export const metadata: Metadata = {
  title: "User Profile",
  description: "Your personal information and account security settings.",
};

export default function ProfilePage() {
  return (
    <PageContainer
      title="User Profile"
      subtitle="Review and adjust how your data is processed across services."
    >
      <ProfileForm />
    </PageContainer>
  );
}
