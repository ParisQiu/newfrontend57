'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StudyRoomsClient() {
  const params = useSearchParams();
  const [studyRooms, setStudyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudyRooms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view study rooms.');
          setLoading(false);
          return;
        }
        const response = await fetch('https://studysmarterapp.onrender.com/api/study_rooms', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch study rooms');
        const data = await response.json();
        // 按创建时间倒序排列
        const sortedRooms = [...data].sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0));
        // 获取每个房间详情以包含 creator_id
        const detailedRooms = await Promise.all(
          sortedRooms.map(async room => {
            try {
              const detailRes = await fetch(
                `https://studysmarterapp.onrender.com/api/study_rooms/${room.room_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (!detailRes.ok) { console.warn('Failed to fetch details for room', room.room_id); return room; }
              const detailData = await detailRes.json();
              return { ...room, ...detailData };
            } catch (e) {
              console.error('Error fetching detail for room', room.room_id, e);
              return room;
            }
          })
        );
        setStudyRooms(detailedRooms);
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
          {studyRooms.map(room => {
            const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
            const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
            // Debug info for troubleshooting owner logic
            console.log('room.creator_id:', room.creator_id, 'room.host:', room.host, 'userId:', userId, 'username:', username);
            // Robust owner check: type-safe & case-insensitive
            const isOwner = (
              userId && String(room.creator_id) === String(userId)
            ) || (
              username && room.host && String(room.host).toLowerCase() === String(username).toLowerCase()
            );
            // 判断用户是否加入
            let joinedRoomIds = [];
            try { joinedRoomIds = (JSON.parse(localStorage.getItem('joinedStudyRooms')) || []).map(j => String(j.roomId)); } catch {}
            const isJoined = userId && joinedRoomIds.includes(String(room.room_id));
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
<p className="text-sm text-gray-500">{room.subject}</p>
                  </div>
                  {isOwner ? (
                    <div className="flex gap-2">
                      <a href={`/dashboard/study-rooms/${room.room_id}/edit`}>
                        <button className="rounded bg-yellow-500 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-600">Edit</button>
                      </a>
                      <button className="rounded bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600" onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this room?')) {
                          try {
                            const token = localStorage.getItem('token');
                            if (!token) { alert('Not logged in!'); return; }
                            const res = await fetch(`https://studysmarterapp.onrender.com/api/study_rooms/${room.room_id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                            if (!res.ok) throw new Error('Failed to delete room'); window.location.reload();
                          } catch (err) { alert('Delete failed: ' + err.message); }
                        }
                      }}>Delete</button>
                    </div>
                  ) : isJoined ? (
                    <button className="rounded-md border border-red-300 bg-white px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50" onClick={() => {
                      if (window.confirm('Are you sure you want to leave this room?')) {
                        let ids = [];
                        try { ids = JSON.parse(localStorage.getItem('joinedStudyRooms')) || []; } catch {}
                        const updated = ids.filter(j => String(j.roomId) !== String(room.room_id));
                        localStorage.setItem('joinedStudyRooms', JSON.stringify(updated)); window.location.reload();
                      }
                    }}>Leave</button>
                  ) : (
                    <button className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-200" onClick={() => {
                      let ids = [];
                      try { ids = JSON.parse(localStorage.getItem('joinedStudyRooms')) || []; } catch {}
                      ids.push({ roomId: room.room_id });
                      localStorage.setItem('joinedStudyRooms', JSON.stringify(ids)); window.location.reload();
                    }}>Join</button>
                  )}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="mr-2">👥</span>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
