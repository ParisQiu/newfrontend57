"use client";
import Link from "next/link"
import { Calendar, Plus } from "lucide-react"
import StatusModal from "../StatusModal"

import React, { useState } from "react";

export default function UpcomingSchedule() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const today = new Date()
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    return {
      dayName: days[date.getDay()],
      date: date.getDate(),
      isToday: i === 0,
    }
  })

  const [studyRooms, setStudyRooms] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm dark:text-white">
      <StatusModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} message={modalMessage} />
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">Upcoming Schedule</h2>
        <Link
          href="/dashboard/calendar"
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Event
        </Link>
      </div>
      <div className="p-4">
        <div className="mb-4 flex justify-between">
          {weekDates.map((day, index) => (
            <div
              key={index}
              className={`flex flex-1 flex-col items-center rounded-md p-2 ${
                day.isToday ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              <span className="text-xs font-medium">{day.dayName}</span>
              <span className={`text-lg ${day.isToday ? "font-bold" : ""}`}>{day.date}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading study rooms...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : studyRooms.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No study rooms available.</div>
          ) : (
            studyRooms.slice(0, 5).map((room) => {
              // Try to find the day offset for this room's date
              let eventDayLabel = "";
              if (room.date) {
                const eventDate = new Date(room.date);
                const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const diffDays = Math.round((eventDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays === 0) eventDayLabel = "Today";
                else if (diffDays === 1) eventDayLabel = "Tomorrow";
                else if (diffDays >= 0 && diffDays < weekDates.length) eventDayLabel = `${weekDates[diffDays].dayName}`;
                else eventDayLabel = eventDate.toLocaleDateString();
              }
              return (
                <div key={room.room_id} className="rounded-md border p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <div className="mr-3 h-10 w-1 rounded-full bg-blue-500"></div>
                    <div>
                      <h3 className="font-medium">{room.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>
                          {eventDayLabel}
                          {room.start_time || room.end_time ? `, ${room.start_time || ''}${room.start_time && room.end_time ? ' - ' : ''}${room.end_time || ''}` : ''}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(room.start_time || room.end_time) && (
                          <div><span className="font-medium">Schedule:</span> {room.start_time || 'N/A'}{room.start_time && room.end_time ? ' - ' : ''}{room.end_time || ''}</div>
                        )}
                        {room.location && <div><span className="font-medium">Venue:</span> {room.location}</div>}
                        {room.mode && <div><span className="font-medium">Mode:</span> {room.mode}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 text-center">
          <Link href="/dashboard/calendar" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View full calendar
          </Link>
        </div>
      </div>
    </div>
  )
}
