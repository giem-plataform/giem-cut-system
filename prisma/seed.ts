import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create default settings
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      fastingStart: "14:00",
      fastingEnd: "02:00",
      targetWeight: 85,
      targetCalories: 2000,
      targetProtein: 160,
      mealsPerDay: 4,
      reminderEnabled: true,
    },
  });

  // Create default reminders for night-shift schedule
  const defaultReminders = [
    { time: "13:30", message: "Wake up! Time to start your day." },
    { time: "14:00", message: "Eating window OPEN. Meal 1 time." },
    { time: "17:00", message: "Meal 2 — stay on track." },
    { time: "20:00", message: "Shift starting. Meal 3 ready?" },
    { time: "23:00", message: "Last meal window. Meal 4 before 2 AM." },
    { time: "01:30", message: "Eating window closing in 30 min!" },
    { time: "05:30", message: "Log your day before sleep." },
  ];

  for (const r of defaultReminders) {
    await prisma.reminder.create({ data: r });
  }

  // Create default containers
  for (let i = 1; i <= 8; i++) {
    await prisma.container.create({
      data: { label: `Container ${i}`, status: "empty" },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
