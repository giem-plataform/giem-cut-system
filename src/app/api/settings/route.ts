import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/lib/utils";

export async function GET() {
  let settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "singleton" } });
  }
  return apiResponse(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...body },
    update: body,
  });
  return apiResponse(settings);
}
