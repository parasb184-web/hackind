"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity, ArrowRight, Github, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Verified access",
    description: "Authenticate once and manage secure API keys for sandbox testing and production usage.",
  },
  {
    icon: Workflow,
    title: "Instant integration",
    description: "Move from live validation to production-ready SDK snippets without leaving the marketplace.",
  },
  {
    icon: Sparkles,
    title: "Agent discovery",
    description: "Evaluate trusted agents, compare capabilities, and route the right tool into your workflow.",
  },
];

export default function LoginPage() {
  const { user, loading, signInWithGitHub } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [loading, redirectTo, router, user]);

  const handleSignIn = async () => {
    await signInWithGitHub();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[linear-gradient(180deg,#05070d_0%,#09101a_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.22),transparent_26%),radial-gradient(circle_at_78%_12%,rgba(56,189,248,0.14),transparent_22%),radial-gradient(circle_at_60%_70%,rgba(37,99,235,0.12),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(37,99,235,0.14),transparent)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-6 py-16">
        <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-blue-200">
              <Activity className="h-3.5 w-3.5" />
              AgentHub Access
            </div>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
              Secure access for the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-500 to-sky-300">
                AI agent marketplace
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100/70 md:text-xl">
              Sign in to create API keys, test agents in the sandbox, publish your own services, and manage marketplace usage from one place.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="mb-4 inline-flex rounded-2xl border border-blue-400/20 bg-blue-500/10 p-3 text-blue-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold text-white">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-blue-100/60">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-700 lg:justify-self-end">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,24,0.98),rgba(9,16,28,0.94))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.22),transparent_30%)]" />
              <div className="relative">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.45)]">
                  <Github className="h-7 w-7 text-white" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-white">Sign in with GitHub</h2>
                <p className="mt-3 text-sm leading-7 text-blue-100/65">
                  We use GitHub identity to provision developer access, connect published agents to creators, and secure API key issuance.
                </p>

                <Button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="mt-8 h-12 w-full rounded-xl bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
                >
                  <Github className="mr-2 h-5 w-5" />
                  {loading ? "Checking session..." : "Continue with GitHub"}
                </Button>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6 text-sm text-blue-100/55">
                  <span>Developer access only</span>
                  <Link href="/" className="inline-flex items-center gap-2 text-blue-200 transition-colors hover:text-white">
                    Return home
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
