import { NextResponse } from "next/server"
import { getAllTasks, registerTask, unregisterTask } from "@/lib/cron-scheduler"

// GET handler to list all registered tasks
export async function GET() {
  const tasks = getAllTasks()
  return NextResponse.json({ tasks })
}

// POST handler to register a new task
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { taskId, task } = body

    if (!taskId || !task || !task.name || !task.handler) {
      return NextResponse.json(
        { error: "Invalid task data. Required: taskId, task.name, and task.handler" },
        { status: 400 },
      )
    }

    // Convert the handler string to a function if it's provided as a string
    if (typeof task.handler === "string") {
      try {
        // Note: This is generally not recommended in production due to security concerns
        // eslint-disable-next-line no-new-func
        task.handler = new Function(`return ${task.handler}`)()
      } catch (error) {
        return NextResponse.json({ error: "Invalid handler function" }, { status: 400 })
      }
    }

    registerTask(taskId, task)

    return NextResponse.json({
      success: true,
      message: `Task "${taskId}" registered successfully`,
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

// DELETE handler to unregister a task
export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const taskId = url.searchParams.get("taskId")

  if (!taskId) {
    return NextResponse.json({ error: "taskId parameter is required" }, { status: 400 })
  }

  unregisterTask(taskId)

  return NextResponse.json({
    success: true,
    message: `Task "${taskId}" unregistered successfully`,
  })
}
