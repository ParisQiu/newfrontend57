import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

export default function StudyPlan() {
  const currentPlan = {
    name: "Finals Week Preparation",
    progress: 65,
    daysLeft: 7,
    nextTask: "Review Chapter 8: Cell Biology",
    nextTaskDue: "Today, 4:00 PM",
  }

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm dark:text-white">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold dark:text-white">Current Study Plan</h2>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-medium">{currentPlan.name}</h3>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">{currentPlan.progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${currentPlan.progress}%` }}></div>
          </div>
          <p className="mt-1 text-sm text-gray-500">{currentPlan.daysLeft} days remaining</p>
        </div>

        <div className="mt-4 rounded-md border p-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Next Task</h4>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-1 h-4 w-4" />
              <span>{currentPlan.nextTaskDue}</span>
            </div>
          </div>
          <p className="mt-1 text-sm">{currentPlan.nextTask}</p>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/dashboard/study-plans/current"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Go to Plan
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
