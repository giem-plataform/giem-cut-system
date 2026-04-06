"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";

interface Reminder {
  id: string;
  time: string;
  message: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    fastingStart: "14:00",
    fastingEnd: "02:00",
    targetWeight: 85,
    targetCalories: 2000,
    targetProtein: 160,
    mealsPerDay: 4,
    telegramChatId: "",
    reminderEnabled: true,
  });
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState({ time: "", message: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((s) => setSettings({
      fastingStart: s.fastingStart || "14:00",
      fastingEnd: s.fastingEnd || "02:00",
      targetWeight: s.targetWeight || 85,
      targetCalories: s.targetCalories || 2000,
      targetProtein: s.targetProtein || 160,
      mealsPerDay: s.mealsPerDay || 4,
      telegramChatId: s.telegramChatId || "",
      reminderEnabled: s.reminderEnabled ?? true,
    }));
    fetch("/api/reminders").then((r) => r.json()).then(setReminders);
  }, []);

  async function saveSettings() {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...settings,
        targetWeight: Number(settings.targetWeight),
        targetCalories: Number(settings.targetCalories),
        targetProtein: Number(settings.targetProtein),
        mealsPerDay: Number(settings.mealsPerDay),
        telegramChatId: settings.telegramChatId || null,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function setupWebhook() {
    const res = await fetch("/api/telegram/setup", { method: "POST" });
    const data = await res.json();
    alert(data.ok ? "Webhook set!" : `Error: ${JSON.stringify(data)}`);
  }

  async function addReminder(e: React.FormEvent) {
    e.preventDefault();
    if (!newReminder.time || !newReminder.message) return;
    await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReminder),
    });
    setNewReminder({ time: "", message: "" });
    const res = await fetch("/api/reminders");
    setReminders(await res.json());
  }

  async function toggleReminder(r: Reminder) {
    await fetch("/api/reminders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.id, enabled: !r.enabled }),
    });
    const res = await fetch("/api/reminders");
    setReminders(await res.json());
  }

  async function deleteReminder(id: string) {
    await fetch(`/api/reminders?id=${id}`, { method: "DELETE" });
    const res = await fetch("/api/reminders");
    setReminders(await res.json());
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  }

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">Settings</h1>

      {/* Targets */}
      <div className="card space-y-3">
        <h2 className="text-sm font-medium text-gray-400">Targets</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500">Target Weight (kg)</label>
            <input
              type="number"
              value={settings.targetWeight}
              onChange={(e) => setSettings({ ...settings, targetWeight: Number(e.target.value) })}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Target Calories</label>
            <input
              type="number"
              value={settings.targetCalories}
              onChange={(e) => setSettings({ ...settings, targetCalories: Number(e.target.value) })}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Target Protein (g)</label>
            <input
              type="number"
              value={settings.targetProtein}
              onChange={(e) => setSettings({ ...settings, targetProtein: Number(e.target.value) })}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Meals Per Day</label>
            <input
              type="number"
              value={settings.mealsPerDay}
              onChange={(e) => setSettings({ ...settings, mealsPerDay: Number(e.target.value) })}
              className="w-full mt-1"
            />
          </div>
        </div>
      </div>

      {/* Fasting Windows */}
      <div className="card space-y-3">
        <h2 className="text-sm font-medium text-gray-400">Fasting Window</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500">Eating Starts</label>
            <input
              type="time"
              value={settings.fastingStart}
              onChange={(e) => setSettings({ ...settings, fastingStart: e.target.value })}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Eating Ends</label>
            <input
              type="time"
              value={settings.fastingEnd}
              onChange={(e) => setSettings({ ...settings, fastingEnd: e.target.value })}
              className="w-full mt-1"
            />
          </div>
        </div>
      </div>

      {/* Telegram */}
      <div className="card space-y-3">
        <h2 className="text-sm font-medium text-gray-400">Telegram</h2>
        <div>
          <label className="text-xs text-gray-500">Chat ID</label>
          <input
            value={settings.telegramChatId}
            onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
            placeholder="Your Telegram chat ID"
            className="w-full mt-1"
          />
        </div>
        <button onClick={setupWebhook} className="btn-secondary w-full">
          Setup Telegram Webhook
        </button>
      </div>

      {/* Reminders */}
      <div className="card space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium text-gray-400">Reminders</h2>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={settings.reminderEnabled}
              onChange={(e) => setSettings({ ...settings, reminderEnabled: e.target.checked })}
              className="accent-green-500"
            />
            Enabled
          </label>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
          {reminders.map((r) => (
            <div key={r.id} className="flex items-center gap-2 text-sm">
              <button onClick={() => toggleReminder(r)} className={r.enabled ? "text-green-400" : "text-gray-600"}>
                {r.enabled ? "●" : "○"}
              </button>
              <span className="text-gray-400 w-12">{r.time}</span>
              <span className="flex-1 truncate">{r.message}</span>
              <button onClick={() => deleteReminder(r.id)} className="text-gray-600 hover:text-red-400">
                ✕
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addReminder} className="flex gap-2">
          <input
            type="time"
            value={newReminder.time}
            onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
            className="w-24"
          />
          <input
            value={newReminder.message}
            onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
            placeholder="Reminder text"
            className="flex-1"
          />
          <button type="submit" className="btn-primary text-xs">+</button>
        </form>
      </div>

      <button onClick={saveSettings} className="btn-primary w-full">
        {saved ? "Saved!" : "Save Settings"}
      </button>

      <button onClick={logout} className="btn-danger w-full">
        Logout
      </button>

      <Nav />
    </div>
  );
}
