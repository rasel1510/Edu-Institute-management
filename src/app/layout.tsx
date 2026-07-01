import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neuravixor — Educational Institution Management System",
  description:
    "Manage students, teachers, attendance, exams, and fees from a premium glassmorphism dashboard. Built with Next.js, Tailwind CSS, and Recharts.",
  keywords: [
    "education management",
    "school management system",
    "student dashboard",
    "institution management",
    "Neuravixor",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
