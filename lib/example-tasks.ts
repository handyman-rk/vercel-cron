import { registerTask } from "./cron-scheduler"

// Example: Daily backup task
registerTask("daily-backup", {
  name: "Daily Database Backup",
  handler: async () => {
    console.log("Running daily backup...")
    // Your backup logic here
    return { status: "Backup completed successfully" }
  },
  schedule: {
    // Empty schedule means it runs every day
  },
})

// Example: Weekly report task
registerTask("weekly-report", {
  name: "Weekly Analytics Report",
  handler: async () => {
    console.log("Generating weekly report...")
    // Your report generation logic here
    return { status: "Report generated and sent" }
  },
  schedule: {
    days: ["monday"], // Only runs on Mondays
  },
})

// Example: Monthly maintenance task
registerTask("monthly-maintenance", {
  name: "Monthly System Maintenance",
  handler: async () => {
    console.log("Performing monthly maintenance...")
    // Your maintenance logic here
    return { status: "Maintenance completed" }
  },
  schedule: {
    dates: [1], // Runs on the 1st of each month
  },
})
