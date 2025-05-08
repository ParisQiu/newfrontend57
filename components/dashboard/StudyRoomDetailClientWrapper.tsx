"use client";
import StudyRoomDetail from "@/components/dashboard/study-room-detail";

export default function StudyRoomDetailClientWrapper({ roomId }: { roomId: string }) {
  return <StudyRoomDetail roomId={roomId} />;
}
