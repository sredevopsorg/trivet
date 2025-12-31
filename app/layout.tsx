import type { Metadata } from "next";
import { QueryProvider } from "@/components/query-provider";
import { Navbar } from "@/components/site/navbar";
import "./globals.css";

const baseUrl = process.env.TRIVET_PUBLIC_BASE_URL
  ? new URL(process.env.TRIVET_PUBLIC_BASE_URL)
  : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: "Trivet",
    template: "%s | Trivet"
  },
  description: "Google sign-in for Ghost blogs.",
  openGraph: {
    title: "Trivet",
    description: "Google sign-in for Ghost blogs.",
    images: ["/icon.png"]
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <QueryProvider>
          <div className="min-h-screen bg-gray-050">
            <Navbar />
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
