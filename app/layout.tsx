import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chore Tracker",
  description: "A lightweight mobile-first chore tracker for a parent and child.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // TODO: mount ModeToggle (top) and BottomNav (fixed bottom) around children.
  // Add padding-bottom on the content container so the fixed nav never overlaps.
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
