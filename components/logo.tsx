import { BookOpen } from "lucide-react"

interface LogoProps {
  className?: string
}

export default function Logo({ className = "h-8 w-auto" }: LogoProps) {
  return (
    <div className="flex items-center">
      <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
        <BookOpen className="h-5 w-5" />
      </div>
      <span className="text-xl font-bold">
        <span className="text-blue-600">Study</span>
        <span className="text-gray-900">Smarter</span>
      </span>
    </div>
  )
}
