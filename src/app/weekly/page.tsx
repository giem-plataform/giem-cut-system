"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import WeightChart from "@/components/WeightChart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Analytics {
  weights: { date: string; weight: number }[];
  dailyLogs: { date: string; discipline: number; fasting: boolean; meals: number }[];
  mealsByDate: Record<string, { calories: number; protein: number; count: number }>;
  avgDiscipline: number;
  weightTrend: number;
  currentWeight: number | null;
  targetWeight: number;
  targetCalories: number;
  targetProtein: number;
}

export default function WeeklyPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/analytics").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const disciplineData = data.dailyLogs.slice(-7).map((d) => ({
    date: new Date(d.date).toLocaleDateString("en", { weekday: "short" }),
    score: d.discipline,
  }));

  const calorieData = Object.entries(data.mealsByDate)
    .slice(-7)
    .map(([date, v]) => ({
      date: new Date(date).toLocaleDateString("en", { weekday: "short" }),
      calories: v.calories,
      protein: v.protein,
    }));

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">Weekly Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <p className="text-xs text-gray-400">Avg Discipline</p>
          <p className="text-2xl font-bold mt-1" style={{
            color: data.avgDiscipline >= 70 ? "#22c55e" : data.avgDiscipline >= 40 ? "#eab308" : "#ef4444"
          }}>
            {data.avgDiscipline}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-gray-400">Weight Trend</p>
          <p className={`text-2xl font-bold mt-1 ${data.weightTrend <= 0 ? "text-green-400" : "text-red-400"}`}>
            {data.weightTrend > 0 ? "+" : ""}{data.weightTrend} kg
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-gray-400">Current</p>
          <p className="text-2xl font-bold mt-1">{data.currentWeight || "—"}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-gray-400">Target</p>
          <p className="text-2xl font-bold mt-1 text-brand-500">{data.targetWeight}</p>
        </div>
      </div>

      {/* Weight Chart */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Weight</h2>
        <WeightChart data={data.weights} target={data.targetWeight} />
      </div>

      {/* Discipline Chart */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Discipline (7d)</h2>
        {disciplineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={disciplineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Bar dataKey="score" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">No data yet</p>
        )}
      </div>

      {/* Calories Chart */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Calories (7d)</h2>
        {calorieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={calorieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Bar dataKey="calories" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="protein" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">No data yet</p>
        )}
      </div>

      <Nav />
    </div>
  );
}
