"use client";
import Link from "next/link"
import { Calendar, Plus } from "lucide-react"
import StatusModal from "../StatusModal"
import React, { useState } from "react";

import type { StudyRoom } from './study-room-detail';
// 补充类型定义（如果需要）
// interface StudyRoom { creator?: { username?: string; email?: string }; host?: string; ... }

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

  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>(([] as StudyRoom[]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -------- useEffect with debug info ---------
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
          },
        });
        if (!response.ok) throw new Error("Failed to fetch study rooms");
        const data = await response.json();
        console.log("Fetched study rooms:", data); // 1. 打印接口返回数据

        const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        console.log("Current userId:", storedUserId); // 2. 打印当前userId
        const userId = storedUserId || "";

        const rooms = Array.isArray(data) ? data : data.rooms || [];
        const roomMetadata = JSON.parse(localStorage.getItem('roomMetadata') || '{}');

        // 新增 normalizeRoom 函数，防御式处理所有字段
        function normalizeRoom(room: any) {
          return {
            ...room,
            date: room.date || "",
            start_time: room.start_time || "00:00",
            end_time: room.end_time || "00:00",
            location: room.location || "",
            mode: room.mode || "",
          };
        }
        // 先 normalize 后再 merge metadata
        const normalizedRooms = rooms.map((room: any) => {
          const norm = normalizeRoom(room);
          const metadata = roomMetadata[norm.room_id] || {};
          return {
            ...norm,
            date: metadata.date || norm.date,
            start_time: (metadata.start_time && /^\d{2}:\d{2}$/.test(metadata.start_time))
              ? metadata.start_time
              : ((norm.start_time && /^\d{2}:\d{2}$/.test(norm.start_time)) ? norm.start_time : "00:00"),
            end_time: (metadata.end_time && /^\d{2}:\d{2}$/.test(metadata.end_time))
              ? metadata.end_time
              : ((norm.end_time && /^\d{2}:\d{2}$/.test(norm.end_time)) ? norm.end_time : "00:00"),
            location: metadata.location || norm.location,
            mode: metadata.mode || norm.mode,
            room_id: room.room_id || 0,
            id: room.id || `room-${room.room_id || Math.random().toString(36).substr(2, 9)}`,
            name: room.name || "Unnamed Room",
            subject: room.subject || "",
            capacity: room.capacity || 0,
            description: room.description || "No description available",
            participants: Array.isArray(room.participants) ? room.participants : [],
            host: room.host || "Anonymous",
            creator_id: room.creator_id || metadata.creator_id || "",
            creator: room.creator || null,
            mode: metadata.mode || room.mode || "hybrid",
          };
        });
        // 展示全部房间，按日期升序和时间升序排序
        const sortedRooms = normalizedRooms
          .filter((room: StudyRoom) => room.date) // 只要有 date 就显示
          .sort((a: StudyRoom, b: StudyRoom) => {
            // 先按日期升序
            const aDate = a.date ? new Date(a.date) : new Date("2100-01-01");
            const bDate = b.date ? new Date(b.date) : new Date("2100-01-01");
            const dateDiff = aDate.getTime() - bDate.getTime();
            if (dateDiff !== 0) {
              return dateDiff; // 日期早的在前
            }
            // 日期相同，按 startTime 升序
            // 没有 startTime 的排在最后
            if (a.startTime && b.startTime) {
              // 比较时间字符串
              return a.startTime.localeCompare(b.startTime);
            } else if (a.startTime) {
              return -1;
            } else if (b.startTime) {
              return 1;
            } else {
              return 0;
            }
          });
        setStudyRooms(sortedRooms);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setLoading(false);
      }
    };
    fetchStudyRooms();
  }, []);
  // -------- end useEffect ---------

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
            studyRooms.slice(0, 3).map((room) => {
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
                      <h3 className="font-medium flex items-center gap-2">
  {room.name}
  <span className="ml-2 text-xs text-gray-500">Host: {(room.creator && room.creator.username) ? room.creator.username : (room.host || 'Unknown')}</span>
</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>
                          {room.date ? (
                            <>
                              {room.date}
                              {room.startTime || room.endTime ? `, ${room.startTime || ''}${room.startTime && room.endTime ? ' - ' : ''}${room.endTime || ''}` : ''}
                            </>
                          ) : (
                            eventDayLabel
                          )}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {room.date && (
                          <div><span className="font-medium">Date:</span> {room.date}</div>
                        )}
                        {(room.startTime || room.endTime) && (
                          <div><span className="font-medium">Time:</span> {room.startTime || 'N/A'}{room.startTime && room.endTime ? ' - ' : ''}{room.endTime || ''}</div>
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
