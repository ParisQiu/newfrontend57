import type { Metadata } from "next"
import Link from "next/link"
import LoginForm from "./login-form"
import Logo from "@/components/logo"

export const metadata: Metadata = {
  title: "Login | StudySmarter",
  description: "Login to your StudySmarter account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="mx-auto inline-block">
            <Logo className="mx-auto h-10 w-auto" />
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-600">Enter your credentials to access your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
