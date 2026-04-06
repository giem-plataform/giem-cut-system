import { prisma } from "@/lib/prisma";
import { getRecommendation } from "@/lib/ai";
import { apiResponse, todayDate } from "@/lib/utils";

export async function GET() {
  const d = todayDate();

  const [settings, dailyLog, meals, weight] = await Promise.all([
    prisma.settings.findUnique({ where: { id: "singleton" } }),
    prisma.dailyLog.findUnique({ where: { date: d } }),
    prisma.mealLog.findMany({ where: { date: d } }),
    prisma.weightLog.findFirst({ where: { date: d } }),
  ]);

  const totalCal = meals.reduce((s, m) => s + (m.calories || 0), 0);
  const totalProtein = meals.reduce((s, m) => s + (m.protein || 0), 0);

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

  return apiResponse({ tip });
}
