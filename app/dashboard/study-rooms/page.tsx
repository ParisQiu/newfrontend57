import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import StudyRoomsList from "@/components/dashboard/study-rooms-list"

export const metadata: Metadata = {
  title: "Study Rooms | StudySmarter",
  description: "Browse and join study rooms",
}

export default function StudyRoomsPage() {
  return (
    <DashboardLayout>
      <StudyRoomsList />
    </DashboardLayout>
  )
}
