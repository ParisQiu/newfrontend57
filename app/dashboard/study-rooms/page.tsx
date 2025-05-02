import type { Metadata } from "next"
import React, { Suspense } from 'react';
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import StudyRoomsListClient from "@/components/dashboard/StudyRoomsListClient"

export const metadata: Metadata = {
  title: "Study Rooms | StudySmarter",
  description: "Browse and join study rooms",
}

export default function StudyRoomsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading study rooms...</div>}>
        <StudyRoomsListClient />
      </Suspense>
    </DashboardLayout>
  )
}
