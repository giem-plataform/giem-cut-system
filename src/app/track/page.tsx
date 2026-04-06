"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";

export default function TrackPage() {
  const router = useRouter();
  const [daily, setDaily] = useState({
    fastingDone: false,
    workoutDone: false,
    sleepHours: "",
    notes: "",
    disciplineScore: 0,
    mealsLogged: 0,
  });

  useEffect(() => {
    fetch("/api/daily")
      .then((r) => r.json())
      .then((d) =>
        setDaily({
          fastingDone: d.fastingDone,
          workoutDone: d.workoutDone,
          sleepHours: d.sleepHours?.toString() || "",
          notes: d.notes || "",
          disciplineScore: d.disciplineScore,
          mealsLogged: d.mealsLogged,
        })
      );
  }, []);

  async function save() {
    await fetch("/api/daily", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fastingDone: daily.fastingDone,
        workoutDone: daily.workoutDone,
        sleepHours: daily.sleepHours ? parseFloat(daily.sleepHours) : null,
        notes: daily.notes || null,
      }),
    });
    router.push("/dashboard");
  }

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">Daily Check-in</h1>

      <div className="card space-y-4">
        {/* Toggles */}
        <label className="flex items-center justify-between">
          <span className="text-sm">Fasting Complete</span>
          <input
            type="checkbox"
            checked={daily.fastingDone}
            onChange={(e) => setDaily({ ...daily, fastingDone: e.target.checked })}
            className="w-5 h-5 accent-green-500"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-sm">Workout Done</span>
          <input
            type="checkbox"
            checked={daily.workoutDone}
            onChange={(e) => setDaily({ ...daily, workoutDone: e.target.checked })}
            className="w-5 h-5 accent-green-500"
          />
        </label>

        {/* Sleep */}
        <div>
          <label className="text-sm text-gray-400 block mb-1">Sleep Hours</label>
          <input
            type="number"
            step="0.5"
            value={daily.sleepHours}
            onChange={(e) => setDaily({ ...daily, sleepHours: e.target.value })}
            placeholder="7.5"
            className="w-full"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm text-gray-400 block mb-1">Notes</label>
          <textarea
            value={daily.notes}
            onChange={(e) => setDaily({ ...daily, notes: e.target.value })}
            rows={3}
            className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand-500"
            placeholder="How was today?"
          />
        </div>

        <button onClick={save} className="btn-primary w-full">
          Save Check-in
        </button>
      </div>

      <Nav />
    </div>
  );
}
