'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
        <ul>
          {studyRooms.map(room => (
            <li key={room.id}>{room.name}</li>
          ))}
        </ul>
      )}
      Search filter: {params.get('filter')}
    </div>
  );
}
