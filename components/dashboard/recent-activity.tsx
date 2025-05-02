"use client";
import Link from "next/link"
import { useState } from "react";
import { ArrowRight, BookOpen, FileText, Users, Video } from "lucide-react"
import ActivityModal from "../ActivityModal"

export default function RecentActivity() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDetails, setModalDetails] = useState("");

  const handleResumeClick = (activity: typeof activities[0]) => {
    setModalTitle(activity.title);
    setModalDetails(
      `Course: ${activity.course}\nType: ${activity.type}\nLast Active: ${activity.time}`
    );
    setModalOpen(true);
  };

  const activities = [
    {
      id: 1,
      type: "note",
      title: "Cell Biology Notes",
      course: "Biology 101",
      time: "2 hours ago",
      icon: FileText,
      color: "text-blue-600 bg-blue-100",
    },
    {
      id: 2,
      type: "video",
      title: "Introduction to Psychology",
      course: "PSY 101",
      time: "Yesterday",
      icon: Video,
      color: "text-red-600 bg-red-100",
    },
    {
      id: 3,
      type: "study_room",
      title: "Calculus Study Group",
      course: "Math 201",
      time: "2 days ago",
      icon: Users,
      color: "text-green-600 bg-green-100",
    },
    {
      id: 4,
      type: "course",
      title: "Physics Fundamentals",
      course: "PHY 101",
      time: "3 days ago",
      icon: BookOpen,
      color: "text-purple-600 bg-purple-100",
    },
  ]

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm dark:text-white">
      <ActivityModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} details={modalDetails} />
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center rounded-md border p-3 hover:bg-gray-50">
              <div className={`mr-3 flex h-10 w-10 items-center justify-center rounded-md ${activity.color}`}>
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium">{activity.title}</h3>
                <p className="text-sm text-gray-500">
                  {activity.course} • {activity.time}
                </p>
              </div>
              <button
                type="button"
                className="ml-2 flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                onClick={() => handleResumeClick(activity)}
              >
                Resume
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
