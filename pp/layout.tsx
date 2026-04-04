import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beautiful Todo App",
  description: "A simple and elegant todo application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
