"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

interface SignupForm {
  username: string
  email: string
  password: string
}

export default function SignupForm() {
  const router = useRouter()
  const [form, setForm] = useState<SignupForm>({
    username: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange = <K extends keyof SignupForm>(field: K, value: SignupForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("https://studysmarterapp.onrender.com/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      console.log("✅ Full signup response:", data)

      if (res.status === 201) {
        // Store token regardless of user info structure
        if (data.access_token) {
          localStorage.setItem("token", data.access_token)

          // Handle different response structures
          if (data.user && data.user.username) {
            localStorage.setItem("username", data.user.username)
          } else if (data.username) {
            localStorage.setItem("username", data.username)
          }

          // Save user ID to localStorage
          if (data.user && data.user.id) {
            localStorage.setItem("userId", data.user.id.toString())
          } else if (data.id) {
            localStorage.setItem("userId", data.id.toString())
          }

          console.log("Signup response data:", data) // Log the full response for debugging

          // Redirect to dashboard instead of homepage
          router.push("/dashboard")
        } else {
          setError("Signup succeeded but authentication token is missing")
        }
      } else {
        setError(data.message || "Signup failed")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Create a password"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>

      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account?</span>{" "}
        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </a>
      </div>
    </form>
  )
}
