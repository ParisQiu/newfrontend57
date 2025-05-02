import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import StudyRoomDetail from "@/components/dashboard/study-room-detail"

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  // Get the room ID from params
  const params = await props.params
  const roomId = params.id

  return {
    title: `Study Room ${roomId} | StudySmarter`,
    description: "Join and collaborate in a study room",
  }
}

export default async function StudyRoomPage(props: Props) {
  const params = await props.params
  const roomId = params.id
  
  return (
    <DashboardLayout>
      <StudyRoomDetail roomId={roomId} />
    </DashboardLayout>
  )
}
