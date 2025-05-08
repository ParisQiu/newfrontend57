import React, { Suspense } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import StudyRooms from "@/components/dashboard/study-rooms";
import StudyRoomsClient from "../StudyRoomsClient";

export default function AllRoomsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading all study rooms...</div>}>
        <StudyRoomsClient />
      </Suspense>
    </DashboardLayout>
  );
}
