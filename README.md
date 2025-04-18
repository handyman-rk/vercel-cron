# Vercel Flexible Cron Job Library

A lightweight, flexible library for managing scheduled tasks with Vercel Cron Jobs. This library allows you to define tasks with various scheduling options directly in your code.

## Features

- 🕒 **Flexible Scheduling**: Schedule tasks by day of week, date of month, month, or week number
- 🔄 **Simple API**: Register tasks with a clean, intuitive API
- 🚀 **Zero Dependencies**: No external dependencies required
- ⚡ **Vercel Integration**: Works seamlessly with Vercel Cron Jobs
- 🧩 **Composable**: Combine different scheduling options for complex patterns

## Installation

1. Add the library files to your Next.js project:
   - `lib/cron-scheduler.ts` - Core library
   - `app/api/cron/route.ts` - Vercel cron job endpoint
   - `vercel.json` - Vercel configuration

2. Configure your cron schedule in `vercel.json`:

\`\`\`json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 0 * * *"
    }
  ]
}
\`\`\`

## Usage

### Basic Usage

Create a file to define your tasks (e.g., `lib/tasks.ts`):

\`\`\`typescript
import { registerTask } from './cron-scheduler';

// Daily task (runs every day)
registerTask("daily-task", {
  name: "Daily Task",
  handler: async () => {
    // Your task implementation
    console.log("Running daily task...");
    return { status: "completed" };
  },
  schedule: {} // Empty schedule means run every time
});
\`\`\`

Import this file early in your application lifecycle to register the tasks:

\`\`\`typescript
// In app/layout.tsx or similar
import '../lib/tasks';
\`\`\`

### Scheduling Options

The library supports various scheduling options that can be combined:

#### Run on specific days of the week

\`\`\`typescript
registerTask("weekly-task", {
  name: "Weekly Task",
  handler: async () => {
    // Your task implementation
    return { status: "completed" };
  },
  schedule: {
    days: ["monday", "wednesday", "friday"]
  }
});
\`\`\`

#### Run on specific dates of the month

\`\`\`typescript
registerTask("monthly-task", {
  name: "Monthly Task",
  handler: async () => {
    // Your task implementation
    return { status: "completed" };
  },
  schedule: {
    dates: [1, 15] // Runs on the 1st and 15th of each month
  }
});
\`\`\`

#### Run in specific months

\`\`\`typescript
registerTask("quarterly-task", {
  name: "Quarterly Task",
  handler: async () => {
    // Your task implementation
    return { status: "completed" };
  },
  schedule: {
    months: ["january", "april", "july", "october"]
  }
});
\`\`\`

#### Run on specific weeks of the month

\`\`\`typescript
registerTask("biweekly-task", {
  name: "Biweekly Task",
  handler: async () => {
    // Your task implementation
    return { status: "completed" };
  },
  schedule: {
    weekNumbers: [1, 3] // Runs on the 1st and 3rd week of each month
  }
});
\`\`\`

#### Combine multiple scheduling options

\`\`\`typescript
registerTask("complex-task", {
  name: "Complex Task",
  handler: async () => {
    // Your task implementation
    return { status: "completed" };
  },
  schedule: {
    days: ["monday"],
    months: ["january", "july"],
    weekNumbers: [2, 4] // 2nd and 4th Monday in January and July
  }
});
\`\`\`

## API Reference

### `registerTask(taskId: string, task: TaskDefinition): void`

Registers a new task with the specified ID and definition.

Parameters:
- `taskId`: A unique identifier for the task
- `task`: The task definition object

### `unregisterTask(taskId: string): void`

Removes a task from the registry.

Parameters:
- `taskId`: The ID of the task to remove

### `getAllTasks(): Record<string, TaskDefinition>`

Returns all registered tasks.

### Task Definition

\`\`\`typescript
interface TaskDefinition {
  name: string;                // Human-readable name
  handler: () => Promise<any>; // Function to execute
  schedule: {                  // When to run the task
    days?: string[];           // Days of week (e.g., "monday")
    dates?: number[];          // Dates of month (e.g., 1, 15)
    months?: string[];         // Months (e.g., "january")
    weekNumbers?: number[];    // Week numbers in month (e.g., 1, 3)
  };
}
\`\`\`

## Deployment

Deploy your project to Vercel to activate the cron job:

\`\`\`bash
vercel deploy --prod
\`\`\`

Important notes:
- Cron jobs only run in production deployments, not in preview deployments
- Vercel cron jobs are triggered by making an HTTP GET request to the specified path
- The cron job will run according to the schedule specified in `vercel.json`

## Examples

### Database Backup

\`\`\`typescript
registerTask("db-backup", {
  name: "Database Backup",
  handler: async () => {
    // Connect to your database
    // Create a backup
    // Store the backup
    return { status: "Backup completed", timestamp: new Date().toISOString() };
  },
  schedule: {
    days: ["monday", "wednesday", "friday"]
  }
});
\`\`\`

### Send Weekly Newsletter

\`\`\`typescript
registerTask("newsletter", {
  name: "Weekly Newsletter",
  handler: async () => {
    // Fetch newsletter content
    // Get subscriber list
    // Send emails
    return { status: "Newsletter sent", recipientCount: 1250 };
  },
  schedule: {
    days: ["friday"],
    // Only send at 9am - this is handled by the Vercel cron schedule
    // in vercel.json, not by this library
  }
});
\`\`\`

### Monthly Report Generation

\`\`\`typescript
registerTask("monthly-report", {
  name: "Monthly Report",
  handler: async () => {
    // Generate reports
    // Store in database
    // Notify stakeholders
    return { status: "Reports generated" };
  },
  schedule: {
    dates: [1] // First day of each month
  }
});
\`\`\`

## License

MIT
