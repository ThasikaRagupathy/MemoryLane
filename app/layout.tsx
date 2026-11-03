import type { Metadata } from "next";
import "./globals.css";
import { MemoryLaneProvider } from "@/hooks/useMemoryLane";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "MemoryLane — A Living Digital Journal",
  description: "Some moments deserve more than a camera roll.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Caveat:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper text-ink font-sans">
        <MemoryLaneProvider>
          <AppShell>{children}</AppShell>
        </MemoryLaneProvider>
      </body>
    </html>
  );
}
