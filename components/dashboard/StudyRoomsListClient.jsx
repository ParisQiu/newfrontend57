'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Filter, MapPin, Plus, Search, Tag, Users } from 'lucide-react';

export default function StudyRoomsListClient() {
  const [studyRooms, setStudyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchStudyRooms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
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
        setStudyRooms(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchStudyRooms();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading study rooms...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="space-y-3">
          {studyRooms.map(room => (
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
        </div>
      )}
    </div>
  );
}
