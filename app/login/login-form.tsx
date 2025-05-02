"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("https://studysmarterapp.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()
      console.log("Login response:", data) // Debug information

      if (!res.ok) {
        setError(data.message || "Login failed")
        setLoading(false)
        return
      }

      // Save token and username
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("username", data.user.username)
      // Save email for profile display
      localStorage.setItem("email", data.user.email || form.email)

      // Save user ID to localStorage
      if (data.user && data.user.id) {
        localStorage.setItem("userId", data.user.id.toString())
      } else if (data.id) {
        localStorage.setItem("userId", data.id.toString())
      }

      console.log("Login response data:", data) // Log the full response for debugging

      // Redirect to dashboard instead of home page
      router.push("/dashboard")
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
            className="mt-1"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              name="rememberMe"
              checked={form.rememberMe}
              onCheckedChange={(checked) =>
                setForm({
                  ...form,
                  rememberMe: checked === true,
                })
              }
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal">
              Remember me
            </Label>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">Don't have an account?</span>{" "}
        <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
          Sign up
        </a>
      </div>
    </form>
  )
}
