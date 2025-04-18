type TaskFunction = () => Promise<any> | any

interface ScheduleOptions {
  days?: string[] // Days when this task should run (e.g., ['monday', 'wednesday'])
  dates?: number[] // Dates of the month when this task should run (e.g., [1, 15])
  months?: string[] // Months when this task should run (e.g., ['january', 'june'])
  weekNumbers?: number[] // Week numbers when this task should run (e.g., [1, 3] for 1st and 3rd week)
}

interface TaskDefinition {
  name: string
  handler: TaskFunction
  schedule: ScheduleOptions
}

// Registry to store all registered tasks
const taskRegistry: Record<string, TaskDefinition> = {}

/**
 * Register a new task to be executed by the cron job
 */
export function registerTask(taskId: string, task: TaskDefinition): void {
  taskRegistry[taskId] = task
}

/**
 * Unregister a task from the registry
 */
export function unregisterTask(taskId: string): void {
  if (taskRegistry[taskId]) {
    delete taskRegistry[taskId]
  }
}

/**
 * Get all registered tasks
 */
export function getAllTasks(): Record<string, TaskDefinition> {
  return { ...taskRegistry }
}

/**
 * Check if a task should run based on the current date or specified day
 */
function shouldTaskRun(task: TaskDefinition, date: Date, dayOverride?: string | null): boolean {
  const { schedule } = task

  // If no schedule options are specified, run the task every time
  if (!schedule || Object.keys(schedule).length === 0) {
    return true
  }

  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ]

  // Get current date information
  const currentDayName = dayOverride?.toLowerCase() || days[date.getDay()]
  const currentDateOfMonth = date.getDate()
  const currentMonth = months[date.getMonth()]

  // Calculate week number (1-indexed)
  const weekNumber = Math.ceil(currentDateOfMonth / 7)

  // Check each schedule constraint
  const dayMatch =
    !schedule.days || schedule.days.length === 0 || schedule.days.some((d) => d.toLowerCase() === currentDayName)

  const dateMatch = !schedule.dates || schedule.dates.length === 0 || schedule.dates.includes(currentDateOfMonth)

  const monthMatch =
    !schedule.months || schedule.months.length === 0 || schedule.months.some((m) => m.toLowerCase() === currentMonth)

  const weekMatch =
    !schedule.weekNumbers || schedule.weekNumbers.length === 0 || schedule.weekNumbers.includes(weekNumber)

  // All specified constraints must match
  return dayMatch && dateMatch && monthMatch && weekMatch
}

/**
 * Execute scheduled tasks based on the current day or specified day
 */
export async function executeScheduledTasks(dayOverride?: string | null): Promise<Record<string, any>> {
  const now = new Date()
  const results: Record<string, any> = {}
  const taskIds = Object.keys(taskRegistry)

  // If no tasks are registered, return early
  if (taskIds.length === 0) {
    return { message: "No tasks registered" }
  }

  // Execute each task that should run today
  for (const taskId of taskIds) {
    const task = taskRegistry[taskId]

    if (shouldTaskRun(task, now, dayOverride)) {
      try {
        const result = await task.handler()
        results[taskId] = {
          success: true,
          result,
          name: task.name,
        }
      } catch (error) {
        results[taskId] = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          name: task.name,
        }
      }
    } else {
      results[taskId] = {
        success: true,
        result: "Task skipped - not scheduled for this day/date",
        name: task.name,
      }
    }
  }

  return results
}
