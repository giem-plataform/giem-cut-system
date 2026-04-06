import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, todayDate } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const dateParam = req.nextUrl.searchParams.get("date");
  const d = dateParam ? new Date(dateParam) : todayDate();

  let log = await prisma.dailyLog.findUnique({ where: { date: d } });
  if (!log) {
    log = await prisma.dailyLog.create({ data: { date: d } });
  }
  return apiResponse(log);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const dateParam = body.date;
  const d = dateParam ? new Date(dateParam) : todayDate();

  const log = await prisma.dailyLog.upsert({
    where: { date: d },
    create: {
      date: d,
      disciplineScore: body.disciplineScore ?? 0,
      fastingDone: body.fastingDone ?? false,
      mealsLogged: body.mealsLogged ?? 0,
      workoutDone: body.workoutDone ?? false,
      sleepHours: body.sleepHours ?? null,
      notes: body.notes ?? null,
    },
    update: {
      ...(body.disciplineScore !== undefined && { disciplineScore: body.disciplineScore }),
      ...(body.fastingDone !== undefined && { fastingDone: body.fastingDone }),
      ...(body.mealsLogged !== undefined && { mealsLogged: body.mealsLogged }),
      ...(body.workoutDone !== undefined && { workoutDone: body.workoutDone }),
      ...(body.sleepHours !== undefined && { sleepHours: body.sleepHours }),
      ...(body.notes !== undefined && { notes: body.notes }),
    },
  });
  return apiResponse(log);
}
