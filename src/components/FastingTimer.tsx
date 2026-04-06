"use client";

import { useEffect, useState } from "react";

interface Props {
  startTime: string | null;
  targetMin: number;
}

export default function FastingTimer({ startTime, targetMin }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const start = new Date(startTime).getTime();
    const update = () => setElapsed(Math.floor((Date.now() - start) / 60000));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [startTime]);

  if (!startTime) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">No active fast</p>
      </div>
    );
  }

  const pct = Math.min(100, (elapsed / targetMin) * 100);
  const h = Math.floor(elapsed / 60);
  const m = elapsed % 60;
  const remaining = Math.max(0, targetMin - elapsed);
  const rh = Math.floor(remaining / 60);
  const rm = remaining % 60;

  return (
    <div className="text-center space-y-3">
      <div className="text-3xl font-bold text-white">
        {h}h {m}m
      </div>
      <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: pct >= 100 ? "#22c55e" : `linear-gradient(90deg, #60a5fa, #818cf8)`,
          }}
        />
      </div>
      <p className="text-sm text-gray-400">
        {pct >= 100 ? "Target reached!" : `${rh}h ${rm}m remaining`}
      </p>
    </div>
  );
}
