import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      <span className="relative h-8 w-36">
        <Image
          src="/wordmark.svg"
          alt="Trivet"
          fill
          className="object-contain"
          priority
        />
      </span>
      <span className="sr-only">Trivet</span>
    </Link>
  );
}
