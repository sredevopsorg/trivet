import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { normalizeBlogHost } from "@/lib/url";

const schema = z.object({
  blogUrl: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid blog URL" }, { status: 400 });
  }

  try {
    const blogHost = normalizeBlogHost(body.data.blogUrl);
    const blogResponse = await fetch(blogHost, { method: "GET" });
    if (!blogResponse.ok) {
      return NextResponse.json(
        { error: "Blog did not respond with 200" },
        { status: 400 }
      );
    }

    const ghostUrl = new URL("/ghost/", blogHost);
    const ghostResponse = await fetch(ghostUrl.toString(), {
      method: "GET",
      redirect: "manual"
    });

    let adminHost = blogHost;
    const redirectLocation = ghostResponse.headers.get("location");
    if (redirectLocation) {
      const redirectUrl = new URL(redirectLocation, blogHost);
      adminHost = redirectUrl.origin;
    }

    const account = await prisma.account.update({
      where: { id: session.accountId },
      data: {
        blogHost,
        adminHost
      }
    });

    return NextResponse.json({
      blogHost: account.blogHost,
      adminHost: account.adminHost
    });
  } catch (error) {
    console.error("Blog URL verification failed", error);
    return NextResponse.json(
      { error: "Unable to verify blog URL" },
      { status: 500 }
    );
  }
}
