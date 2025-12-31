import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      <span className="relative h-7 w-32">
        <Image
          src="/wordmark.svg"
          alt="Trivet"
          fill
          className="object-contain dark:hidden"
          priority
        />
        <Image
          src="/wordmark_inverted.svg"
          alt="Trivet"
          fill
          className="hidden object-contain dark:block"
          priority
        />
      </span>
      <span className="sr-only">Trivet</span>
    </Link>
  );
}
