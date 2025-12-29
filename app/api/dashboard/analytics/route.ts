import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.$queryRaw<
    Array<{ day: Date; type: string; count: number }>
  >(Prisma.sql`
    SELECT date_trunc('day', created_at) AS day, type, COUNT(*)::int AS count
    FROM logins
    WHERE account_id = ${session.accountId}
    GROUP BY day, type
    ORDER BY day ASC
  `);

  const grouped = new Map<string, { date: string; new: number; returning: number }>();
  for (const row of rows) {
    const dateKey = row.day.toISOString().split("T")[0];
    const entry = grouped.get(dateKey) ?? { date: dateKey, new: 0, returning: 0 };
    if (row.type === "new" || row.type === "NEW") {
      entry.new += row.count;
    } else {
      entry.returning += row.count;
    }
    grouped.set(dateKey, entry);
  }

  return NextResponse.json({
    data: Array.from(grouped.values())
  });
}
