"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import MealCard from "@/components/MealCard";

interface Meal {
  id: string;
  mealNum: number;
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ mealNum: 1, name: "", calories: "", protein: "", carbs: "", fat: "" });
  const [mealsPerDay, setMealsPerDay] = useState(4);

  async function load() {
    const [mealsRes, settingsRes] = await Promise.all([
      fetch("/api/meals"),
      fetch("/api/settings"),
    ]);
    setMeals(await mealsRes.json());
    const settings = await settingsRes.json();
    setMealsPerDay(settings.mealsPerDay || 4);
  }

  useEffect(() => { load(); }, []);

  async function addMeal(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mealNum: form.mealNum,
        name: form.name,
        calories: form.calories ? parseInt(form.calories) : null,
        protein: form.protein ? parseInt(form.protein) : null,
        carbs: form.carbs ? parseInt(form.carbs) : null,
        fat: form.fat ? parseInt(form.fat) : null,
      }),
    });
    setForm({ mealNum: 1, name: "", calories: "", protein: "", carbs: "", fat: "" });
    setShowForm(false);
    load();
  }

  async function deleteMeal(id: string) {
    await fetch(`/api/meals?id=${id}`, { method: "DELETE" });
    load();
  }

  const totalCal = meals.reduce((s, m) => s + (m.calories || 0), 0);
  const totalProtein = meals.reduce((s, m) => s + (m.protein || 0), 0);

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Meals</h1>
        <div className="text-xs text-gray-400">
          {totalCal} cal | {totalProtein}g protein
        </div>
      </div>

      {/* Meal Slots */}
      <div className="space-y-3">
        {Array.from({ length: mealsPerDay }, (_, i) => i + 1).map((num) => (
          <MealCard
            key={num}
            mealNum={num}
            meal={meals.find((m) => m.mealNum === num)}
            onAdd={(n) => {
              setForm({ ...form, mealNum: n });
              setShowForm(true);
            }}
            onDelete={deleteMeal}
          />
        ))}
      </div>

      {/* Add Meal Form */}
      {showForm && (
        <form onSubmit={addMeal} className="card space-y-3">
          <h2 className="text-sm font-medium">Log Meal {form.mealNum}</h2>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Meal name"
            className="w-full"
            required
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
              placeholder="Calories"
            />
            <input
              type="number"
              value={form.protein}
              onChange={(e) => setForm({ ...form, protein: e.target.value })}
              placeholder="Protein (g)"
            />
            <input
              type="number"
              value={form.carbs}
              onChange={(e) => setForm({ ...form, carbs: e.target.value })}
              placeholder="Carbs (g)"
            />
            <input
              type="number"
              value={form.fat}
              onChange={(e) => setForm({ ...form, fat: e.target.value })}
              placeholder="Fat (g)"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      )}

      <Nav />
    </div>
  );
}
