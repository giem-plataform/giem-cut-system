"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import ContainerGrid from "@/components/ContainerGrid";

interface Container {
  id: string;
  label: string;
  contents: string | null;
  status: string;
  prepDate: string | null;
}

export default function ContainersPage() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  async function load() {
    const res = await fetch("/api/containers");
    setContainers(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function updateContainer(id: string, data: Partial<Container>) {
    await fetch("/api/containers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    load();
  }

  async function addContainer(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel.trim()) return;
    await fetch("/api/containers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel.trim() }),
    });
    setNewLabel("");
    setShowAdd(false);
    load();
  }

  async function resetAll() {
    for (const c of containers) {
      await fetch("/api/containers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, status: "empty", contents: null }),
      });
    }
    load();
  }

  const prepped = containers.filter((c) => c.status === "prepped").length;
  const eaten = containers.filter((c) => c.status === "eaten").length;

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Meal Prep</h1>
        <div className="text-xs text-gray-400">
          {prepped} ready | {eaten} eaten
        </div>
      </div>

      <ContainerGrid containers={containers} onUpdate={updateContainer} />

      <div className="flex gap-2">
        <button onClick={() => setShowAdd(true)} className="btn-primary flex-1">
          + Add Container
        </button>
        <button onClick={resetAll} className="btn-secondary flex-1">
          Reset All
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addContainer} className="card flex gap-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Container label"
            className="flex-1"
            autoFocus
          />
          <button type="submit" className="btn-primary">Add</button>
        </form>
      )}

      <div className="card text-xs text-gray-500 space-y-1">
        <p>Tap status to cycle: Empty → Prepped → Eaten → Empty</p>
        <p>Tap content to edit what's inside</p>
      </div>

      <Nav />
    </div>
  );
}
