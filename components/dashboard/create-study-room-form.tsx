"use client";

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, CheckCircle, AlertCircle } from "lucide-react"

interface FormData {
  name: string
  capacity: string
  description: string
  date: string
  start_time: string
  end_time: string
  location: string
  mode: "online" | "offline" | "hybrid" | "" // Entry mode
  creator_id?: string // Optional field for manual entry
}

export default function CreateStudyRoomForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    capacity: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    mode: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | "general", string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [showManualIdEntry, setShowManualIdEntry] = useState(false)
  const [userIdFetchStatus, setUserIdFetchStatus] = useState<"loading" | "error" | "success">("loading")

  // Fetch the user ID when component mounts
  useEffect(() => {
    const getUserId = async () => {
      setUserIdFetchStatus("loading")

      // First, try to get the user ID from localStorage
      const storedUserId = localStorage.getItem("userId")
      if (storedUserId && !isNaN(Number(storedUserId))) {
        console.log("Found user ID in localStorage:", storedUserId)
        setUserId(Number(storedUserId))
        setUserIdFetchStatus("success")
        return
      }

      // If not in localStorage, try to get it from the API
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        // Try different API endpoints that might contain user information
        const endpoints = [
          "https://studysmarterapp.onrender.com/api/user",
          "https://studysmarterapp.onrender.com/api/users/me",
          "https://studysmarterapp.onrender.com/api/profile",
          "https://studysmarterapp.onrender.com/api/auth/me",
        ]

        for (const endpoint of endpoints) {
          try {
            console.log(`Trying to fetch user data from: ${endpoint}`)
            const response = await fetch(endpoint, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })

            if (response.ok) {
              const data = await response.json()
              console.log(`User data from ${endpoint}:`, data)

              // Try to find the user ID in the response
              let foundId = null
              if (data.id) foundId = data.id
              else if (data.user && data.user.id) foundId = data.user.id
              else if (data.user_id) foundId = data.user_id
              else if (data._id) foundId = data._id

              if (foundId !== null) {
                console.log(`Found user ID: ${foundId} from endpoint: ${endpoint}`)
                setUserId(Number(foundId))
                localStorage.setItem("userId", foundId.toString())
                setUserIdFetchStatus("success")
                return
              }
            }
          } catch (error) {
            console.error(`Error fetching from ${endpoint}:`, error)
          }
        }

        // If we get here, we couldn't find the user ID
        console.error("Could not find user ID in any API response")
        setUserIdFetchStatus("error")
        setShowManualIdEntry(true)
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setUserIdFetchStatus("error")
        setShowManualIdEntry(true)
      }
    }

    getUserId()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Room name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = "Capacity is required"
    } else if (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0) {
      newErrors.capacity = "Capacity must be a positive number"
    }

    if (!formData.date.trim()) {
      newErrors.date = "Date is required"
    }
    if (!formData.start_time.trim() || !formData.end_time.trim()) {
      newErrors.start_time = "Start time is required"
      newErrors.end_time = "End time is required"
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }
    if (!formData.mode) {
      newErrors.mode = "Mode is required"
    }

    // Check if we have a valid user ID
    if (userId === null && (!formData.creator_id || isNaN(Number(formData.creator_id)))) {
      newErrors.creator_id = "Valid user ID is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Update the form submission to show confirmation and redirect properly
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSuccessMessage("")
    setApiResponse(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      // Use either the fetched user ID or the manually entered one
      const creatorId = userId !== null ? userId : Number(formData.creator_id)

      // Use raw HH:mm for start_time and end_time per API spec
      // No ISO formatting needed
      // Format the data according to what the API expects using snake_case
      // 确保所有字段都有默认值，不会传null或undefined给后端
      const requestData = {
        name: formData.name || "",
        capacity: Number(formData.capacity) || 0,
        creator_id: creatorId,
        description: formData.description || "",
        date: formData.date || "",
        start_time: formData.start_time || "00:00",
        end_time: formData.end_time || "00:00",
        location: formData.location || "",
        mode: formData.mode || "hybrid",
      }

      // Detailed logging for debugging
      console.log('Form data being submitted:', {
        ...formData,
        capacity: Number(formData.capacity),
        creator_id: creatorId
      })
      console.log('Request data being sent to API:', requestData)

      // Detailed logging
      console.log("Form data:", formData)
      console.log("Sending study room data:", requestData)
      console.log("Time values:", {
        startTime: formData.start_time,
        endTime: formData.end_time,
        start_time: requestData.start_time,
        end_time: requestData.end_time
      })

      console.log('Sending request to API...')
      const response = await fetch("https://studysmarterapp.onrender.com/api/study_rooms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
      
      const responseData = await response.json()
      console.log('API Response:', responseData)
      setApiResponse(responseData) // Store the API response for debugging
      
      if (!response.ok) {
        console.error("API Error Response:", responseData)
        setErrors({
          general: responseData.error || "Failed to create study room"
        })
        return
      }

      console.log('API Response time values:', {
        start_time: responseData.start_time,
        end_time: responseData.end_time
      })

      // Save room metadata to localStorage
      const roomMetadata = JSON.parse(localStorage.getItem('roomMetadata') || '{}');
      roomMetadata[responseData.room_id] = {
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        location: formData.location,
        mode: formData.mode
      };
      localStorage.setItem('roomMetadata', JSON.stringify(roomMetadata));
      console.log('Saved room metadata:', roomMetadata[responseData.room_id]);

      // Show success message
      setSuccessMessage(responseData.message || "Study room created successfully!")

      // Reset form
      setFormData({
        name: "",
        capacity: "",
        description: "",
        date: "",
        start_time: "",
        end_time: "",
        location: "",
        mode: "",
      })

      // Redirect to the new room's detail page
      if (responseData.room_id) {
        router.push(`/dashboard/study-rooms/${responseData.room_id}`)
      }

    } catch (error) {
      console.error("Error creating study room:", error)
      setErrors({
        ...errors,
        general: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* General Error Message */}
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
            <span>{errors.general}</span>
          </div>
        </div>
      )}

      {/* User ID Status */}
      {userIdFetchStatus === "loading" && (
        <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
          <div className="flex items-center">
            <span>Loading user information...</span>
          </div>
        </div>
      )}

      {userIdFetchStatus === "error" && !showManualIdEntry && (
        <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-700">
          <div className="flex items-center justify-between">
            <span>Could not retrieve your user ID. Please log out and log back in, or enter it manually.</span>
            <button
              type="button"
              onClick={() => setShowManualIdEntry(true)}
              className="ml-4 rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 hover:bg-yellow-200"
            >
              Enter Manually
            </button>
          </div>
        </div>
      )}

      {/* API Response Debug (always show for debugging) */}
      {apiResponse && (
        <div className="rounded-md bg-gray-50 p-4 text-xs text-gray-700">
          <details>
            <summary className="cursor-pointer font-medium">API Response (Debug)</summary>
            <pre className="mt-2 max-h-40 overflow-auto">{JSON.stringify(apiResponse, null, 2)}</pre>
          </details>
        </div>
      )}

      <div className="space-y-4">
        {/* Room Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Room Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter room name"
            className={`mt-1 block w-full rounded-md border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What is this room about?"
            rows={3}
            className={`mt-1 block w-full rounded-md border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Capacity */}
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
            Capacity*
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g. 5"
              className={`block w-full rounded-md border ${
                errors.capacity ? "border-red-500" : "border-gray-300"
              } pl-10 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
            />
          </div>
          {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
          <p className="mt-1 text-xs text-gray-500">Maximum number of participants</p>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date*</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.date ? "border-red-500" : "border-gray-300"} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>
        {/* Time */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time*</label>
            <input
              type="time"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${errors.start_time ? "border-red-500" : "border-gray-300"} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
            />
            {errors.start_time && <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>}
          </div>
          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time*</label>
            <input
              type="time"
              id="end_time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${errors.end_time ? "border-red-500" : "border-gray-300"} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
            />
            {errors.end_time && <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>}
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location*</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder={formData.mode === "online" ? "Enter Zoom/Teams link" : formData.mode === "offline" ? "Enter room number or building" : "Enter physical location and/or meeting link"}
            className={`mt-1 block w-full rounded-md border ${errors.location ? "border-red-500" : "border-gray-300"} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        {/* Mode */}
        <div>
          <label htmlFor="mode" className="block text-sm font-medium text-gray-700">Mode*</label>
          <select
            id="mode"
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.mode ? "border-red-500" : "border-gray-300"} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
          >
            <option value="">Select mode</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
          {errors.mode && <p className="mt-1 text-sm text-red-600">{errors.mode}</p>}
        </div>

        {/* Manual User ID Entry */}
        {showManualIdEntry && (
          <div>
            <label htmlFor="creator_id" className="block text-sm font-medium text-gray-700">
              Your User ID*
            </label>
            <input
              type="text"
              id="creator_id"
              name="creator_id"
              value={formData.creator_id || ""}
              onChange={handleChange}
              placeholder="Enter your user ID"
              className={`mt-1 block w-full rounded-md border ${
                errors.creator_id ? "border-red-500" : "border-gray-300"
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
            />
            {errors.creator_id && <p className="mt-1 text-sm text-red-600">{errors.creator_id}</p>}
            <p className="mt-1 text-xs text-gray-500">
              Enter your user ID. You can find this in your profile or by checking the console logs after logging in.
            </p>
          </div>
        )}
      </div>

      {/* Required Fields Note */}
      <div className="text-xs text-gray-500">* Required fields</div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || (userIdFetchStatus === "loading" && !showManualIdEntry)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  )
}
