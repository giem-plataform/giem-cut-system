"use client";

interface Props {
  score: number;
}

export default function DisciplineScore({ score }: Props) {
  const color =
    score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : score >= 20 ? "#f97316" : "#ef4444";
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" className="-rotate-90">
        <circle cx="60" cy="60" r="45" fill="none" stroke="#334155" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute mt-9 text-2xl font-bold" style={{ color }}>
        {score}
      </div>
      <p className="text-xs text-gray-400 mt-1">Discipline</p>
    </div>
  );
}
