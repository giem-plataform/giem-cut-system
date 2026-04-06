export function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function todayDate(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function minutesSince(start: Date): number {
  return Math.floor((Date.now() - start.getTime()) / 60000);
}

export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

export function currentHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function calcDiscipline(opts: {
  fastingDone: boolean;
  mealsLogged: number;
  mealsTarget: number;
  workoutDone: boolean;
  weightLogged: boolean;
}): number {
  let score = 0;
  if (opts.fastingDone) score += 30;
  score += Math.min(30, (opts.mealsLogged / opts.mealsTarget) * 30);
  if (opts.workoutDone) score += 20;
  if (opts.weightLogged) score += 20;
  return Math.round(score);
}

export function apiResponse(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function apiError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
