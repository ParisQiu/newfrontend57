"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Calendar, Filter, MapPin, Plus, Search, Tag, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface StudyRoom {
  room_id: number
  id?: string
  name: string
  capacity: number
  description?: string
  tags?: string[]
  date?: string
  start_time?: string
  end_time?: string
  participants?: number
  location?: string
  host?: string
  creator_id?: number
  mode?: "online" | "offline" | "hybrid"
}

// Type for the joined rooms in localStorage
interface JoinedRoom {
  roomId: string | number
  joinedAt: string
}

export default function StudyRoomsList() {
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [joinedRooms, setJoinedRooms] = useState<JoinedRoom[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()

  // Load joined rooms from localStorage
  useEffect(() => {
    const loadJoinedRooms = () => {
      const storedJoinedRooms = localStorage.getItem("joinedStudyRooms")
      if (storedJoinedRooms) {
        setJoinedRooms(JSON.parse(storedJoinedRooms))
      }
    }

    loadJoinedRooms()

    // Add event listener for storage changes
    window.addEventListener("storage", loadJoinedRooms)

    return () => {
      window.removeEventListener("storage", loadJoinedRooms)
    }
  }, [])

  // Function to fetch study rooms
  const fetchStudyRooms = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("https://studysmarterapp.onrender.com/api/study_rooms", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          // Add cache control to prevent caching
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch study rooms")
      }

      const data = await response.json()
      console.log('Raw API response:', data)

      // Handle different response structures
      const rooms = Array.isArray(data) ? data : data.rooms || []
      console.log('Room data before normalization:', rooms)

      // Get room metadata from localStorage
      const roomMetadata = JSON.parse(localStorage.getItem('roomMetadata') || '{}');
      console.log('Room metadata from localStorage:', roomMetadata);

      // Normalize the data structure based on the minimal API response
      const normalizedRooms = rooms.map((room: any) => {
        console.log('Raw room data:', room);
        
        // Get metadata for this room
        const metadata = roomMetadata[room.room_id] || {};
        console.log('Metadata for room', room.room_id, ':', metadata);
        
        const normalized = {
          room_id: room.room_id || 0,
          id: room.id || `room-${room.room_id || Math.random().toString(36).substr(2, 9)}`,
          name: room.name || "Unnamed Room",
          capacity: room.capacity || 0,
          description: room.description || "No description available",
          tags: [],
          date: metadata.date || "",
          start_time: metadata.start_time || "",
          end_time: metadata.end_time || "",
          participants: room.participants || 0,
          location: metadata.location || "",
          host: room.host || "Anonymous",
          mode: metadata.mode || "hybrid"
        };
        console.log('Normalized room:', normalized);
        return normalized;
      });
      
      // Log the normalized rooms for debugging
      console.log('Normalized rooms:', normalizedRooms)

      // Store the rooms in localStorage for reference
      localStorage.setItem("studyRooms", JSON.stringify(normalizedRooms))

      setStudyRooms(normalizedRooms)
    } catch (err) {
      console.error("Error fetching study rooms:", err)
      setError("Failed to load study rooms. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Add useEffect to fetch study rooms
  useEffect(() => {
    fetchStudyRooms()

    // Check if we need to refresh (coming from create page)
    const refresh = searchParams.get("refresh")
    if (refresh === "true") {
      // Remove the query parameter without refreshing the page
      const newUrl = window.location.pathname
      window.history.replaceState({}, "", newUrl)
    }
  }, [router, searchParams])

  // Since we know tags will always be an empty array in this API response,
  // we'll just provide some dummy tags for the filter UI
  const allTags = useMemo(() => {
    // If we have any rooms with actual tags, use those
    const existingTags = studyRooms
      .filter((room) => Array.isArray(room.tags) && room.tags.length > 0)
      .flatMap((room) => room.tags || [])

    // If no tags exist, return an empty array - no need for dummy tags
    return Array.from(new Set(existingTags))
  }, [studyRooms])

  // Filter study rooms based on search query only (since we don't have tags)
  const filteredRooms = studyRooms.filter((room) => {
    return (
      searchQuery === "" ||
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Check if a room is joined
  const isRoomJoined = (roomId: number | string) => {
    return joinedRooms.some((jr) => jr.roomId.toString() === roomId.toString())
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Rooms</h1>
          <p className="mt-1 text-gray-600">Join a study room or create your own</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchStudyRooms}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Refresh
          </button>
          <Link
            href="/dashboard/study-rooms/create"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Study Room
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search study rooms..."
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {allTags.length > 0 && (
            <button
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </button>
          )}
        </div>

        {showFilters && allTags.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h3 className="mb-2 text-sm font-medium">Filter by Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Study Rooms List */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
            <p className="mt-2 text-gray-600">Loading study rooms...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">No study rooms found matching your criteria.</p>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div key={room.room_id} className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md">
              <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:space-y-0">
                <div>
                  <Link href={`/dashboard/study-rooms/${room.room_id}`}>
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">{room.name}</h2>
                  </Link>
                  <p className="mt-1 text-gray-600">{room.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/dashboard/study-rooms/${room.room_id}`}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      isRoomJoined(room.room_id)
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isRoomJoined(room.room_id) ? "Continue" : "Join Room"}
                  </Link>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-200 pt-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {(() => {
                      const joined = isRoomJoined(room.room_id);
                      let count = room.participants || 0;
                      if (joined && count < room.capacity) count += 1;
                      return `${count}/${room.capacity} participants`;
                    })()}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {room.mode === 'online' ? 'Online' : room.location || 'No location specified'}
                    {room.mode && ` (${room.mode})`}
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Date:</span> {room.date || 'Not specified'}
                    </span>
                  </div>
                  {(room.start_time || room.end_time) && (
                    <div className="flex items-center pl-6">
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Time:</span> {room.start_time || 'Not specified'} - {room.end_time || 'Not specified'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {isRoomJoined(room.room_id) && (
                <div className="mt-2 text-xs font-medium text-green-600">You have joined this room</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
