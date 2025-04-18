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
    // No schedule options means it runs every day
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

// Example: Quarterly financial report
registerTask("quarterly-report", {
  name: "Quarterly Financial Report",
  handler: async () => {
    console.log("Generating quarterly financial report...")
    // Your financial report logic here
    return { status: "Financial report generated" }
  },
  schedule: {
    months: ["january", "april", "july", "october"],
    dates: [1],
  },
})

// Example: Bi-weekly team update
registerTask("team-update", {
  name: "Bi-weekly Team Update",
  handler: async () => {
    console.log("Sending team update...")
    // Your team update logic here
    return { status: "Team update sent" }
  },
  schedule: {
    weekNumbers: [1, 3], // First and third week of each month
  },
})
