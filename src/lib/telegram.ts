const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendMessage(chatId: string, text: string) {
  const res = await fetch(`${BASE}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });
  return res.json();
}

export async function setWebhook(url: string) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET || "";
  const res = await fetch(`${BASE}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      secret_token: secret,
      allowed_updates: ["message"],
    }),
  });
  return res.json();
}

export function getChatId(): string {
  return process.env.TELEGRAM_CHAT_ID || "";
}

export interface TelegramMessage {
  message_id: number;
  from: { id: number; first_name: string };
  chat: { id: number };
  text?: string;
  date: number;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}
