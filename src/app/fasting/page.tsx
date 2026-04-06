"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import FastingTimer from "@/components/FastingTimer";

export default function FastingPage() {
  const [fasting, setFasting] = useState<{
    startTime: string;
    endTime: string | null;
    targetMin: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/fasting");
    const data = await res.json();
    setFasting(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function startFast() {
    await fetch("/api/fasting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start" }),
    });
    load();
  }

  async function stopFast() {
    await fetch("/api/fasting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "stop" }),
    });
    load();
  }

  const isActive = fasting && !fasting.endTime;

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">Fasting</h1>

      <div className="card">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading...</p>
        ) : (
          <>
            <FastingTimer
              startTime={isActive ? fasting!.startTime : null}
              targetMin={fasting?.targetMin || 720}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={startFast}
                disabled={!!isActive}
                className={`flex-1 btn ${isActive ? "bg-dark-700 text-gray-500 cursor-not-allowed" : "btn-primary"}`}
              >
                Start Fast
              </button>
              <button
                onClick={stopFast}
                disabled={!isActive}
                className={`flex-1 btn ${!isActive ? "bg-dark-700 text-gray-500 cursor-not-allowed" : "btn-danger"}`}
              >
                End Fast
              </button>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <h2 className="text-sm font-medium text-gray-400 mb-2">Your Schedule</h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Eating Window</span>
          <span>2:00 PM - 2:00 AM</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-400">Fasting Window</span>
          <span>2:00 AM - 2:00 PM</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-400">Target Duration</span>
          <span>12 hours</span>
        </div>
      </div>

      <Nav />
    </div>
  );
}
