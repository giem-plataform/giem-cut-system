import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMessage, type TelegramUpdate } from "@/lib/telegram";
import { getDailySummary } from "@/lib/ai";
import { apiResponse, apiError, todayDate } from "@/lib/utils";

export async function POST(req: NextRequest) {
  // Verify webhook secret
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return apiError("Unauthorized", 401);
  }

  const update: TelegramUpdate = await req.json();
  const msg = update.message;
  if (!msg?.text) return apiResponse({ ok: true });

  const chatId = String(msg.chat.id);
  const allowedChatId = process.env.TELEGRAM_CHAT_ID;

  // Only respond to the owner
  if (allowedChatId && chatId !== allowedChatId) {
    return apiResponse({ ok: true });
  }

  const text = msg.text.trim().toLowerCase();
  const d = todayDate();

  try {
    if (text === "/start" || text === "/help") {
      await sendMessage(chatId, `*GIEM Cut System*\n\nCommands:\n/status — Today's summary\n/weight 99.5 — Log weight\n/meal 1 Chicken rice 500cal 40p — Log meal\n/fast start — Start fast\n/fast stop — End fast\n/workout — Toggle workout done\n/tip — Get AI recommendation\n/containers — View container status`);
    } else if (text === "/status") {
      const [settings, dailyLog, meals, weight] = await Promise.all([
        prisma.settings.findUnique({ where: { id: "singleton" } }),
        prisma.dailyLog.findUnique({ where: { date: d } }),
        prisma.mealLog.findMany({ where: { date: d } }),
        prisma.weightLog.findFirst({ where: { date: d } }),
      ]);
      const totalCal = meals.reduce((s, m) => s + (m.calories || 0), 0);
      const totalProtein = meals.reduce((s, m) => s + (m.protein || 0), 0);

      const summary = await getDailySummary({
        weight: weight?.weight,
        targetWeight: settings?.targetWeight || 85,
        calories: totalCal || undefined,
        targetCalories: settings?.targetCalories || 2000,
        protein: totalProtein || undefined,
        targetProtein: settings?.targetProtein || 160,
        fastingDone: dailyLog?.fastingDone || false,
        mealsLogged: meals.length,
        mealsTarget: settings?.mealsPerDay || 4,
        disciplineScore: dailyLog?.disciplineScore || 0,
      });
      await sendMessage(chatId, summary);
    } else if (text.startsWith("/weight")) {
      const parts = msg.text.trim().split(/\s+/);
      const w = parseFloat(parts[1]);
      if (isNaN(w)) {
        await sendMessage(chatId, "Usage: /weight 99.5");
      } else {
        await prisma.weightLog.create({ data: { weight: w, date: d } });
        await sendMessage(chatId, `Logged weight: *${w} kg*`);
      }
    } else if (text.startsWith("/meal")) {
      // /meal 1 Chicken rice 500cal 40p
      const parts = msg.text.trim().split(/\s+/);
      const mealNum = parseInt(parts[1]);
      if (isNaN(mealNum) || mealNum < 1 || mealNum > 4) {
        await sendMessage(chatId, "Usage: /meal 1 Chicken rice 500cal 40p");
      } else {
        const rest = parts.slice(2).join(" ");
        const calMatch = rest.match(/(\d+)\s*cal/i);
        const protMatch = rest.match(/(\d+)\s*p\b/i);
        const name = rest
          .replace(/\d+\s*cal/i, "")
          .replace(/\d+\s*p\b/i, "")
          .trim() || `Meal ${mealNum}`;

        await prisma.mealLog.create({
          data: {
            mealNum,
            name,
            calories: calMatch ? parseInt(calMatch[1]) : null,
            protein: protMatch ? parseInt(protMatch[1]) : null,
            date: d,
          },
        });
        await sendMessage(chatId, `Logged meal ${mealNum}: *${name}*${calMatch ? ` (${calMatch[1]} cal)` : ""}${protMatch ? ` (${protMatch[1]}g protein)` : ""}`);
      }
    } else if (text.startsWith("/fast")) {
      const action = text.split(/\s+/)[1];
      if (action === "start") {
        const existing = await prisma.fastingLog.findFirst({ where: { date: d, endTime: null } });
        if (existing) {
          await sendMessage(chatId, "Fast already running!");
        } else {
          await prisma.fastingLog.create({ data: { startTime: new Date(), date: d } });
          await sendMessage(chatId, "Fast started. Stay strong!");
        }
      } else if (action === "stop") {
        const active = await prisma.fastingLog.findFirst({ where: { date: d, endTime: null } });
        if (!active) {
          await sendMessage(chatId, "No active fast to stop.");
        } else {
          const mins = Math.floor((Date.now() - active.startTime.getTime()) / 60000);
          await prisma.fastingLog.update({ where: { id: active.id }, data: { endTime: new Date() } });
          const h = Math.floor(mins / 60);
          const m = mins % 60;
          await sendMessage(chatId, `Fast completed! Duration: *${h}h ${m}m*`);
        }
      } else {
        await sendMessage(chatId, "Usage: /fast start or /fast stop");
      }
    } else if (text === "/workout") {
      const log = await prisma.dailyLog.upsert({
        where: { date: d },
        create: { date: d, workoutDone: true },
        update: { workoutDone: true },
      });
      await sendMessage(chatId, log.workoutDone ? "Workout logged! 💪" : "Workout toggled.");
    } else if (text === "/tip") {
      const [settings, dailyLog, meals, weight] = await Promise.all([
        prisma.settings.findUnique({ where: { id: "singleton" } }),
        prisma.dailyLog.findUnique({ where: { date: d } }),
        prisma.mealLog.findMany({ where: { date: d } }),
        prisma.weightLog.findFirst({ where: { date: d } }),
      ]);
      const totalCal = meals.reduce((s, m) => s + (m.calories || 0), 0);
      const totalProtein = meals.reduce((s, m) => s + (m.protein || 0), 0);

      const { getRecommendation } = await import("@/lib/ai");
      const tip = await getRecommendation({
        weight: weight?.weight,
        targetWeight: settings?.targetWeight || 85,
        calories: totalCal || undefined,
        targetCalories: settings?.targetCalories || 2000,
        protein: totalProtein || undefined,
        targetProtein: settings?.targetProtein || 160,
        fastingDone: dailyLog?.fastingDone || false,
        mealsLogged: meals.length,
        mealsTarget: settings?.mealsPerDay || 4,
        disciplineScore: dailyLog?.disciplineScore || 0,
      });
      await sendMessage(chatId, `💡 *Tip:* ${tip}`);
    } else if (text === "/containers") {
      const containers = await prisma.container.findMany({ orderBy: { createdAt: "asc" } });
      const statusEmoji: Record<string, string> = { empty: "⬜", prepped: "🟩", eaten: "🟥" };
      const lines = containers.map(
        (c) => `${statusEmoji[c.status] || "⬜"} ${c.label}: ${c.contents || "empty"}${c.status === "prepped" ? " ✓" : ""}`
      );
      await sendMessage(chatId, `*Containers*\n\n${lines.join("\n")}`);
    } else {
      await sendMessage(chatId, "Unknown command. Try /help");
    }
  } catch (err) {
    console.error("Telegram webhook error:", err);
    await sendMessage(chatId, "Something went wrong. Try again.");
  }

  return apiResponse({ ok: true });
}
