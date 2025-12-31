export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex h-24 items-center justify-center text-center text-xs text-gray-600 dark:text-gray-400">
      <p>
        © Copyright {year} The Contraption Company.{" "}
        <a href="https://www.contraption.co" target="_blank" rel="noreferrer">
          The Contraption Company
        </a>
        .{" "}
        <a href="https://www.contraption.co/terms" target="_blank" rel="noreferrer">
          Terms
        </a>
        {" & "}
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
