"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditStudyRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id as string;
  if (!roomId) return <div className="text-red-500">Invalid room ID</div>;
  const [form, setForm] = useState({
    name: "",
    description: "",
    capacity: 1,
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    mode: "online",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRoom() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/api/study_rooms/${roomId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch room");
        const data = await res.json();
        setForm({
          name: data.name || "",
          description: data.description || "",
          capacity: data.capacity || 1,
          date: data.date || "",
          start_time: data.start_time || "",
          end_time: data.end_time || "",
          location: data.location || "",
          mode: data.mode || "online",
        });
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchRoom();
  }, [roomId, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (!form.date) {
    setError("Please select a date for the study room.");
    return;
  }
  if (!form.start_time) {
    setError("Please select a start time for the study room.");
    return;
  }
  if (!form.end_time) {
    setError("Please select an end time for the study room.");
    return;
  }
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/study_rooms/${roomId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      let data: any = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        // 响应不是json格式
        console.error("Response is not JSON", jsonErr);
      }
      if (!res.ok) {
        console.error("API Error Response:", data, "Status:", res.status, "Raw Response:", res);
        setError(data.message || `Error: ${res.status}`);
        return;
      }
      router.push("/dashboard/study-rooms");
    } catch (err: any) {
      console.error("Network or JS Error:", err);
      setError(err.message || "Unknown error");
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    } as typeof prev));
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Edit Study Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Capacity</label>
          <input name="capacity" type="number" value={form.capacity} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" min="1" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium">Start Time</label>
            <input name="start_time" type="time" value={form.start_time} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" required />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">End Time</label>
            <input name="end_time" type="time" value={form.end_time} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input name="location" value={form.location} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Mode</label>
          <select name="mode" value={form.mode} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2">
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-blue-600 text-white rounded py-2 hover:bg-blue-700">Save Changes</button>
          <button
            type="button"
            className="flex-1 bg-gray-200 text-gray-700 rounded py-2 hover:bg-gray-300"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                // 跳转到房间详情页
                window.location.href = `/dashboard/study-rooms/${roomId}`;
              }
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
