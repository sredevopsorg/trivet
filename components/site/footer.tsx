export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex h-24 items-center justify-center text-center text-xs text-gray-600 dark:text-gray-400">
      <p>
        © Copyright {year} The Contraption Company. {" "}
        <a
          href="https://www.contraption.co"
          target="_blank"
          rel="noreferrer"
        >
          The Contraption Company
        </a>
        . {" "}
        <a
          href="https://www.contraption.co/policies/"
          target="_blank"
          rel="noreferrer"
        >
          Terms and privacy
        </a>
        .
      </p>
    </footer>
  );
}
