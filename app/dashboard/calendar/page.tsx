import Link from "next/link";

export default function CalendarPage() {
  // Just for visual purposes, a static calendar grid
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = Array.from({ length: 35 }, (_, i) => i + 1); // 5 weeks

  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Calendar
          </h1>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0">Coming Soon</span>
        </div>
        <div className="mb-6 text-center text-gray-600">
          The full calendar view is not available yet.<br />
          Please check back soon for an interactive calendar of all your study events and deadlines!
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {dates.map((date) => (
              <div key={date} className="h-14 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 border border-gray-200">
                {date <= 30 ? date : ""}
              </div>
            ))}
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

