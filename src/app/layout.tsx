import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "AgentHub — Discover AI Agents for Any Task",
  description: "A marketplace platform where developers list AI agents and teams discover, try, and integrate them without the guesswork.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col font-sans`}>
        <Script
          id="anti-devtools"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
             __html: `
              document.addEventListener('contextmenu', event => event.preventDefault());
              document.onkeydown = function(e) {
                if(e.keyCode == 123) {
                  return false;
                }
                if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
                  return false;
                }
                if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
                  return false;
                }
                if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
                  return false;
                }
                if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
                  return false;
                }
              }
            `,
          }}
        />
        <Providers>
          <TooltipProvider>
            <Navbar />
            <main className="page-fade-in flex-1">
              {children}
            </main>
            <footer className="border-t border-border bg-muted/30 px-6 py-6 text-sm text-muted-foreground">
              <div className="container mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p>AgentHub · Built at HackHazards · Made with Next.js + Firebase + Claude API</p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/agents" className="hover:text-white">Browse Agents</Link>
                  <Link href="/publish" className="hover:text-white">Publish Agent</Link>
                  <a href="https://github.com/parasb184-web/hackind" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
                </div>
              </div>
            </footer>
            <Toaster theme="light" position="bottom-right" />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
