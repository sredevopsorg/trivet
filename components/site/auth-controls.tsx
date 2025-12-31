"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CircleUserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionResponse {
  authenticated: boolean;
  user?: {
    email: string;
    name?: string | null;
  };
}

export function AuthControls() {
  const { data, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await fetch("/api/session");
      if (!res.ok) {
        return { authenticated: false } as SessionResponse;
      }
      return (await res.json()) as SessionResponse;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>
    );
  }

  if (!data?.authenticated) {
    return (
      <div className="flex items-center gap-3">
        <Button asChild>
          <Link href="/api/auth/google?flow=owner">Sign up with Google</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-full p-0"
            aria-label="Open settings"
          >
            <CircleUserRound className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-2 py-2 text-xs text-gray-500">
            {data.user?.email ?? "Signed in"}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings" className="no-underline">
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/api/auth/logout" className="no-underline">
              Log out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
