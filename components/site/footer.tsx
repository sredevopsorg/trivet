import Image from "next/image";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex flex-col items-center justify-center gap-4 py-6 text-center text-xs text-gray-600">
      <a
        href="https://contraption.co"
        target="_blank"
        rel="noreferrer"
        className="inline-flex"
      >
        <Image
          src="/contraption-wordmark.svg"
          alt="Contraption"
          width={120}
          height={24}
          className="h-5 w-24"
        />
      </a>
      <p>
        © {year}.{" "}
        <a href="https://www.contraption.co/terms" target="_blank" rel="noreferrer">
          Terms
        </a>
        .{" "}
        <a
          href="https://www.contraption.co/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Privacy
        </a>
        .
      </p>
    </footer>
  );
}
