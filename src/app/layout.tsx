import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "AgentHub | Discover & Integrate AI Agents",
  description: "A marketplace platform where developers list AI agents and users discover, explore, and integrate them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#0a0a0a] text-foreground min-h-screen flex flex-col font-sans`}>
        <Providers>
          <TooltipProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Toaster theme="dark" position="bottom-right" />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
