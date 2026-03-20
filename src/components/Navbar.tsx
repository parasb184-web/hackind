"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export const Navbar = () => {
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#05080d]/60 backdrop-blur-2xl">
      <div className="container mx-auto flex h-18 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(45,113,255,0.95),rgba(29,78,216,0.88))] shadow-[0_10px_24px_rgba(37,99,235,0.35)] transition-transform group-hover:scale-105">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span>Agent<span className="text-blue-500">Hub</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/agents" className="hover:text-foreground transition-colors">Marketplace</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/publish" className="hidden md:block">
            <Button variant="ghost" className="glass-surface-soft rounded-full px-4 text-sm text-white hover:bg-white/10">Publish Agent</Button>
          </Link>
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground">Logout</Button>
              <Link href="/dashboard">
                <Image
                  src={user.photoURL || `https://github.com/${user.displayName}.png`}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full ring-2 ring-white/10 cursor-pointer hover:ring-blue-500 transition-all"
                />
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <Button className="rounded-full bg-[linear-gradient(180deg,rgba(59,130,246,1),rgba(37,99,235,0.92))] px-5 text-white shadow-[0_10px_26px_rgba(37,99,235,0.35)] hover:bg-blue-700">Log in with GitHub</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
