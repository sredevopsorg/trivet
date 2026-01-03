"use client";

import { usePathname } from "next/navigation";

import { AuthControls } from "@/components/site/auth-controls";
import { Logo } from "@/components/site/logo";

export function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/sign-in")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-gray-050">
      <div className="content-container flex h-16 items-center justify-between">
        <Logo />
        <AuthControls />
      </div>
    </header>
  );
}
