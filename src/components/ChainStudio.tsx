"use client";

import { useState, useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, addEdge, BackgroundVariant, Connection, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { useChainStore } from '@/lib/chainStore';
import { AgentNode } from './AgentNode';
import { SchemaMapper } from './SchemaMapper';
import { Button } from './ui/button';
import { Save, Search } from 'lucide-react';
import { useAgents } from '@/hooks/useAgents';
import { Input } from './ui/input';

const nodeTypes = { agentNode: AgentNode };

export function ChainStudio() {
  const { nodes, edges, mappings, addNode, removeNode, addEdge: addStoreEdge, setMapping, chainName, setChainName, saveChain } = useChainStore();
  const { data: agents = [] } = useAgents();
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [search, setSearch] = useState("");

  const onConnect = useCallback((params: Connection | Edge) => {
    addStoreEdge({ ...params, type: 'smoothstep', animated: true } as Edge);
  }, [addStoreEdge]);

  const sourceNode = useMemo(() => selectedEdge ? nodes.find(n => n.id === selectedEdge.source) : null, [selectedEdge, nodes]);
  const targetNode = useMemo(() => selectedEdge ? nodes.find(n => n.id === selectedEdge.target) : null, [selectedEdge, nodes]);

  const filteredAgents = useMemo(() => agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase())), [agents, search]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-black text-white relative">

      {/* Sidebar sidebar */}
      <div className="w-80 border-r border-white/10 bg-black/50 p-6 flex flex-col z-10 shadow-xl backdrop-blur-md">
        <h2 className="text-xl font-bold mb-6">Agent Toolkit</h2>
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            className="w-full bg-white/5 border-white/10 text-white pl-10"
            placeholder="Search agents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {filteredAgents.map(a => (
            <div key={a.id} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => addNode(a)}>
              <div className="font-semibold text-sm mb-1">{a.name}</div>
              <div className="text-xs text-muted-foreground truncate">{a.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onEdgeClick={(e, edge) => setSelectedEdge(edge)}
          onPaneClick={() => setSelectedEdge(null)}
          nodeTypes={nodeTypes}
          fitView
          className="bg-black/20"
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#1e3a8a" />
          <Controls className="fill-white" />
          <MiniMap className="bg-black/90 border border-white/10" maskColor="rgba(0,0,0,0.5)" />
        </ReactFlow>

        {/* Floating Schema Mapper */}
        {selectedEdge && sourceNode && targetNode && (
          <div className="absolute top-6 right-6 z-20 pointer-events-auto">
            <SchemaMapper
              sourceNode={sourceNode}
              targetNode={targetNode}
              mappings={mappings[selectedEdge.id] || []}
              onChange={(m: any) => setMapping(selectedEdge.id, m)}
            />
          </div>
        )}

        {/* Bottom Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-black/80 border border-white/10 p-3 rounded-2xl backdrop-blur-xl shadow-2xl">
          <Input
            className="w-48 bg-transparent border-0 focus-visible:ring-0 text-white font-semibold text-lg"
            value={chainName}
            onChange={e => setChainName(e.target.value)}
          />
          <div className="w-px h-8 bg-white/10"></div>
          <Button onClick={async () => {
            const id = await saveChain();
            alert("Chain Saved! ID: " + id);
          }} className="bg-blue-600 hover:bg-blue-700 font-bold px-6">
            <Save className="w-4 h-4 mr-2" /> Save & Deploy Endpoint
          </Button>
        </div>
      </div>
    </div>
  );
}
