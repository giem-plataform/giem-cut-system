import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMessage, getChatId } from "@/lib/telegram";
import { apiResponse, apiError, currentHHMM } from "@/lib/utils";

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sends this header)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return apiError("Unauthorized", 401);
  }

  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  if (!settings?.reminderEnabled) {
    return apiResponse({ sent: 0, reason: "disabled" });
  }

  const chatId = settings.telegramChatId || getChatId();
  if (!chatId) {
    return apiResponse({ sent: 0, reason: "no chat id" });
  }

  const now = currentHHMM();
  // Find reminders matching current 15-min window
  const [nowH, nowM] = now.split(":").map(Number);
  const nowTotalMin = nowH * 60 + nowM;

  const reminders = await prisma.reminder.findMany({ where: { enabled: true } });

  let sent = 0;
  for (const r of reminders) {
    const [rH, rM] = r.time.split(":").map(Number);
    const rTotalMin = rH * 60 + rM;
    // Check if reminder falls within the current 15-min window
    if (rTotalMin >= nowTotalMin && rTotalMin < nowTotalMin + 15) {
      await sendMessage(chatId, `⏰ *Reminder*\n${r.message}`);
      sent++;
    }
  }

  return apiResponse({ sent, time: now });
}
