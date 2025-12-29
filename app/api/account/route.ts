import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await prisma.account.findUnique({
    where: { id: session.accountId }
  });

  if (!account) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    uuid: account.uuid,
    email: account.email,
    name: account.name,
    blogHost: account.blogHost,
    adminHost: account.adminHost,
    googleMode: account.googleOauthClientId ? "custom" : "trivet",
    hasAdminKey: Boolean(account.adminApiKey)
  });
}
