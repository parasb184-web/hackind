"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export const Navbar = () => {
  const { user, loading, signInWithGitHub, signOut } = useAuth();

  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
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
            <Button variant="ghost" className="text-sm border border-white/10 hover:bg-white/5">Publish Agent</Button>
          </Link>
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground">Logout</Button>
              <Link href="/dashboard">
                <img src={user.photoURL || `https://github.com/${user.displayName}.png`} alt="avatar" className="w-8 h-8 rounded-full ring-2 ring-white/10 cursor-pointer hover:ring-blue-500 transition-all" />
              </Link>
            </div>
          ) : (
            <Button onClick={signInWithGitHub} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">Log in with GitHub</Button>
          )}
        </div>
      </div>
    </nav>
  );
};
