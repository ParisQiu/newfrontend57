'use client';
import Link from "next/link"
import { Plus, Users } from "lucide-react"

import { useEffect, useState } from "react";

export default function StudyRooms() {
  const [studyRooms, setStudyRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudyRooms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view study rooms.");
          setLoading(false);
          return;
        }
        const response = await fetch("https://studysmarterapp.onrender.com/api/study_rooms", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch study rooms");
        const data = await response.json();
        const rooms = Array.isArray(data) ? data : data.rooms || [];
        const roomMetadata = JSON.parse(localStorage.getItem('roomMetadata') || '{}');
        const normalizedRooms = rooms.map((room: any) => {
          const metadata = roomMetadata[room.room_id] || {};
          return {
            room_id: room.room_id || 0,
            id: room.id || `room-${room.room_id || Math.random().toString(36).substr(2, 9)}`,
            name: room.name || "Unnamed Room",
            subject: room.subject || "",
            capacity: room.capacity || 0,
            description: room.description || "No description available",
            date: metadata.date || "",
            start_time: metadata.start_time || "",
            end_time: metadata.end_time || "",
            participants: room.participants || 0,
            location: metadata.location || "",
            host: room.host || "Anonymous",
            mode: metadata.mode || "hybrid"
          };
        });
        setStudyRooms(normalizedRooms);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setLoading(false);
      }
    };
    fetchStudyRooms();
  }, []);

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm dark:text-white mb-6">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold dark:text-white">Join a Study Room</h2>
        <Link
          href="/dashboard/study-rooms/create"
          className="flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="mr-1 h-4 w-4" />
          Create Room
        </Link>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading study rooms...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <>
            <div className="space-y-3">
              {studyRooms.slice(0, 3).map((room) => (
                <div key={room.room_id} className="rounded-md border p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{room.name}</h3>
                      <p className="text-sm text-gray-500">{room.subject}</p>
                    </div>
                    <Link
                      href={`/dashboard/study-rooms/${room.room_id}`}
                      className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-200"
                    >
                      Join
                    </Link>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Users className="mr-1 h-4 w-4" />
                    <span>
                      {room.participants}/{room.capacity} participants
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    <div><span className="font-medium">Date:</span> {room.date || 'N/A'}</div>
                    <div><span className="font-medium">Time:</span> {room.start_time || 'N/A'} - {room.end_time || 'N/A'}</div>
                    <div><span className="font-medium">Venue:</span> {room.location || 'N/A'}</div>
                    <div><span className="font-medium">Mode:</span> {room.mode}</div>
                  </div>
                </div>
              ))}
              {studyRooms.length === 0 && (
                <div className="text-center text-gray-500 py-8">No study rooms available.</div>
              )}
            </div>
            <div className="mt-4 text-center">
              <Link href="/dashboard/study-rooms" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all study rooms
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
