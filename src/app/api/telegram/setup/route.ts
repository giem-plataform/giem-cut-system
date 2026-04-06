import { setWebhook } from "@/lib/telegram";
import { apiResponse, apiError } from "@/lib/utils";

export async function POST() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return apiError("NEXT_PUBLIC_APP_URL not set");

  const webhookUrl = `${appUrl}/api/telegram/webhook`;
  const result = await setWebhook(webhookUrl);
  return apiResponse(result);
}
