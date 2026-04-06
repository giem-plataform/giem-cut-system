"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import WeightChart from "@/components/WeightChart";

interface WeightEntry {
  id: string;
  weight: number;
  note: string | null;
  date: string;
}

export default function WeightPage() {
  const [logs, setLogs] = useState<WeightEntry[]>([]);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [target, setTarget] = useState(85);

  useEffect(() => {
    fetch("/api/weight?days=90").then((r) => r.json()).then(setLogs);
    fetch("/api/settings").then((r) => r.json()).then((s) => setTarget(s.targetWeight));
  }, []);

  async function log() {
    const w = parseFloat(weight);
    if (isNaN(w)) return;
    await fetch("/api/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight: w, note: note || null }),
    });
    setWeight("");
    setNote("");
    const res = await fetch("/api/weight?days=90");
    setLogs(await res.json());
  }

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">Weight</h1>

      <div className="card">
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="99.5 kg"
            className="flex-1"
          />
          <button onClick={log} className="btn-primary">
            Log
          </button>
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          className="w-full mt-2"
        />
      </div>

      <div className="card">
        <h2 className="text-sm font-medium text-gray-400 mb-3">90 Day Trend</h2>
        <WeightChart
          data={logs.map((l) => ({ date: l.date, weight: l.weight }))}
          target={target}
        />
      </div>

      <div className="card">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Recent</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
          {logs
            .slice()
            .reverse()
            .slice(0, 14)
            .map((l) => (
              <div key={l.id} className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {new Date(l.date).toLocaleDateString("en", { month: "short", day: "numeric" })}
                </span>
                <span className="font-medium">{l.weight} kg</span>
              </div>
            ))}
        </div>
      </div>

      <Nav />
    </div>
  );
}
