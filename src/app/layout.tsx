import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LockScreen from "@/components/core/lock_screen";
import { Toaster } from "@/components/ui/sonner";
import Alert from "@/components/core/alert";
import { Modal } from "@/components/core/modal";
import ThemeHandler from "@/lib/theme_handler";
import { Providers } from "./providers";
import { SheetForm } from "@/components/core/sheet_form";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maque-TAngular",
  description: "Genera tu código Angular.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LockScreen />
        <Alert />
        <ThemeHandler />
        <Toaster position="top-right" richColors />
        <Navbar />
        <Modal />
        <Providers>
          <SheetForm />
          {children}
        </Providers>
      </body>
    </html>
  );
}
