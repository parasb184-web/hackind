"use client";

import { useAuth } from "@/lib/AuthContext";
import { useAgents } from "@/hooks/useAgents";
import { AgentGrid } from "@/components/AgentGrid";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { CheckCircle2, CloudFog, Key, Plus, Copy, Trash2 } from "lucide-react";

export default function DashboardPage() {
  const { user, githubProfile, loading } = useAuth();
  const { data: agents = [], isLoading } = useAgents();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [showKeyModal, setShowKeyModal] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch("/api/keys", { headers: { "x-user-id": user.uid } })
        .then(r => r.json())
        .then(d => { if (Array.isArray(d)) setApiKeys(d) });
    }
  }, [user]);

  if (loading) return null;

  if (!user || !githubProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <CloudFog className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold tracking-tight mb-2">Authentication Required</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">You must be logged in to view your developer dashboard and manage your custom agents.</p>
      </div>
    );
  }

  const myAgents = agents.filter(a => a.creatorId === user.uid);
  const totalEarnings = myAgents.reduce((acc, curr) => acc + (curr.totalCalls * curr.costPerCall), 0);

  const createKey = async () => {
    const r = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-id": user.uid },
      body: JSON.stringify({ label: newKeyLabel || "Default Key" })
    });
    if (r.ok) {
      const data = await r.json();
      setApiKeys([...apiKeys, { ...data, rawKey: undefined }]);
      setShowKeyModal(data.rawKey);
      setNewKeyLabel("");
    }
  };

  const revokeKey = async (id: string) => {
    await fetch("/api/keys", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-user-id": user.uid },
      body: JSON.stringify({ keyId: id })
    });
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, isActive: false } : k));
  };

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-6">
          <img src={githubProfile.avatarUrl} className="w-20 h-20 rounded-full border border-white/10" alt="" />
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {githubProfile.githubUsername}</h1>
            <p className="text-muted-foreground mt-1 text-sm bg-white/5 inline-flex px-3 rounded py-1 items-center gap-2 border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Developer Account Verified
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-[#111] border border-white/10 rounded-xl relative overflow-hidden group">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Total Earnings</p>
          <div className="text-4xl font-mono">${totalEarnings.toFixed(2)}</div>
        </div>
        <div className="p-6 bg-[#111] border border-white/10 rounded-xl relative overflow-hidden group">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Active Agents</p>
          <div className="text-4xl font-mono">{myAgents.length}</div>
        </div>
        <div className="p-6 bg-[#111] border border-white/10 rounded-xl relative overflow-hidden group">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Global Usage</p>
          <div className="text-4xl font-mono">{myAgents.reduce((a, c) => a + c.totalCalls, 0).toLocaleString()} <span className="text-sm text-foreground/50">calls</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-500" /> API Keys
          </h2>
          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
            <div className="flex items-end gap-3 mb-6">
              <div className="flex-1">
                <label className="text-xs uppercase text-muted-foreground mb-1 block font-semibold">New Key Label</label>
                <input
                  type="text"
                  value={newKeyLabel}
                  onChange={e => setNewKeyLabel(e.target.value)}
                  placeholder="e.g. Production App"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-blue-500"
                />
              </div>
              <Button onClick={createKey} className="bg-blue-600 hover:bg-blue-700 h-10">
                <Plus className="w-4 h-4 mr-2" /> Create Key
              </Button>
            </div>

            <div className="space-y-2">
              {apiKeys.map(k => (
                <div key={k.id} className="flex items-center justify-between p-3 border border-white/5 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      {k.label} {k.isActive ? <span className="w-2 h-2 rounded-full bg-green-500"></span> : <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                    </h4>
                    <span className="font-mono text-xs text-muted-foreground">{k.isActive ? `${k.keyPrefix}...` : 'REVOKED'}</span>
                  </div>
                  {k.isActive && (
                    <Button variant="ghost" size="sm" onClick={() => revokeKey(k.id)} className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Your Published Agents</h2>
          <AgentGrid agents={myAgents} isLoading={isLoading} />
        </div>
      </div>

      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-2">Save your API Key!</h3>
            <p className="text-sm text-yellow-500 mb-6 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
              Please copy this key immediately. You won't be able to see it again.
            </p>
            <div className="flex gap-2">
              <input readOnly value={showKeyModal} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 font-mono text-blue-400" />
              <Button onClick={() => {
                navigator.clipboard.writeText(showKeyModal);
                toast("Copied to clipboard!");
              }} className="h-full py-3 bg-white/10 hover:bg-white/20">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={() => setShowKeyModal(null)} className="w-full mt-6">I have saved it</Button>
          </div>
        </div>
      )}
    </div>
  );
}
