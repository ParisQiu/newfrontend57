import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import CreateStudyRoomForm from "@/components/dashboard/create-study-room-form"

export const metadata: Metadata = {
  title: "Create Study Room | StudySmarter",
  description: "Create a new study room to collaborate with other students",
}

export default function CreateStudyRoomPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Study Room</h1>
          <p className="mt-1 text-gray-600">Set up a new study room to collaborate with other students</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <CreateStudyRoomForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
