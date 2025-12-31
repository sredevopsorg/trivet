import { Skeleton } from "@/components/ui/skeleton";

export default function SignInLoading() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col items-center justify-center px-6 text-center">
      <div className="w-full rounded-3xl border border-gray-100 bg-white p-8">
        <Skeleton className="mx-auto h-4 w-32" />
        <Skeleton className="mx-auto mt-4 h-6 w-60" />
        <Skeleton className="mx-auto mt-3 h-4 w-72" />
        <Skeleton className="mx-auto mt-6 h-10 w-40 rounded-full" />
      </div>
    </main>
  );
}
