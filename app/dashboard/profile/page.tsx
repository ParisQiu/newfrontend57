import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Profile | StudySmarter",
  description: "View and manage your profile",
};

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <ProfileClient />
    </DashboardLayout>
  );
}
