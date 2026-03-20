export function SchemaMapper({ sourceNode, targetNode, mappings, onChange }: any) {
  const sourceFields = Object.keys(sourceNode.data.agent.outputSchema?.properties || sourceNode.data.agent.outputSchema || {});
  const targetFields = Object.keys(targetNode.data.agent.inputSchema?.properties || targetNode.data.agent.inputSchema || {});

  return (
    <div className="p-4 bg-black/90 border border-white/10 rounded-xl shadow-2xl w-80 text-sm">
      <h3 className="font-semibold mb-4 text-white">Data Mapping</h3>

      {targetFields.map(tf => {
        const currentMapped = mappings?.find((m: any) => m.targetField === tf)?.sourceField || "";
        return (
          <div key={tf} className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
              <span className="text-purple-400">Target: {tf}</span>
            </div>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 outline-hidden focus:ring-1 focus:ring-blue-500"
              value={currentMapped}
              onChange={(e) => {
                const newMap = mappings?.filter((m: any) => m.targetField !== tf) || [];
                if (e.target.value) {
                  newMap.push({ sourceField: e.target.value, targetField: tf });
                }
                onChange(newMap);
              }}
            >
              <option value="">-- No mapping / Provide Later --</option>
              {sourceFields.map((sf: string) => (
                <option key={sf} value={sf}>{sourceNode.data.agent.name}.{sf}</option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
