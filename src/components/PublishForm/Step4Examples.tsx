import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

export const Step4Examples = ({ onSubmit, isSubmitting }: { onSubmit: () => void, isSubmitting: boolean }) => {
  const { watch } = useFormContext();
  const formValues = watch();

  const previewField = (label: string, value: any) => (
    <div className="space-y-1 pb-3 mb-3 border-b border-white/5 last:border-0">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {typeof value === 'object' ? (
        <pre className="text-xs font-mono p-2 bg-black/40 rounded border border-white/5 overflow-x-auto text-blue-300">
          {JSON.stringify(value, null, 2)}
        </pre>
      ) : (
        <div className="text-sm break-words whitespace-pre-wrap">{value?.toString() || "—"}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-bold mb-4 font-mono flex items-center gap-2">
          <CopyIcon className="w-5 h-5 text-blue-500" />
          Review Configuration
        </h4>

        <div className="grid grid-cols-2 gap-x-8">
          <div>
            {previewField("Name", formValues.name)}
            {previewField("Description", formValues.description)}
            {previewField("Tags", formValues.capabilityTags?.join(", ") || "None")}
            {previewField("Languages", formValues.supportedLanguages?.join(", ") || "None")}
          </div>
          <div>
            {previewField("Endpoint", formValues.endpointUrl)}
            {previewField("Cost / Call", "$" + (formValues.costPerCall || 0).toFixed(3))}
            {previewField("SLA Latency", (formValues.latencyMs || 0) + "ms")}
            {previewField("Rate Limit", (formValues.rateLimit || 0) + " / min")}
            {previewField("Open Source", formValues.isOpenSource ? `Yes (${formValues.sourceUrl || "No URL"})` : "No")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 mt-2">
          <div>{previewField("Input Schema", formValues.inputSchema)}</div>
          <div>{previewField("Output Schema", formValues.outputSchema)}</div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-full shadow-lg hover:scale-[1.02] transition-transform w-full"
        >
          {isSubmitting ? "Publishing Agent..." : "Deploy to Marketplace"}
        </Button>
      </div>
    </div>
  );
};
