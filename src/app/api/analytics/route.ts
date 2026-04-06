import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/lib/utils";

export async function GET() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [weights, dailyLogs, meals, settings] = await Promise.all([
    prisma.weightLog.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "asc" },
    }),
    prisma.dailyLog.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "asc" },
    }),
    prisma.mealLog.findMany({
      where: { date: { gte: since } },
    }),
    prisma.settings.findUnique({ where: { id: "singleton" } }),
  ]);

  // Aggregate meals by date
  const mealsByDate: Record<string, { calories: number; protein: number; count: number }> = {};
  for (const m of meals) {
    const key = m.date.toISOString().split("T")[0];
    if (!mealsByDate[key]) mealsByDate[key] = { calories: 0, protein: 0, count: 0 };
    mealsByDate[key].calories += m.calories || 0;
    mealsByDate[key].protein += m.protein || 0;
    mealsByDate[key].count += 1;
  }

  // Weekly averages
  const last7 = dailyLogs.slice(-7);
  const avgDiscipline = last7.length
    ? Math.round(last7.reduce((s, d) => s + d.disciplineScore, 0) / last7.length)
    : 0;

  const weightTrend = weights.length >= 2
    ? weights[weights.length - 1].weight - weights[0].weight
    : 0;

  return apiResponse({
    weights: weights.map((w) => ({ date: w.date, weight: w.weight })),
    dailyLogs: dailyLogs.map((d) => ({
      date: d.date,
      discipline: d.disciplineScore,
      fasting: d.fastingDone,
      meals: d.mealsLogged,
    })),
    mealsByDate,
    avgDiscipline,
    weightTrend: Math.round(weightTrend * 10) / 10,
    currentWeight: weights[weights.length - 1]?.weight || null,
    targetWeight: settings?.targetWeight || 85,
    targetCalories: settings?.targetCalories || 2000,
    targetProtein: settings?.targetProtein || 160,
  });
}
