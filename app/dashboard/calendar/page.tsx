"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface StudyRoom {
  creator?: { username?: string; email?: string };

  room_id: number;
  id: string;
  name: string;
  subject: string;
  capacity: number;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  participants: any[];
  location: string;
  host: string;
  mode: string;
  creator_id: string;
}

export default function CalendarPage() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 这个月1号是星期几
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  // 日历前面空几个格子
  const leadingEmpty = firstDayOfWeek;
  // 5行7列=35格
  const totalCells = 35;

  // 日历格子数据
  const calendarDates = Array.from({ length: totalCells }, (_, i) => {
    const dateNum = i - leadingEmpty + 1;
    return dateNum > 0 && dateNum <= daysInMonth ? dateNum : null;
  });

  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([]);
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
            date: metadata.date || room.date || "",
            start_time: metadata.start_time || room.start_time || "",
            end_time: metadata.end_time || room.end_time || "",
            participants: Array.isArray(room.participants) ? room.participants : [],
            location: metadata.location || room.location || "",
            host: room.host || "Anonymous",
            mode: metadata.mode || room.mode || "hybrid",
            creator_id: room.creator_id || metadata.creator_id || "",
            creator: room.creator || null,
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

  // 按日期分组
  const roomsByDate: Record<string, StudyRoom[]> = {};
  studyRooms.forEach(room => {
    if (room.date) {
      roomsByDate[room.date] = roomsByDate[room.date] || [];
      roomsByDate[room.date].push(room);
    }
  });

  // 当前月 yyyy-mm-dd 形式
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Calendar
          </h1>
        </div>
        <div className="mb-6 text-center text-gray-600">
          {loading ? "Loading study rooms..." : error ? error : "Click a room to view details."}
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* 调试日志：输出 roomsByDate 内容 */}
            {console.log('roomsByDate', roomsByDate)}
            {calendarDates.map((date, idx) => {
              if (!date) return <div key={idx} className="h-20 bg-transparent" />;
              // yyyy-mm-dd
              const dateStr = `${monthStr}-${String(date).padStart(2, "0")}`;
              const rooms = roomsByDate[dateStr] || [];
              // 调试日志：输出每一天的分组
              console.log('dateStr', dateStr, 'rooms', rooms);
              return (
                <div key={idx} className="h-20 bg-gray-100 rounded-md flex flex-col items-start justify-start text-gray-700 border border-gray-200 p-1">
                  <div className="font-semibold text-xs text-gray-500 mb-1">{date}</div>
                  {rooms.length > 0 && (
                    <div className="flex flex-col gap-1 w-full">
                      {rooms.map(room => (
                        <div key={room.room_id}>
                          <Link
                            href={`/dashboard/study-rooms/${room.room_id}`}
                            className="text-xs text-blue-600 hover:underline truncate"
                            title={room.name}
                          >
                            {room.name}
                          </Link>
                          <span className="ml-1 text-[11px] text-gray-500 block">
                            Host: {(room.creator && room.creator.username) ? room.creator.username : (room.host || 'Unknown')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 如果整个 roomsByDate 没有任何数据，给出明显提示 */}
            {Object.keys(roomsByDate).length === 0 && !loading && !error && (
              <div className="col-span-7 text-center text-gray-400 py-8">本月没有任何房间</div>
            )}
            {/* 如果有房间但没有分配到任何格子（如日期格式不符），给出提示 */}
            {studyRooms.length > 0 && Object.keys(roomsByDate).length > 0 &&
              calendarDates.every(date => {
                if (!date) return true;
                const dateStr = `${monthStr}-${String(date).padStart(2, "0")}`;
                return !(roomsByDate[dateStr] && roomsByDate[dateStr].length > 0);
              }) && (
                <div className="col-span-7 text-center text-gray-400 py-8">有房间数据但日期不在本月或格式不符</div>
              )}
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/dashboard" className="inline-block px-5 py-2 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
            Go back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

