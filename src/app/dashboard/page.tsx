"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import WeightChart from "@/components/WeightChart";
import FastingTimer from "@/components/FastingTimer";
import DisciplineScore from "@/components/DisciplineScore";
import Link from "next/link";

interface DashData {
  weight: { date: string; weight: number }[];
  fasting: { startTime: string; endTime: string | null; targetMin: number } | null;
  daily: { disciplineScore: number; fastingDone: boolean; mealsLogged: number; workoutDone: boolean };
  meals: { id: string; mealNum: number; name: string; calories: number | null; protein: number | null }[];
  tip: string;
  settings: { targetWeight: number; targetCalories: number; targetProtein: number; mealsPerDay: number };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashData | null>(null);

  useEffect(() => {
    async function load() {
      const [weightRes, fastingRes, dailyRes, mealsRes, tipRes, settingsRes] = await Promise.all([
        fetch("/api/weight?days=30"),
        fetch("/api/fasting"),
        fetch("/api/daily"),
        fetch("/api/meals"),
        fetch("/api/ai"),
        fetch("/api/settings"),
      ]);
      const [weight, fasting, daily, meals, tip, settings] = await Promise.all([
        weightRes.json(),
        fastingRes.json(),
        dailyRes.json(),
        mealsRes.json(),
        tipRes.json(),
        settingsRes.json(),
      ]);
      setData({ weight, fasting, daily, meals, tip: tip.tip, settings });
    }
    load();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const totalCal = data.meals.reduce((s, m) => s + (m.calories || 0), 0);
  const totalProtein = data.meals.reduce((s, m) => s + (m.protein || 0), 0);
  const latestWeight = data.weight[data.weight.length - 1]?.weight;

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">GIEM</h1>
          <p className="text-gray-400 text-xs">
            {new Date().toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}
          </p>
        </div>
        <Link href="/settings" className="text-gray-400 hover:text-white text-xl">
          ⚙️
        </Link>
      </div>

      {/* Discipline + Quick Stats */}
      <div className="card flex items-center gap-4">
        <div className="relative">
          <DisciplineScore score={data.daily.disciplineScore} />
        </div>
        <div className="flex-1 space-y-2">
          {latestWeight && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Weight</span>
              <span className="font-medium">{latestWeight} kg</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Calories</span>
            <span className="font-medium">{totalCal} / {data.settings.targetCalories}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Protein</span>
            <span className="font-medium">{totalProtein}g / {data.settings.targetProtein}g</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Meals</span>
            <span className="font-medium">{data.meals.length} / {data.settings.mealsPerDay}</span>
          </div>
        </div>
      </div>

      {/* Fasting */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Fasting</h2>
        <FastingTimer
          startTime={data.fasting?.endTime === null ? data.fasting.startTime : null}
          targetMin={data.fasting?.targetMin || 720}
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={async () => {
              await fetch("/api/fasting", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "start" }),
              });
              location.reload();
            }}
            className="btn-primary flex-1 text-xs"
          >
            Start Fast
          </button>
          <button
            onClick={async () => {
              await fetch("/api/fasting", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "stop" }),
              });
              location.reload();
            }}
            className="btn-secondary flex-1 text-xs"
          >
            End Fast
          </button>
        </div>
      </div>

      {/* Weight Trend */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Weight Trend (30d)</h2>
        <WeightChart data={data.weight} target={data.settings.targetWeight} />
      </div>

      {/* AI Tip */}
      {data.tip && (
        <div className="card border-brand-600/30 bg-brand-600/5">
          <p className="text-xs text-brand-500 font-medium mb-1">AI Tip</p>
          <p className="text-sm text-gray-200">{data.tip}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/track" className="card text-center hover:border-brand-500 transition-colors">
          <span className="text-2xl">📝</span>
          <p className="text-xs text-gray-400 mt-1">Quick Track</p>
        </Link>
        <Link href="/meals" className="card text-center hover:border-brand-500 transition-colors">
          <span className="text-2xl">🍽</span>
          <p className="text-xs text-gray-400 mt-1">Log Meal</p>
        </Link>
        <Link href="/weight" className="card text-center hover:border-brand-500 transition-colors">
          <span className="text-2xl">⚖️</span>
          <p className="text-xs text-gray-400 mt-1">Log Weight</p>
        </Link>
        <Link href="/containers" className="card text-center hover:border-brand-500 transition-colors">
          <span className="text-2xl">📦</span>
          <p className="text-xs text-gray-400 mt-1">Containers</p>
        </Link>
      </div>

      <Nav />
    </div>
  );
}
