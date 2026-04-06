import OpenAI from "openai";

// Support both OpenAI and Anthropic (Claude) via OpenAI-compatible SDK
let aiClient: OpenAI | null = null;
let modelName = "gpt-4o-mini";

if (process.env.ANTHROPIC_API_KEY) {
  aiClient = new OpenAI({
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: "https://api.anthropic.com/v1/",
  });
  modelName = "claude-sonnet-4-20250514";
} else if (process.env.OPENAI_API_KEY) {
  aiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  modelName = "gpt-4o-mini";
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

const SYSTEM_PROMPT = `Eres un coach de fitness conciso para un hombre de ~100kg en etapa de cut, que trabaja turno nocturno (8PM-5AM), duerme 5:30AM-1/2PM, ventana de comida 2PM-2AM.

Tus respuestas deben ser:
- En español
- Cortas y directas (2-3 oraciones max)
- Actionables y practicas
- Motivadoras sin ser cursis

Puedes dar tips sobre: nutricion, recetas simples de meal prep, timing de comidas, hidratacion, suplementos basicos, recuperacion, y disciplina.`;

function buildPrompt(data: DayData, extra?: string): string {
  let prompt = `Datos de hoy:
Peso: ${data.weight ?? "no registrado"} kg (meta: ${data.targetWeight} kg)
Calorias: ${data.calories ?? "no registrado"} / ${data.targetCalories}
Proteina: ${data.protein ?? "no registrado"}g / ${data.targetProtein}g
Ayuno completado: ${data.fastingDone ? "Si" : "No"}
Comidas registradas: ${data.mealsLogged}/${data.mealsTarget}
Score disciplina: ${data.disciplineScore}/100`;

  if (extra) prompt += `\n\nPregunta del usuario: ${extra}`;
  else prompt += "\n\nDa UN tip corto y accionable basado en estos datos.";

  return prompt;
}

export async function getRecommendation(data: DayData, userQuestion?: string): Promise<string> {
  if (aiClient) {
    try {
      return await aiRecommendation(data, userQuestion);
    } catch (err) {
      console.error("AI error, falling back to rules:", err);
      return ruleBasedRecommendation(data);
    }
  }
  return ruleBasedRecommendation(data);
}

async function aiRecommendation(data: DayData, userQuestion?: string): Promise<string> {
  if (process.env.ANTHROPIC_API_KEY) {
    return claudeRecommendation(data, userQuestion);
  }
  // OpenAI path
  const res = await aiClient!.chat.completions.create({
    model: modelName,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildPrompt(data, userQuestion) },
    ],
    max_tokens: 300,
    temperature: 0.7,
  });
  return res.choices[0]?.message?.content || ruleBasedRecommendation(data);
}

async function claudeRecommendation(data: DayData, userQuestion?: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: buildPrompt(data, userQuestion) },
      ],
    }),
  });

  const json = await res.json();
  if (json.content && json.content[0]?.text) {
    return json.content[0].text;
  }
  return ruleBasedRecommendation(data);
}

export async function getRecipeSuggestion(data: DayData, mealNum: number): Promise<string> {
  const remaining = {
    calories: Math.max(0, data.targetCalories - (data.calories || 0)),
    protein: Math.max(0, data.targetProtein - (data.protein || 0)),
  };

  const prompt = `Necesito una receta rapida para meal prep (comida ${mealNum} de ${data.mealsTarget}).
Me quedan ~${remaining.calories} calorias y ~${remaining.protein}g de proteina por cumplir hoy.
Dame UNA receta simple con: nombre, ingredientes, calorias/proteina aproximados, y preparacion en 3 pasos max.`;

  return getRecommendation(data, prompt);
}

function ruleBasedRecommendation(data: DayData): string {
  const tips: string[] = [];

  if (!data.fastingDone) {
    tips.push("Enfocate en completar tu ayuno hoy. Mantente hidratado con agua y cafe negro.");
  }

  if (data.protein && data.protein < data.targetProtein * 0.8) {
    tips.push(`Vas atras en proteina (${data.protein}g / ${data.targetProtein}g). Agrega una comida alta en proteina — pechuga, huevos o un shake.`);
  }

  if (data.calories && data.calories > data.targetCalories) {
    tips.push(`Pasaste las calorias por ${data.calories - data.targetCalories} kcal. Manten la cena mas ligera.`);
  }

  if (data.mealsLogged < data.mealsTarget) {
    tips.push(`Solo ${data.mealsLogged}/${data.mealsTarget} comidas registradas. Prepara las que faltan para mantenerte consistente.`);
  }

  if (data.weight && data.weight > data.targetWeight + 10) {
    tips.push("Camino largo — esta bien. Enfocate en tendencias semanales, no en cambios diarios. Consistencia mata perfeccion.");
  }

  if (data.disciplineScore >= 80) {
    tips.push("Disciplina fuerte hoy. Mantene esta energia — estas construyendo un habito.");
  } else if (data.disciplineScore < 50 && data.disciplineScore > 0) {
    tips.push("Dia dificil? Resetea ahora. Una buena comida y completar el ayuno cambian todo.");
  }

  if (tips.length === 0) {
    tips.push("Sigue asi. Registra todo, cumple tu proteina y respeta la ventana de ayuno.");
  }

  return tips[0];
}

export async function getDailySummary(data: DayData): Promise<string> {
  const lines: string[] = ["*Resumen del Dia*\n"];

  if (data.weight) lines.push(`⚖️ Peso: ${data.weight} kg (meta: ${data.targetWeight})`);
  lines.push(`🍽 Comidas: ${data.mealsLogged}/${data.mealsTarget}`);
  if (data.calories) lines.push(`🔥 Calorias: ${data.calories} / ${data.targetCalories}`);
  if (data.protein) lines.push(`💪 Proteina: ${data.protein}g / ${data.targetProtein}g`);
  lines.push(`⏰ Ayuno: ${data.fastingDone ? "✅" : "❌"}`);
  lines.push(`📊 Disciplina: ${data.disciplineScore}/100`);

  const tip = await getRecommendation(data);
  lines.push(`\n💡 *Tip:* ${tip}`);

  return lines.join("\n");
}
