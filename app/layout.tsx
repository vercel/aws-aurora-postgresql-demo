import type { Metadata } from "next";
import "./globals.css";
import { Geist_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "Aurora PostgreSQL Movies Demo",
  description: "Search movies from an AWS Aurora PostgreSQL database.",
};

const geist = Geist_Mono({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} antialiased bg-white dark:bg-black`}>
        {children}
      </body>
    </html>
  );
}
