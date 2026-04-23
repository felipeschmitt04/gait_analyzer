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

// 1. Mude o título aqui
export const metadata: Metadata = {
  title: "Gait Analyzer | Projeto PI",
  description: "Sistema de análise de marcha 3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Mude lang para pt-br
    <html lang="pt-br" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {/* 3. Deixe o body apenas com min-h-screen */}
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}