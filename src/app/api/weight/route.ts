import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError, todayDate } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const days = Number(req.nextUrl.searchParams.get("days") || "30");
  const since = new Date();
  since.setDate(since.getDate() - days);

  const logs = await prisma.weightLog.findMany({
    where: { date: { gte: since } },
    orderBy: { date: "asc" },
  });
  return apiResponse(logs);
}

export async function POST(req: NextRequest) {
  const { weight, note, date } = await req.json();
  if (!weight || typeof weight !== "number") return apiError("Weight required");

  const d = date ? new Date(date) : todayDate();
  const log = await prisma.weightLog.create({
    data: { weight, note: note || null, date: d },
  });
  return apiResponse(log);
}
