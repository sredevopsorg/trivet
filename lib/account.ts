import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function getAccountForSession() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  return prisma.account.findUnique({
    where: { id: session.accountId }
  });
}
