"use client";

interface Meal {
  id: string;
  mealNum: number;
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

interface Props {
  mealNum: number;
  meal: Meal | undefined;
  onAdd: (mealNum: number) => void;
  onDelete: (id: string) => void;
}

export default function MealCard({ mealNum, meal, onAdd, onDelete }: Props) {
  if (!meal) {
    return (
      <button
        onClick={() => onAdd(mealNum)}
        className="w-full border-2 border-dashed border-dark-700 rounded-xl p-4 text-center hover:border-brand-500 transition-colors"
      >
        <span className="text-gray-500 text-sm">Meal {mealNum}</span>
        <p className="text-gray-400 text-xs mt-1">Tap to log</p>
      </button>
    );
  }

  return (
    <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs text-brand-500 font-medium">Meal {meal.mealNum}</span>
          <p className="text-white text-sm font-medium mt-0.5">{meal.name}</p>
        </div>
        <button
          onClick={() => onDelete(meal.id)}
          className="text-gray-500 hover:text-red-400 text-xs"
        >
          ✕
        </button>
      </div>
      <div className="flex gap-3 mt-2 text-xs text-gray-400">
        {meal.calories && <span>{meal.calories} cal</span>}
        {meal.protein && <span>{meal.protein}g P</span>}
        {meal.carbs && <span>{meal.carbs}g C</span>}
        {meal.fat && <span>{meal.fat}g F</span>}
      </div>
    </div>
  );
}
