"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/tasks")

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()
      const taskArray = Object.entries(data.tasks || {}).map(([id, task]: [string, any]) => ({
        id,
        ...task,
        // Convert handler function to string for display
        handler: task.handler ? "Function" : "No handler defined",
      }))

      setTasks(taskArray)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const triggerCronManually = async (day?: string) => {
    try {
      setLoading(true)
      const url = day ? `/api/cron?day=${day}` : "/api/cron"
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to trigger cron job")
      }

      alert("Cron job triggered successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Cron Job Task Dashboard</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Manual Trigger</CardTitle>
            <CardDescription>Manually trigger the cron job to run tasks for a specific day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                <Button key={day} variant="outline" onClick={() => triggerCronManually(day)} disabled={loading}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => triggerCronManually()} disabled={loading}>
              Run All Tasks (Today)
            </Button>
          </CardFooter>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Registered Tasks</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks registered yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle>{task.name}</CardTitle>
                <CardDescription>{task.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>
                    <strong>Task ID:</strong> {task.id}
                  </p>
                  {task.days && task.days.length > 0 && (
                    <p>
                      <strong>Days:</strong> {task.days.join(", ")}
                    </p>
                  )}
                  {task.dates && task.dates.length > 0 && (
                    <p>
                      <strong>Dates:</strong> {task.dates.join(", ")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
