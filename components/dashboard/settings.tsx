"use client";

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
  // Initial values (could come from props or context in a real app)
  const initialTheme = "light";
  const initialNotifications = true;

  const [theme, setTheme] = useState(initialTheme);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Optionally, you could handle saving logic here
    router.push("/dashboard");
  };

  const handleCancel = () => {
    setTheme(initialTheme);
    setNotifications(initialNotifications);
    setPassword("");
    router.push("/dashboard");
  };

  // Theme toggle: update <html> class and persist to localStorage
  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("theme", newTheme);
    }
  };

  // On mount, sync theme from localStorage and <html> class
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      } else {
        setTheme("light");
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  return (
    <form onSubmit={handleSave} className="max-w-xl mx-auto rounded-lg border bg-white dark:bg-gray-900 shadow-sm p-6 dark:text-white">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Settings</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Name</label>
        <input className="w-full border rounded px-3 py-2" value="Jane Doe" readOnly />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Email</label>
        <input className="w-full border rounded px-3 py-2" value="jane@example.com" readOnly />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Change Password</label>
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
          className="mr-2"
        />
        <span>Enable Email Notifications</span>
      </div>
      <div className="mb-6 flex items-center">
        <span className="mr-2 font-medium">Theme:</span>
        <button
          type="button"
          onClick={handleThemeToggle}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          {theme === "light" ? "Light" : "Dark"}
        </button>
      </div>
      <div className="flex gap-4">
        <button type="submit" className="flex-1 bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
        <button type="button" className="flex-1 bg-gray-200 text-gray-800 font-medium py-2 rounded hover:bg-gray-300" onClick={handleCancel}>
          Cancel
        </button>
      </div>
      {feedback && (
        <div className="mt-4 text-center text-sm text-green-600">{feedback}</div>
      )}
    </form>
  );
}

