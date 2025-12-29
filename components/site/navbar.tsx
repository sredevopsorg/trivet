import { AuthControls } from "@/components/site/auth-controls";
import { Logo } from "@/components/site/logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur dark:border-gray-900 dark:bg-gray-975/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <AuthControls />
      </div>
    </header>
  );
}
