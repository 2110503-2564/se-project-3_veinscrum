import { figTree } from "@/fonts";
import { cn } from "@/lib/utils";
import { LibProviders } from "@/providers";
import type { Metadata } from "next";
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
      <body className={cn("antialiased", figTree.variable)}>
        <LibProviders>{children}</LibProviders>
      </body>
    </html>
  );
}
