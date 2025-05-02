"use client";
import React, { useState, useEffect } from "react";

export default function ProfileClient() {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gender", gender || "");
      localStorage.setItem("region", region || "");
      localStorage.setItem("phone", phone || "");
    }
    setEditing(false);
  };

  const handleCancel = () => {
    if (typeof window !== "undefined") {
      setGender(localStorage.getItem("gender"));
      setRegion(localStorage.getItem("region"));
      setPhone(localStorage.getItem("phone"));
    }
    setEditing(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("username"));
      setEmail(localStorage.getItem("email"));
      setGender(localStorage.getItem("gender"));
      setRegion(localStorage.getItem("region"));
      setPhone(localStorage.getItem("phone"));
    }
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="text-blue-600 hover:underline">
            Edit
          </button>
        )}
      </div>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" id="username" readOnly value={username || ""} disabled={!editing} className="mt-1 block w-full rounded border-gray-300 bg-gray-100" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" readOnly value={email || ""} disabled={!editing} className="mt-1 block w-full rounded border-gray-300 bg-gray-100" />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <input type="text" id="gender" value={gender || ""} disabled={!editing} onChange={e => setGender(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
          </div>
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</label>
            <input type="text" id="region" value={region || ""} disabled={!editing} onChange={e => setRegion(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Cell Phone</label>
            <input type="text" id="phone" value={phone || ""} disabled={!editing} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
          </div>
        </div>
        {editing && (
          <div className="flex space-x-2 pt-4">
            <button type="button" onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">
              Save
            </button>
            <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 text-black rounded">
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
