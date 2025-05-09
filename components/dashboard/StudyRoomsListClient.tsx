'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Filter, MapPin, Plus, Search, Tag, Users } from 'lucide-react';
import type { StudyRoom } from './study-room-detail';

interface StudyRoomsListClientProps {
  rooms: StudyRoom[];
  loading: boolean;
  error: string | null;
  showAll: boolean;
}

export default function StudyRoomsListClient({
  rooms: propRooms = [],
  loading: propLoading = false,
  error: propError = null,
  showAll = false,
}: StudyRoomsListClientProps) {
  const [showAllCreated, setShowAllCreated] = useState(false);
  const [showAllJoined, setShowAllJoined] = useState(false);
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [joinedRooms, setJoinedRooms] = useState<StudyRoom[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Current user from localStorage
  const [currentUser, setCurrentUser] = useState<{ id: string | null; username: string; email: string }>({ id: null, username: '', email: '' });
  useEffect(() => {
    const id = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    if (id && username && email) {
      setCurrentUser({ id, username, email });
    }
  }, []);

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
        // fetch details for each room
        const detailedRooms = await Promise.all(
          data.map(async (room: StudyRoom) => {
            try {
              const detailRes = await fetch(`https://studysmarterapp.onrender.com/api/study_rooms/${room.room_id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (!detailRes.ok) {
                console.warn('Failed to fetch details for room', room.room_id);
                return room;
              }
              const detailData = await detailRes.json();
              console.log('Fetched detail for room', room.room_id, detailData);
              return { ...room, ...detailData };
            } catch (e) {
              console.error('Error fetching detail for room', room.room_id, e);
              return room;
            }
          })
        );
        console.log('Final merged rooms:', detailedRooms);
        // 保证每个房间都带有完整的字段
        const normalizedRooms = detailedRooms.map(room => ({
          ...room,
          creator: room.creator || null, // 保证 creator 字段存在
          startTime: room.startTime || room.start_time || '00:00',
          endTime: room.endTime || room.end_time || '00:00',
          date: room.date || '',
          location: room.location || '',
          mode: room.mode || '',
          capacity: room.capacity || 0,
          description: room.description || '',
          participants: room.participants || [],
          tags: room.tags || [],
        }));
        setRooms(normalizedRooms);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchStudyRooms();
  }, []);

  const filterByTags = (room: StudyRoom, tags: string[]) => {
    return tags.every((j: string) => (room.tags || []).some((id: string) => id.toLowerCase().includes(j.toLowerCase())));
  };

  if (showAll) {
    const displayedRooms = rooms.slice(0, 3);
    return (
      <div>
        {propLoading ? (
          <p>Loading study rooms...</p>
        ) : propError ? (
          <p>Error: {propError}</p>
        ) : (
          <div className="space-y-3">
            {displayedRooms.map(room => {
              console.log('当前渲染 room:', room);
              console.log('当前渲染 room.creator:', room.creator);
              let joinedRoomIds = [];
              try { joinedRoomIds = (JSON.parse(localStorage.getItem('joinedStudyRooms') || '[]') || []).map((j: any) => String(j.roomId)); } catch {}
              // Determine owner by matching username & email
              const isOwner = currentUser && room.creator &&
                currentUser.username === room.creator.username &&
                currentUser.email === room.creator.email;
              const isJoined = joinedRoomIds.includes(String(room.room_id || ''));
              return (
                <div key={room.room_id} className="rounded-md border p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <Link href={`/dashboard/study-rooms/${room.room_id}`} className="text-blue-600 hover:underline">
                          {room.name}
                        </Link>
                        <span className="ml-2 text-xs text-gray-500">Host: {(room.creator?.username) || room.host || 'Unknown'}</span>
                      </h3>
                      
                      
                      <p className="text-xs text-gray-400 mt-1">{room.description || 'No description'}</p>
                    </div>
                    {isOwner ? (
                      <div className="flex gap-2">
                        <Link href={`/dashboard/study-rooms/${room.room_id}/edit`}>
                          <button className="rounded bg-yellow-500 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-600">Edit</button>
                        </Link>
                        <button
                          className="rounded bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this room?')) {
                              try {
                                const token = localStorage.getItem('token');
                                if (!token) {
                                  alert('Not logged in!');
                                  return;
                                }
                                const res = await fetch(`https://studysmarterapp.onrender.com/api/study_rooms/${room.room_id}`, {
                                  method: 'DELETE',
                                  headers: { Authorization: `Bearer ${token}` },
                                });
                                if (!res.ok) throw new Error('Failed to delete room');
                                window.location.reload();
                              } catch (err: any) {
                                alert('Delete failed: ' + err.message);
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ) : isJoined ? (
                      <button className="rounded-md border border-red-300 bg-white px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50" onClick={() => {
                        if (window.confirm('Are you sure you want to leave this room?')) {
                          let ids = [];
                          try { ids = (JSON.parse(localStorage.getItem('joinedStudyRooms')) || []).map(j => j.roomId); } catch {}
                          const updated = ids.filter(id => String(id) !== String(room.room_id));
                          localStorage.setItem('joinedStudyRooms', JSON.stringify(updated));
                          window.location.reload();
                        }
                      }}>Leave</button>
                    ) : (
                      <Link
                        href={`/dashboard/study-rooms/${room.room_id}`}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Join Room
                      </Link>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500"><Users className="mr-1 h-4 w-4" /><span>{room.participants}/{room.capacity} participants</span></div>
                  <div className="mt-1 text-xs text-gray-600">
                    <div><span className="font-medium">Date:</span> {room.date || room.date || room.startTime || 'N/A'}</div>
                    {(room.startTime || room.endTime) && (
                      <div><span className="font-medium">Time:</span> {(room.startTime || '') + (room.startTime && room.endTime ? ' - ' : '') + (room.endTime || '')}</div>
                    )}
                    <div><span className="font-medium">Venue:</span> {room.location || room.location || 'N/A'}</div>
                    <div><span className="font-medium">Mode:</span> {room.mode || 'N/A'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )} 

      </div>
    );
  }

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  // 分类：我创建的房间
  const myRooms = rooms.filter(room => String(room.creator_id) === String(userId));
  // 分类：我加入的房间（排除自己创建的）
  let joinedRoomIds = [];
  if (typeof window !== 'undefined') {
    try {
      joinedRoomIds = (JSON.parse(localStorage.getItem('joinedStudyRooms')) || []).map(j => String(j.roomId));
    } catch {}
  }
  const filteredJoinedRooms = rooms.filter(room => joinedRoomIds.includes(String(room.room_id)) && String(room.creator_id) !== String(userId));

  return (
    <div>
      {loading ? (
        <p>Loading study rooms...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Rooms I Created</h2>
              {myRooms.length > 3 && (
                <button
                  className="text-blue-600 text-sm hover:underline focus:outline-none"
                  onClick={() => setShowAllCreated(prev => !prev)}
                >
                  {showAllCreated ? 'View Less' : 'View All'}
                </button>
              )}
            </div>
            {myRooms.length === 0 ? <div className="text-gray-400">No rooms created.</div> : null}
            <div className="space-y-3">
              {(showAllCreated ? myRooms : myRooms.slice(0, 3)).map(room => {
                console.log('Dashboard room object:', room);
                // Determine owner by matching username & email
                const isOwner = currentUser && room.creator &&
                  currentUser.username === room.creator.username &&
                  currentUser.email === room.creator.email;
                console.log('userId:', userId, typeof userId, 'creator_id:', room.creator_id, typeof room.creator_id, 'isOwner:', isOwner, room.name);
                return (
                  <div key={room.room_id} className="rounded-md border p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
  <Link href={`/dashboard/study-rooms/${room.room_id}`} className="text-blue-600 hover:underline">
    {room.name}
  </Link>
  <span className="ml-2 text-xs text-gray-500">Host: {(room.creator?.username) || room.host || 'Unknown'}</span>
</h3>
                        
                        <p className="text-xs text-gray-400 mt-1">{room.description || 'No description'}</p>
                      </div>
                      {isOwner ? (
                        <div className="flex gap-2">
                          <Link href={`/dashboard/study-rooms/${room.room_id}/edit`}>
                            <button className="rounded bg-yellow-500 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-600">Edit</button>
                          </Link>
                          <button
                            className="rounded bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this room?')) {
                                try {
                                  const token = localStorage.getItem('token');
                                  if (!token) {
                                    alert('Not logged in!');
                                    return;
                                  }
                                  const res = await fetch(`https://studysmarterapp.onrender.com/api/study_rooms/${room.room_id}`, {
                                    method: 'DELETE',
                                    headers: { Authorization: `Bearer ${token}` },
                                  });
                                  if (!res.ok) throw new Error('Failed to delete room');
                                  // Refresh the room list after deletion
                                  window.location.reload();
                                } catch (err: any) {
                                  alert('Delete failed: ' + err.message);
                                }
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <Link
                          href={`/dashboard/study-rooms/${room.room_id}`}
                          className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-200"
                        >
                          Join
                        </Link>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Users className="mr-1 h-4 w-4" />
                      <span>
                        {room.participants}/{room.capacity} participants
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      <div><span className="font-medium">Date:</span> {room.date || room.date || room.startTime || 'N/A'}</div>
{(room.startTime || room.endTime) && (
  <div><span className="font-medium">Time:</span> {(room.startTime || '') + (room.startTime && room.endTime ? ' - ' : '') + (room.endTime || '')}</div>
)}
                      {(room.startTime || room.endTime) && (
  <div><span className="font-medium">Time:</span> {(room.startTime || '') + (room.startTime && room.endTime ? ' - ' : '') + (room.endTime || '')}</div>
)}
                      <div><span className="font-medium">Venue:</span> {room.location || room.location || 'N/A'}</div>
                      <div><span className="font-medium">Mode:</span> {room.mode || 'N/A'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Rooms I Joined</h2>
              {filteredJoinedRooms.length > 3 && (
                <button
                  className="text-blue-600 text-sm hover:underline focus:outline-none"
                  onClick={() => setShowAllJoined(prev => !prev)}
                >
                  {showAllJoined ? 'View Less' : 'View All'}
                </button>
              )}
            </div>
            {filteredJoinedRooms.length === 0 ? <div className="text-gray-400">No rooms joined.</div> : null}
            <div className="space-y-3">
              {(showAllJoined ? filteredJoinedRooms : filteredJoinedRooms.slice(0, 3)).map(room => {
                // 复用同样的渲染逻辑
                // Determine owner by matching username & email
                const isOwner = currentUser && room.creator &&
                  currentUser.username === room.creator.username &&
                  currentUser.email === room.creator.email;
                return (
                  <div key={room.room_id} className="rounded-md border p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
  <Link href={`/dashboard/study-rooms/${room.room_id}`} className="text-blue-600 hover:underline">
    {room.name}
  </Link>
  <span className="ml-2 text-xs text-gray-500">Host: {(room.creator?.username) || room.host || 'Unknown'}</span>
</h3>
                        
                        <p className="text-xs text-gray-400 mt-1">{room.description || 'No description'}</p>
                      </div>
                      <button
                        className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-200"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to leave this room?')) {
                            try {
                              let joinedRoomIds = [];
                              try {
                                joinedRoomIds = JSON.parse(localStorage.getItem('joinedStudyRooms')) || [];
                              } catch {}
                              const updated = joinedRoomIds.filter((j: any) => String(j.roomId) !== String(room.room_id || ''));
                              localStorage.setItem('joinedStudyRooms', JSON.stringify(updated));
                              window.location.reload();
                            } catch (err: any) {
                              alert('Leave failed: ' + err.message);
                            }
                          }
                        }}
                      >
                        Leave
                      </button>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Users className="mr-1 h-4 w-4" />
                      <span>
                        {room.participants}/{room.capacity} participants
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      <div><span className="font-medium">Date:</span> {room.date || room.date || room.startTime || 'N/A'}</div>
{(room.startTime || room.endTime) && (
  <div><span className="font-medium">Time:</span> {(room.startTime || '') + (room.startTime && room.endTime ? ' - ' : '') + (room.endTime || '')}</div>
)}
                      {(room.startTime || room.endTime) && (
  <div><span className="font-medium">Time:</span> {(room.startTime || '') + (room.startTime && room.endTime ? ' - ' : '') + (room.endTime || '')}</div>
)}
                      <div><span className="font-medium">Venue:</span> {room.location || room.location || 'N/A'}</div>
                      <div><span className="font-medium">Mode:</span> {room.mode || 'N/A'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
