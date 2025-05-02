import DashboardLayout from "@/components/dashboard/dashboard-layout"
import StudyRooms from "@/components/dashboard/study-rooms"

import UpcomingSchedule from "@/components/dashboard/upcoming-schedule"
/* import TodoReminders from "@/components/dashboard/todo-reminders" */


import Community from "@/components/dashboard/community"


export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* First column - Priority items */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Community />

        </div>

        {/* Second column - Main content */}
        <div className="flex flex-col gap-6 lg:col-span-1">

          <StudyRooms />
        </div>

        {/* Third column - Additional content */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <UpcomingSchedule />


        </div>
      </div>
    </DashboardLayout>
  )
}
