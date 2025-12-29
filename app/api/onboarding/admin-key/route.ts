import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createGhostAdminClient } from "@/lib/ghost";

const adminKeySchema = z.object({
  adminApiKey: z
    .string()
    .regex(/^[a-f0-9]{24}:[a-f0-9]{64}$/i, "Invalid Admin API key format")
});

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = adminKeySchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.message }, { status: 400 });
  }

  const account = await prisma.account.findUnique({
    where: { id: session.accountId }
  });

  if (!account?.adminHost) {
    return NextResponse.json({ error: "Missing admin host" }, { status: 400 });
  }

  try {
    const api = createGhostAdminClient({
      adminHost: account.adminHost,
      adminApiKey: body.data.adminApiKey
    });
    await api.site.read();

    const updated = await prisma.account.update({
      where: { id: session.accountId },
      data: {
        adminApiKey: body.data.adminApiKey
      }
    });

    return NextResponse.json({
      adminHost: updated.adminHost
    });
  } catch (error) {
    console.error("Admin API key validation failed", error);
    return NextResponse.json(
      { error: "Unable to validate Admin API key" },
      { status: 400 }
    );
  }
}
