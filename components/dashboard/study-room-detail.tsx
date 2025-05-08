"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  MapPin,
  MessageSquare,
  PaperclipIcon,
  Send,
  Tag,
  Upload,
  Users,
  CheckCircle,
} from "lucide-react";

interface StudyRoomParticipant {
  id: string
  name: string
  avatar: string
  role: "host" | "participant"
  status: "online" | "offline" | "away"
}

interface StudyRoomMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface StudyRoom {
  id: string;
  room_id: number;
  name: string;
  title?: string;
  description?: string;
  tags?: string[];
  visibility?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  capacity?: number;
  location?: string;
  mode?: string;
  participants?: Array<{
    id: string;
    name: string;
    avatar: string;
    role: "host" | "participant";
    status: "online" | "offline" | "away";
  }>;
  messages?: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    timestamp: string;
  }>;
  materials?: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadedAt: string;
  }>;
  creator_id?: number | string;
  creator?: { username?: string; email?: string };
  host?: string;
}

interface StudyRoomDetailProps {
  roomId: string;
}

// 工具函数：确保 time 字符串为 'HH:mm' 格式
function extractTime(str: string | undefined | null): string {
  if (!str) return '';
  // 如果有T，提取T后面的部分
  const tIndex = str.indexOf('T');
  if (tIndex !== -1) {
    return str.slice(tIndex + 1, tIndex + 6); // "10:00"
  }
  // 如果是 "10:00:00" 或 "10:00"
  return str.slice(0, 5);
}

export default function StudyRoomDetail({ roomId }: StudyRoomDetailProps) {
  const router = useRouter();
  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "materials">("chat");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  // 修正 useEffect，确保 fetchRoomData 只在 roomId 变化时调用一次
  React.useEffect(() => {
    fetchRoomData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const fetchRoomData = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    let rawText = '';
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      let response = await fetch(
        `http://127.0.0.1:5000/api/study_rooms/${roomId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;
      let rawText = '';
      rawText = await response.text();

      if (!response.ok) {
        if (contentType.includes('application/json')) {
          try {
            const errorJson = JSON.parse(rawText);
            throw new Error(errorJson.message || `HTTP error: ${response.status}`);
          } catch (jsonErr: any) {
            throw new Error('Failed to parse error JSON: ' + jsonErr.message + (rawText ? ('\nRaw content:' + rawText.slice(0, 200)) : ''));
          }
        } else {
          throw new Error(`HTTP error: ${response.status}\n${rawText.slice(0, 200)}`);
        }
      }
      if (contentType.includes('application/json')) {
        try {
          data = JSON.parse(rawText);
        } catch (jsonErr: any) {
          throw new Error('Failed to parse API response: ' + jsonErr.message + (rawText ? ('\nRaw content:' + rawText.slice(0, 200)) : ''));
        }
      } else {
        throw new Error('API did not return JSON: ' + rawText.slice(0, 200));
      }

      // Enforce time format check
      const hhmmRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
      const startTime = extractTime(data.startTime || data.start_time);
      const endTime = extractTime(data.endTime || data.end_time);
      if (!hhmmRegex.test(startTime) || !hhmmRegex.test(endTime)) {
        const msg = `[Time format check] startTime: ${startTime}, endTime: ${endTime} do not match 'HH:mm' format!`;
        console.error(msg);
        setError(msg);
        throw new Error('API did not return JSON: ' + rawText.slice(0, 200));
      }

      // mockRoom 逻辑和 setRoom、setIsJoined
      const description = data.description || "No description available";
      const roomMetadata = JSON.parse(localStorage.getItem("roomMetadata") || "{}");
      const metadata = roomMetadata[data.room_id] || {};
      const joinedRoomsRaw = localStorage.getItem("joinedStudyRooms");
      const joinedRoomsArr = JSON.parse(joinedRoomsRaw || "[]");
      const userHasJoined = Array.isArray(joinedRoomsArr) && joinedRoomsArr.some(
        (jr) => jr.roomId.toString() === data.room_id.toString()
      );
      const hostName = (data.creator && data.creator.username) ? data.creator.username : "Host";
      const currentUserId = String(localStorage.getItem("userId") || "user-1");
      const currentUsername = String(localStorage.getItem("username") || "User");
      const isHost = currentUsername === hostName;
      const participants = [
        {
          id: "host-1",
          name: String(hostName),
          avatar: "http://127.0.0.1:5000/7.x/avataaars/svg?seed=host1",
          role: "host" as "host",
          status: "online" as "online",
        },
        ...(
          userHasJoined && !isHost
            ? [{
                id: currentUserId,
                name: currentUsername,
                avatar: `http://127.0.0.1:5000/7.x/avataaars/svg?seed=${currentUserId}`,
                role: "participant" as "participant",
                status: "online" as "online",
              }]
            : []
        ),
      ];
      const mockRoom: StudyRoom = {
        id: `room-${data.room_id}`,
        room_id: Number(data.room_id),
        name: data.name || "Study Room",
        title: data.title || "",
        description,
        tags: data.tags || ["study", "collaboration"],
        visibility: "public",
        startTime: metadata.start_time || data.startTime || "",
        endTime: metadata.end_time || data.endTime || "",
        date: metadata.date || data.date || "",
        capacity: data.capacity || 10,
        location: metadata.location || data.location || "",
        mode: metadata.mode || data.mode || "hybrid",
        participants,
        messages: [
          {
            id: "msg-1",
            userId: "host-1",
            userName: hostName,
            userAvatar: "http://127.0.0.1:5000/7.x/avataaars/svg?seed=host1",
            content: "Welcome to the study room! Let's get started.",
            timestamp: new Date().toISOString(),
          },
        ],
        materials: [
          {
            id: "material-1",
            name: "Study Guide.pdf",
            type: "pdf",
            size: "2.5 MB",
            uploadedBy: hostName,
            uploadedAt: "Today",
          },
        ],
        creator_id: data.creator_id || 0,
      };
      setRoom(mockRoom);
      setLoading(false);
      setIsJoined(userHasJoined);

    } catch (err: any) {
      if (err instanceof SyntaxError) {
        throw new Error('Failed to parse API response: ' + err.message + (rawText ? ('\nRaw content:' + rawText.slice(0, 200)) : ''));
      } else {
        console.error("Error fetching room data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch room data");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [fetchRoomData]);

  const handleJoinRoom = () => {
    if (!room) return;

    try {
      // Get current user info
      const username = localStorage.getItem("username") || "Current User"
      const userId = localStorage.getItem("userId") || "current-user"

      // Add the current user to the participants list
      const updatedParticipants: StudyRoomParticipant[] = [
        ...room.participants.map((p) => ({
          ...p,
          role: p.role === "host" ? "host" : "participant",
        })) as StudyRoomParticipant[],
        {
          id: userId,
          name: username,
          avatar: "/blueportrait.jpg",
          role: "participant",
          status: "online",
        },
      ]

      // Update the room state
      setRoom({
        ...room,
        participants: updatedParticipants,
      })

      // Store the joined room in localStorage
      const joinedRoomsRaw = localStorage.getItem("joinedStudyRooms");
      const joinedRoomsArr = JSON.parse(joinedRoomsRaw || "[]");

      if (!Array.isArray(joinedRoomsArr)) {
        console.error("joinedRoomsArr is not an array:", joinedRoomsArr);
        return;
      }

      const roomIdentifier = room.room_id || room.id

      const userHasJoined = joinedRoomsArr.some(
        (jr) => jr.roomId.toString() === room.room_id.toString()
      );

      if (!userHasJoined) {
        joinedRoomsArr.push({
          roomId: roomIdentifier,
          joinedAt: new Date().toISOString(),
        })
        localStorage.setItem("joinedStudyRooms", JSON.stringify(joinedRoomsArr))
      }

      setIsJoined(true)
      setJoinSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setJoinSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Error joining room:", err)
      alert("Failed to join the study room. Please try again.")
    }
  }

  // Handle leaving a room
  const handleLeaveRoom = () => {
    if (!room) return

    try {
      // Get current user info
      const userId = localStorage.getItem("userId") || "current-user"

      // Remove the current user from the participants list
      const updatedParticipants = room.participants.filter((p) => p.id !== userId)

      // Update the room state
      setRoom({
        ...room,
        participants: updatedParticipants,
      })

      // Remove the room from localStorage
      const joinedRoomsRaw = localStorage.getItem("joinedStudyRooms");
      const joinedRoomsArr = JSON.parse(joinedRoomsRaw || "[]");

      if (!Array.isArray(joinedRoomsArr)) {
        console.error("joinedRoomsArr is not an array:", joinedRoomsArr);
        return;
      }

      const roomIdentifier = room.room_id || room.id

      const updatedJoinedRooms = joinedRoomsArr.filter((jr) => jr.roomId.toString() !== roomIdentifier.toString())
      localStorage.setItem("joinedStudyRooms", JSON.stringify(updatedJoinedRooms))

      setIsJoined(false)
      setLeaveSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setLeaveSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Error leaving room:", err)
      alert("Failed to leave the study room. Please try again.")
    }
  }

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !room) return

    try {
      // Get current user info
      const username = localStorage.getItem("username") || "Current User"
      const userId = localStorage.getItem("userId") || "current-user"

      // Create a new message
      const newMessageObj: StudyRoomMessage = {
        id: `msg-${Date.now()}`,
        userId: userId,
        userName: username,
        userAvatar: "/blueportrait.jpg",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      // Update the room state
      setRoom({
        ...room,
        messages: [...room.messages, newMessageObj],
      })

      // Clear the input
      setNewMessage("")
    } catch (err) {
      console.error("Error sending message:", err)
      alert("Failed to send message. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading study room...</p>
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error || "Study room not found"}</p>
          <Link
            href="/dashboard/study-rooms"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Study Rooms
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/study-rooms/all"
          className="flex items-center text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Study Rooms
        </Link>
      </div>

      {/* Success Messages */}
      {joinSuccess && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <span>You have successfully joined the study room!</span>
          </div>
        </div>
      )}

      {leaveSuccess && (
        <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-blue-500" />
            <span>You have left the study room.</span>
          </div>
        </div>
      )}

      {/* Study Room Header */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {room.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            {/* If user is the host, show Edit and Delete buttons, otherwise show Join/Leave */}
            {(() => {
              if (typeof window === 'undefined' || !room) return false;
              const localUsername = localStorage.getItem('username');
              const localEmail = localStorage.getItem('email');
              if (room.creator && localUsername && localEmail) {
                return (
                  room.creator.username === localUsername &&
                  room.creator.email === localEmail
                );
              }
              return String(room.creator_id) === String(localStorage.getItem('userId'));
            })() ? (
              <div className="flex gap-2">
                <button
                  className="rounded bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                  onClick={() => router.push(`/dashboard/study-rooms/${room.room_id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this room?')) {
                      try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          alert('Not logged in!');
                          return;
                        }
                        const res = await fetch(`http://127.0.0.1:5000/api/study_rooms/${room.room_id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        if (!res.ok) throw new Error('Failed to delete room');
                        router.push('/dashboard/study-rooms');
                      } catch (err) {
                        const msg = err instanceof Error ? err.message : String(err);
                        alert('Delete failed: ' + msg);
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            ) : isJoined ? (
              <button
                onClick={handleLeaveRoom}
                className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
              >
                Leave Room
              </button>
            ) : (
              <button
                onClick={handleJoinRoom}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Join Room
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-gray-600">{room.description}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium">{room.date}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className="text-sm font-medium">{extractTime(room.startTime)} - {extractTime(room.endTime)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Capacity</p>
              <p className="text-sm font-medium">
                {room.participants.length}/{room.capacity} participants
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium">{room.location}</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-gray-400">Mode:</span>
            <span className="text-sm font-medium capitalize">{room.mode || "online"}</span>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Participants</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {room.participants.map((participant, idx) => (
            <div key={participant.id} className="flex items-center rounded-md border p-3">
              <div className="relative mr-3">
                <div className="group relative">
                  <img
                    src={participant.avatar || "/blueportrait.jpg"}
                    alt={participant.name}
                    className="h-10 w-10 rounded-full object-cover cursor-pointer"
                    onClick={() => {
                      // Focus the hidden file input below
                      const fileInput = document.getElementById(`avatar-file-${participant.id}`) as HTMLInputElement | null;
                      if (fileInput) fileInput.click();
                    }}
                  />
                  {/* Overlay for upload */}
                  {((!room.id || String(room.id).startsWith("mock")) || participant.id === localStorage.getItem("userId")) && (
                    <>
                      <input
                        id={`avatar-file-${participant.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = ev => {
                            const updated = [...room.participants];
                            const newAvatar = ev.target?.result as string;
                            updated[idx] = { ...participant, avatar: newAvatar };
                            setRoom({ ...room, participants: updated });
                            // Persist avatar change
                            const allAvatars = JSON.parse(localStorage.getItem("participantAvatars") || "{}");
                            const rk = room.id.toString();
                            const avatarMap = allAvatars[rk] || {};
                            avatarMap[participant.id] = newAvatar;
                            allAvatars[rk] = avatarMap;
                            localStorage.setItem("participantAvatars", JSON.stringify(allAvatars));
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => {
                          const fileInput = document.getElementById(`avatar-file-${participant.id}`) as HTMLInputElement | null;
                          if (fileInput) fileInput.click();
                        }}
                      >
                        <span className="text-xs text-white bg-black/60 rounded px-2 py-1">Change Avatar</span>
                      </div>
                    </>
                  )}
                </div>
                <span
                  className={`absolute bottom-0 right-0 z-10 h-3 w-3 rounded-full border border-white ${
                    participant.status === "online"
                      ? "bg-green-500"
                      : participant.status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                  }`}
                ></span>
              </div>
              <div>
                <p className="font-medium">
                  {participant.name}
                  {participant.id === localStorage.getItem("userId") && (
                    <span className="ml-1 text-xs text-blue-600">(You)</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {idx === 0 ? "Host" : "Participant"}
                </p>
                {/* Allow status change if mock room or current user */}
                {((!room.id || String(room.id).startsWith("mock")) || participant.id === localStorage.getItem("userId")) && (
                  <select
                    className="mt-2 block rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
                    value={participant.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as "online" | "away" | "offline"
                      const updated = [...room.participants]
                      updated[idx] = { ...participant, status: newStatus }
                      setRoom({ ...room, participants: updated })
                      // Persist status change
                      const allStatuses = JSON.parse(localStorage.getItem("participantStatuses") || "{}");
                      const roomKey = room.id.toString();
                      const roomStatuses = allStatuses[roomKey] || {};
                      roomStatuses[participant.id] = newStatus;
                      allStatuses[roomKey] = roomStatuses;
                      localStorage.setItem("participantStatuses", JSON.stringify(allStatuses));
                    }}
                  >
                    <option value="online">Online</option>
                    <option value="away">Away</option>
                    <option value="offline">Offline</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat and Materials Tabs */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="flex border-b">
          <button
            className={`flex-1 px-4 py-3 text-center text-sm font-medium ${
              activeTab === "chat" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("chat")}
          >
            <MessageSquare className="mr-1 inline-block h-4 w-4" />
            Chat
          </button>
          <button
            className={`flex-1 px-4 py-3 text-center text-sm font-medium ${
              activeTab === "materials"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("materials")}
          >
            <PaperclipIcon className="mr-1 inline-block h-4 w-4" />
            Study Materials
          </button>
        </div>

        <div className="p-4">
          {activeTab === "chat" ? (
            <div className="flex h-96 flex-col">
              <div className="flex-1 overflow-y-auto">
                {room.messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4 p-2">
                    {room.messages.map((message) => (
                      <div key={message.id} className="flex">
                        <img
                          src={message.userAvatar || "/blueportrait.jpg"}
                          alt={message.userName}
                          className="mr-3 h-8 w-8 rounded-full object-cover"
                        />
                        <div className="max-w-[75%] rounded-lg bg-gray-100 p-3">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-medium">
                              {message.userName}
                              {message.userId === localStorage.getItem("userId") && (
                                <span className="ml-1 text-xs text-blue-600">(You)</span>
                              )}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">{message.timestamp.replace(/\.[0-9]{3}Z$/, '').replace('T', ' ')}</span>
                          </div>
                          <p className="text-sm text-gray-700">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isJoined ? (
                <form onSubmit={handleSendMessage} className="mt-4 flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-r-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <div className="mt-4 rounded-md bg-gray-100 p-3 text-center">
                  <p className="text-sm text-gray-600">Join the room to participate in the chat</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96">
              <div className="mb-4 flex justify-between">
                <h3 className="text-lg font-medium">Study Materials</h3>
                {isJoined && (
                  <button className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700">
                    <Upload className="mr-1 h-4 w-4" />
                    Upload
                  </button>
                )}
              </div>

              {room.materials.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-center text-gray-500">No study materials have been shared yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {room.materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded bg-blue-100 text-blue-600">
                          <span className="text-xs font-bold">{material.type}</span>
                        </div>
                        <div>
                          <p className="font-medium">{material.name}</p>
                          <p className="text-xs text-gray-500">
                            {material.size} • Uploaded by {material.uploadedBy} • {material.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <button className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
