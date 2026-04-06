import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";

export async function GET() {
  const containers = await prisma.container.findMany({
    orderBy: { createdAt: "asc" },
  });
  return apiResponse(containers);
}

export async function POST(req: NextRequest) {
  const { label, contents, status, prepDate } = await req.json();
  if (!label) return apiError("Label required");

  const container = await prisma.container.create({
    data: {
      label,
      contents: contents || null,
      status: status || "empty",
      prepDate: prepDate ? new Date(prepDate) : null,
    },
  });
  return apiResponse(container);
}

export async function PUT(req: NextRequest) {
  const { id, label, contents, status, prepDate } = await req.json();
  if (!id) return apiError("ID required");

  const container = await prisma.container.update({
    where: { id },
    data: {
      ...(label !== undefined && { label }),
      ...(contents !== undefined && { contents }),
      ...(status !== undefined && { status }),
      ...(prepDate !== undefined && { prepDate: prepDate ? new Date(prepDate) : null }),
    },
  });
  return apiResponse(container);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return apiError("ID required");
  await prisma.container.delete({ where: { id } });
  return apiResponse({ ok: true });
}
