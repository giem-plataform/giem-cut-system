"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface Props {
  data: { date: string; weight: number }[];
  target: number;
}

export default function WeightChart({ data, target }: Props) {
  if (data.length === 0) {
    return <p className="text-gray-500 text-sm text-center py-8">No weight data yet. Start logging!</p>;
  }

  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    weight: d.weight,
  }));

  const weights = data.map((d) => d.weight);
  const min = Math.floor(Math.min(...weights, target) - 2);
  const max = Math.ceil(Math.max(...weights) + 2);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={formatted} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <YAxis domain={[min, max]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <ReferenceLine y={target} stroke="#22c55e" strokeDasharray="5 5" label={{ value: `Target: ${target}`, fill: "#22c55e", fontSize: 11 }} />
        <Line type="monotone" dataKey="weight" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
