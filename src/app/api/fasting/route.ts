import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError, todayDate } from "@/lib/utils";

export async function GET() {
  const d = todayDate();
  const log = await prisma.fastingLog.findFirst({
    where: { date: d },
    orderBy: { createdAt: "desc" },
  });
  return apiResponse(log);
}

export async function POST(req: NextRequest) {
  const { action } = await req.json();
  const d = todayDate();

  if (action === "start") {
    const existing = await prisma.fastingLog.findFirst({
      where: { date: d, endTime: null },
    });
    if (existing) return apiError("Fast already running");

    const log = await prisma.fastingLog.create({
      data: { startTime: new Date(), date: d },
    });
    return apiResponse(log);
  }

  if (action === "stop") {
    const active = await prisma.fastingLog.findFirst({
      where: { date: d, endTime: null },
      orderBy: { createdAt: "desc" },
    });
    if (!active) return apiError("No active fast");

    const log = await prisma.fastingLog.update({
      where: { id: active.id },
      data: { endTime: new Date() },
    });
    return apiResponse(log);
  }

  return apiError("Invalid action");
}
