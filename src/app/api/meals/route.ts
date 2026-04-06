import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError, todayDate } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const dateParam = req.nextUrl.searchParams.get("date");
  const d = dateParam ? new Date(dateParam) : todayDate();

  const meals = await prisma.mealLog.findMany({
    where: { date: d },
    orderBy: { mealNum: "asc" },
  });
  return apiResponse(meals);
}

export async function POST(req: NextRequest) {
  const { mealNum, name, calories, protein, carbs, fat, date } = await req.json();
  if (!mealNum || !name) return apiError("mealNum and name required");

  const d = date ? new Date(date) : todayDate();
  const meal = await prisma.mealLog.create({
    data: {
      mealNum,
      name,
      calories: calories || null,
      protein: protein || null,
      carbs: carbs || null,
      fat: fat || null,
      date: d,
    },
  });
  return apiResponse(meal);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return apiError("ID required");
  await prisma.mealLog.delete({ where: { id } });
  return apiResponse({ ok: true });
}
