"use client"

import { useState } from "react"
import { CheckCircle, Clock, Plus } from "lucide-react"

export default function TodoReminders() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete Biology assignment", completed: false },
    { id: 2, text: "Review Calculus notes for quiz", completed: false },
    { id: 3, text: "Prepare presentation for Psychology", completed: true },
    { id: 4, text: "Read Chapter 7 of History textbook", completed: false },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm dark:text-white">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">Today's Tasks</h2>
        <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
          <Plus className="mr-1 h-4 w-4" />
          Add Task
        </button>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center rounded-md border p-3 ${
                task.completed ? "border-gray-200 bg-gray-50" : "border-gray-300"
              }`}
            >
              <button
                className={`mr-3 flex-shrink-0 ${task.completed ? "text-green-500" : "text-gray-400"}`}
                onClick={() => toggleTask(task.id)}
              >
                <CheckCircle className="h-5 w-5" />
              </button>
              <span className={`flex-grow ${task.completed ? "text-gray-500 line-through" : "text-gray-700"}`}>
                {task.text}
              </span>
              <button className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                <Clock className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all tasks
          </a>
        </div>
      </div>
    </div>
  )
}
