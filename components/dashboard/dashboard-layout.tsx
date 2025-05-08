"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Calendar, ChevronDown, HelpCircle, Home, LogOut, Menu, Search, Settings, User, Users, X } from "lucide-react"
import Logo from "@/components/logo"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Global theme sync
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const storedUsername = localStorage.getItem("username")
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    setUsername(storedUsername)
  }, [router])

  const handleLogout = () => {
    const performLogout = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          // Try to call the logout API endpoint
          await fetch("http://127.0.0.1:5000/api/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }).catch((err) => console.error("Logout API error:", err))
        }
      } catch (error) {
        console.error("Logout error:", error)
      } finally {
        // Always clear local storage and redirect regardless of API success
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        router.push("/login")
      }
    }

    performLogout()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
    if (isNotificationsOpen) setIsNotificationsOpen(false)
  }

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen)
    if (isProfileMenuOpen) setIsProfileMenuOpen(false)
  }

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "My Study Rooms", href: "/dashboard/study-rooms" },
    { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },


  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-950 dark:text-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <header className="flex items-center justify-between border-b bg-white dark:bg-gray-950 dark:text-white px-6 py-4 shadow-sm">
            <Logo className="h-8 w-auto" />
            <button
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
              onClick={toggleSidebar}
            >
              <X className="h-6 w-6" />
            </button>
          </header>

          {/* Sidebar navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="flex items-center rounded-md px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t pt-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center rounded-md px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/help-center"
                    className="flex items-center rounded-md px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <HelpCircle className="mr-3 h-5 w-5" />
                    <span>Help Center</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Top navigation */}
        <header className="border-b bg-white dark:bg-gray-950 dark:text-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <button
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
                onClick={toggleSidebar}
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="ml-4 hidden md:block">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  className="relative rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  onClick={toggleNotifications}
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    3
                  </span>
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-md border border-gray-200 bg-white shadow-lg">
                    <div className="border-b p-4">
                      <h3 className="text-lg font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[
                        {
                          title: "New study room invitation",
                          message: "Alex invited you to join 'Biology 101 Finals Prep'",
                          time: "10 minutes ago",
                        },
                        {
                          title: "Assignment reminder",
                          message: "Physics homework due tomorrow at 11:59 PM",
                          time: "1 hour ago",
                        },
                        {
                          title: "Study streak milestone",
                          message: "Congratulations! You've maintained a 7-day study streak",
                          time: "5 hours ago",
                        },
                      ].map((notification, index) => (
                        <div key={index} className="border-b p-4 hover:bg-gray-50">
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t p-2 text-center">
                      <Link
                        href="/dashboard/notifications"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  className="flex items-center rounded-full text-gray-700 hover:text-gray-900"
                  onClick={toggleProfileMenu}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="ml-2 hidden text-sm font-medium md:block">{username || "User"}</span>
                  <ChevronDown className="ml-1 hidden h-4 w-4 md:block" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                    <div className="border-b p-3">
                      <p className="text-sm font-medium">{username || "User"}</p>
                      <p className="text-xs text-gray-500">{typeof window !== 'undefined' && localStorage.getItem('email') || 'No email'}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                    </div>
                    <div className="border-t py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="border-t p-2 md:hidden">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>

        {/* Footer */}
        <footer className="border-t bg-white py-4 text-center text-sm text-gray-600">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
              <p> 2024 StudySmarter. All rights reserved.</p>
              <div className="flex space-x-4">
                <Link href="/dashboard/help-center" className="hover:text-blue-600">
                  Help Center
                </Link>
                <Link href="/feedback" className="hover:text-blue-600">
                  Feedback
                </Link>
                <Link href="/terms" className="hover:text-blue-600">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-blue-600">
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
