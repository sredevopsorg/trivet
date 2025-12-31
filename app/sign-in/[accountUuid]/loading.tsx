import { Loader2 } from "lucide-react";

export default function SignInLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Loader2 className="h-6 w-6 animate-spin text-gray-900" />
      <span className="sr-only">Loading sign-in.</span>
    </main>
  );
}
