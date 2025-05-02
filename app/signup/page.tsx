import type { Metadata } from "next"
import Link from "next/link"
import SignupForm from "./signup-form"
import Logo from "@/components/logo"

export const metadata: Metadata = {
  title: "Sign Up | StudySmarter",
  description: "Create a new StudySmarter account",
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="mx-auto inline-block">
            <Logo className="mx-auto h-10 w-auto" />
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Create an account</h1>
          <p className="mt-2 text-sm text-gray-600">Sign up to get started</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
