import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

const schema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("trivet")
  }),
  z.object({
    mode: z.literal("custom"),
    clientId: z.string().min(1),
    clientSecret: z.string().min(1)
  })
]);

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = body.data;

  const update =
    data.mode === "custom"
      ? {
          googleOauthClientId: data.clientId,
          googleOauthClientSecret: data.clientSecret,
          googleOauthConfigured: true
        }
      : {
          googleOauthClientId: null,
          googleOauthClientSecret: null,
          googleOauthConfigured: true
        };

  await prisma.account.update({
    where: { id: session.accountId },
    data: update
  });

  return NextResponse.json({ ok: true });
}
