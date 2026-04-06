import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";

export async function GET() {
  const reminders = await prisma.reminder.findMany({ orderBy: { time: "asc" } });
  return apiResponse(reminders);
}

export async function POST(req: NextRequest) {
  const { time, message } = await req.json();
  if (!time || !message) return apiError("time and message required");
  const r = await prisma.reminder.create({ data: { time, message } });
  return apiResponse(r);
}

export async function PUT(req: NextRequest) {
  const { id, time, message, enabled } = await req.json();
  if (!id) return apiError("ID required");
  const r = await prisma.reminder.update({
    where: { id },
    data: {
      ...(time !== undefined && { time }),
      ...(message !== undefined && { message }),
      ...(enabled !== undefined && { enabled }),
    },
  });
  return apiResponse(r);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return apiError("ID required");
  await prisma.reminder.delete({ where: { id } });
  return apiResponse({ ok: true });
}
