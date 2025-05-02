'use client';
import Link from "next/link"
import { Plus, Users } from "lucide-react"
import React, { Suspense, useEffect, useState } from 'react';
import StudyRoomsListClient from './StudyRoomsListClient';

export default function StudyRooms() {
  const [studyRooms, setStudyRooms] = useState<{ id: string; name: string; room_id: number; subject: string; capacity: number; description: string; date: string; start_time: string; end_time: string; participants: number; location: string; host: string; mode: string }[]>([]);
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
        <Suspense fallback={<p>Loading study rooms list…</p>}>
          <StudyRoomsListClient studyRooms={studyRooms} loading={loading} error={error} />
        </Suspense>
      </div>
    </div>
  )
}
