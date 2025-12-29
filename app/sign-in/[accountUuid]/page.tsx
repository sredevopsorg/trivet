import type { Metadata } from "next";

import { SignInClient } from "@/components/signin/signin-client";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Member sign-in"
};

export default async function SignInPage({
  params,
  searchParams
}: {
  params: { accountUuid: string };
  searchParams?: { error?: string; redirect?: string };
}) {
  const account = await prisma.account.findUnique({
    where: { uuid: params.accountUuid },
    select: { blogHost: true }
  });

  if (!account) {
    return (
      <SignInClient
        accountUuid={params.accountUuid}
        error="not-found"
        blogHost={null}
      />
    );
  }

  return (
    <SignInClient
      accountUuid={params.accountUuid}
      blogHost={account.blogHost}
      error={searchParams?.error}
      redirect={searchParams?.redirect}
    />
  );
}
