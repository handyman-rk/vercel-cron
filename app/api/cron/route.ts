import { NextResponse } from "next/server"
import { executeScheduledTasks } from "@/lib/cron-scheduler"

export async function GET(request: Request) {
  try {
    // Get the day parameter from the URL if provided
    const url = new URL(request.url)
    const day = url.searchParams.get("day")

    // Verify this is a legitimate Vercel cron job request
    const userAgent = request.headers.get("user-agent") || ""
    const isVercelCron = userAgent.includes("vercel-cron")

    if (!isVercelCron && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized: Not a Vercel cron request" }, { status: 401 })
    }

    // Execute the tasks for the specified day or current day if not specified
    const result = await executeScheduledTasks(day)

    return NextResponse.json({
      success: true,
      message: "Cron job executed successfully",
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Cron job execution failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
