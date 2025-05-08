import type { Metadata } from "next";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import StudyRoomDetailClientWrapper from '@/components/dashboard/StudyRoomDetailClientWrapper';

type Props = {
  params: { id: string }
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  return {
    title: `Study Room ${id} | StudySmarter`,
    description: "Join and collaborate in a study room",
  };
}

export default async function StudyRoomPage(props: Props) {
  const { id } = await props.params;
  return (
    <DashboardLayout>
      <StudyRoomDetailClientWrapper roomId={id} />
    </DashboardLayout>
  );
}
