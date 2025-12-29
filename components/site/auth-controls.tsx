"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/site/theme-toggle";

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
        <ThemeToggle />
        <Button asChild>
          <Link href="/api/auth/google?flow=owner">Sign up with Google</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-full">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-2 py-2 text-xs text-gray-500">
            {data.user?.email ?? "Signed in"}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/api/auth/logout">Log out</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
