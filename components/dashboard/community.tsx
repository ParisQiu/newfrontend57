import Link from "next/link"
import { MessageSquare } from "lucide-react"

export default function Community() {
  const discussions = [
    {
      id: 1,
      title: "Tips for memorizing biology terms?",
      author: "Alex Chen",
      replies: 12,
      time: "2 hours ago",
      subject: "Biology",
      description: "Biology is the study of living organisms, their structure, function, growth, evolution, and interactions. It covers everything from cells and genetics to ecosystems and biodiversity.",
    },
    {
      id: 2,
      title: "Study group for Calculus II final",
      author: "Maria Rodriguez",
      replies: 8,
      time: "Yesterday",
      subject: "Calculus",
      description: "Calculus explores rates of change and accumulation. It involves differentiation, integration, and their applications in science, engineering, and everyday problem-solving.",
    },
    {
      id: 3,
      title: "Best resources for Psychology research",
      author: "James Wilson",
      replies: 5,
      time: "2 days ago",
      subject: "Psychology",
      description: "Psychology is the scientific study of the mind and behavior. It covers topics like cognition, emotion, development, mental health, and social interaction.",
    },
  ]

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm dark:text-white">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold dark:text-white">Community Discussions</h2>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="rounded-md border p-3 hover:bg-gray-50 flex items-center">
              <img
                src="/blueportrait.jpg"
                alt="avatar"
                style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 12 }}
              />
              <div style={{ flex: 1 }}>
                <Link href={`/dashboard/community/discussions/${discussion.id}`}>
                  <div>
                    <h3 className="font-medium">{discussion.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{discussion.description}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{discussion.author}</span>
                      <div className="flex items-center text-xs text-gray-500">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        <span>{discussion.replies} replies</span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{discussion.time}</p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/dashboard/community" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all discussions (coming soon)
          </Link>
        </div>
      </div>
    </div>
  )
}
