"use client";

import { useState } from "react";

interface Container {
  id: string;
  label: string;
  contents: string | null;
  status: string;
  prepDate: string | null;
}

interface Props {
  containers: Container[];
  onUpdate: (id: string, data: Partial<Container>) => void;
}

const statusColors: Record<string, string> = {
  empty: "border-gray-600 bg-dark-800",
  prepped: "border-green-500 bg-green-500/10",
  eaten: "border-red-500 bg-red-500/10",
};

const statusLabels: Record<string, string> = {
  empty: "Empty",
  prepped: "Prepped",
  eaten: "Eaten",
};

const nextStatus: Record<string, string> = {
  empty: "prepped",
  prepped: "eaten",
  eaten: "empty",
};

export default function ContainerGrid({ containers, onUpdate }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  return (
    <div className="grid grid-cols-2 gap-3">
      {containers.map((c) => (
        <div
          key={c.id}
          className={`rounded-xl border-2 p-3 transition-all ${statusColors[c.status]}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-gray-400">{c.label}</span>
            <button
              onClick={() => onUpdate(c.id, { status: nextStatus[c.status] })}
              className="text-xs px-2 py-0.5 rounded-full bg-dark-700 hover:bg-dark-600 text-gray-300"
            >
              {statusLabels[c.status]}
            </button>
          </div>
          {editing === c.id ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdate(c.id, { contents: editVal });
                setEditing(null);
              }}
            >
              <input
                autoFocus
                value={editVal}
                onChange={(e) => setEditVal(e.target.value)}
                onBlur={() => {
                  onUpdate(c.id, { contents: editVal });
                  setEditing(null);
                }}
                className="w-full bg-dark-900 text-white text-sm rounded px-2 py-1 outline-none border border-dark-700 focus:border-brand-500"
                placeholder="What's inside?"
              />
            </form>
          ) : (
            <p
              onClick={() => {
                setEditing(c.id);
                setEditVal(c.contents || "");
              }}
              className="text-sm text-white truncate cursor-pointer hover:text-brand-500"
            >
              {c.contents || "Tap to add"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
