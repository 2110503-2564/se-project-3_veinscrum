import { figTree } from "@/fonts";
import { cn } from "@/lib/utils";
import { LibProviders } from "@/providers";
import type { Metadata } from "next";
import { Navbar } from "./_layouts/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online Job Fair Registration",
  description: "The place to register for online job fairs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", figTree.className)}>
        <LibProviders>
          <Navbar />
          {children}
        </LibProviders>
      </body>
    </html>
  );
}
