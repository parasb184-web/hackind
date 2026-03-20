"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export const Navbar = () => {
  const { user, loading, signOut } = useAuth();

  return (
    <>
      <div className="w-full bg-[#1c7ced] text-white text-xs md:text-sm py-2.5 px-4 text-center font-medium tracking-wide">
        Find 500 B2B Contacts for Free Every Month with Built-In Outreach. <a href="#" className="font-bold underline underline-offset-2 ml-1">Try AgentHub AI ! ↗</a>
      </div>
      <div className="w-full px-4 pt-6 pb-2 sticky top-0 z-50">
        <nav className="mx-auto max-w-5xl flex h-16 items-center justify-between rounded-full border border-neutral-200 bg-white/95 backdrop-blur-md px-6 shadow-sm">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight group text-[#111827]">
              Agent<span className="text-[#00b4d8]">Hub</span>
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-medium text-neutral-600">
              <Link href="/agents" className="hover:text-neutral-900 transition-colors">Products</Link>
              <Link href="/scan" className="hover:text-neutral-900 transition-colors">Use Cases</Link>
              <span className="hover:text-neutral-900 transition-colors cursor-pointer">Resources</span>
              <span className="hover:text-neutral-900 transition-colors cursor-pointer">Pricing</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={signOut} className="text-neutral-600 hover:text-neutral-900 font-medium hidden md:block">Logout</Button>
                <Link href="/dashboard">
                  <Button className="rounded-full bg-[#111827] px-6 text-white hover:bg-[#374151] font-medium transition-colors">Dashboard →</Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 hidden md:block">
                  Login
                </Link>
                <Button variant="outline" className="hidden lg:flex rounded-full border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-medium px-5">Book a Demo</Button>
                <Link href="/login">
                  <Button className="rounded-full bg-[#111827] px-6 text-white hover:bg-[#374151] font-medium transition-colors">Get Started →</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};
