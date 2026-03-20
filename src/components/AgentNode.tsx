import { Handle, Position } from 'reactflow';
import { Network } from 'lucide-react';

export function AgentNode({ data }: { data: any }) {
  const { agent } = data;

  const inputFields = Object.keys(agent.inputSchema?.properties || agent.inputSchema || {});
  const outputFields = Object.keys(agent.outputSchema?.properties || agent.outputSchema || {});

  return (
    <div className="bg-black/90 border border-blue-500/50 rounded-xl p-4 w-64 shadow-2xl relative shadow-blue-900/20">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-400 border-2 border-black" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-white mb-1 flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-400" />
            {agent.name}
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 uppercase tracking-widest border border-blue-500/20 font-bold">
            {agent.capabilityTags?.[0] || "Agent"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {inputFields.length > 0 && (
          <div className="bg-white/5 p-2 rounded-lg">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">Input Fields</div>
            <div className="space-y-1">
              {inputFields.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-green-300 bg-green-500/10 px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {outputFields.length > 0 && (
          <div className="bg-white/5 p-2 rounded-lg">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">Output Fields</div>
            <div className="space-y-1">
              {outputFields.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> {f}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-400 border-2 border-black" />
    </div>
  );
}
