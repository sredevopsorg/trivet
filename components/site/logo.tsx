import Link from "next/link";

import { TrivetWordmark } from "@/components/site/trivet-wordmark";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      <TrivetWordmark className="h-8 w-auto" />
      <span className="sr-only">Trivet</span>
    </Link>
  );
}
