import OpenAI from "openai";

let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

interface DayData {
  weight?: number;
  targetWeight: number;
  calories?: number;
  targetCalories: number;
  protein?: number;
  targetProtein: number;
  fastingDone: boolean;
  mealsLogged: number;
  mealsTarget: number;
  disciplineScore: number;
}

export async function getRecommendation(data: DayData): Promise<string> {
  if (openai) {
    try {
      return await aiRecommendation(data);
    } catch {
      return ruleBasedRecommendation(data);
    }
  }
  return ruleBasedRecommendation(data);
}

async function aiRecommendation(data: DayData): Promise<string> {
  const prompt = `You are a concise fitness coach for a ~100kg male on a cut, working night shift (8PM-5AM), sleeping 5:30AM-1/2PM, eating window 2PM-2AM. Give ONE short actionable tip (2-3 sentences max) based on today's data:
Weight: ${data.weight ?? "not logged"}kg (target: ${data.targetWeight}kg)
Calories: ${data.calories ?? "not logged"} / ${data.targetCalories}
Protein: ${data.protein ?? "not logged"}g / ${data.targetProtein}g
Fasting completed: ${data.fastingDone ? "Yes" : "No"}
Meals logged: ${data.mealsLogged}/${data.mealsTarget}
Discipline score: ${data.disciplineScore}/100`;

  const res = await openai!.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0.7,
  });

  return res.choices[0]?.message?.content || ruleBasedRecommendation(data);
}

function ruleBasedRecommendation(data: DayData): string {
  const tips: string[] = [];

  if (!data.fastingDone) {
    tips.push("Focus on completing your fast today. Stay hydrated with water and black coffee during the fasting window.");
  }

  if (data.protein && data.protein < data.targetProtein * 0.8) {
    tips.push(`You're behind on protein (${data.protein}g / ${data.targetProtein}g). Add a high-protein meal — chicken breast, eggs, or a shake.`);
  }

  if (data.calories && data.calories > data.targetCalories) {
    tips.push(`Over calorie target by ${data.calories - data.targetCalories} kcal. Keep dinner lighter or skip the snack.`);
  }

  if (data.mealsLogged < data.mealsTarget) {
    tips.push(`Only ${data.mealsLogged}/${data.mealsTarget} meals logged. Prep your remaining meals to stay consistent.`);
  }

  if (data.weight && data.weight > data.targetWeight + 10) {
    tips.push("Long road ahead — that's fine. Focus on weekly trends, not daily swings. Consistency beats perfection.");
  }

  if (data.disciplineScore >= 80) {
    tips.push("Strong discipline today. Keep this energy — you're building a habit.");
  } else if (data.disciplineScore < 50 && data.disciplineScore > 0) {
    tips.push("Rough day? Reset now. One good meal and a completed fast can turn it around.");
  }

  if (tips.length === 0) {
    tips.push("Keep going. Log everything, hit your protein, and respect the fasting window. You've got this.");
  }

  return tips[0];
}

export async function getDailySummary(data: DayData): Promise<string> {
  const lines: string[] = ["*Daily Summary*\n"];

  if (data.weight) lines.push(`⚖️ Weight: ${data.weight} kg (target: ${data.targetWeight})`);
  lines.push(`🍽 Meals: ${data.mealsLogged}/${data.mealsTarget}`);
  if (data.calories) lines.push(`🔥 Calories: ${data.calories} / ${data.targetCalories}`);
  if (data.protein) lines.push(`💪 Protein: ${data.protein}g / ${data.targetProtein}g`);
  lines.push(`⏰ Fasting: ${data.fastingDone ? "✅" : "❌"}`);
  lines.push(`📊 Discipline: ${data.disciplineScore}/100`);

  const tip = await getRecommendation(data);
  lines.push(`\n💡 *Tip:* ${tip}`);

  return lines.join("\n");
}
