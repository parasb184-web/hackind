import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const Step1Basic = () => {
  const { register, control, formState: { errors } } = useFormContext();

  const langs = ["Python", "JavaScript", "TypeScript", "Go", "Rust", "Java", "Ruby", "PHP", "Other"];
  const suggestedTags = ["summarization", "code-review", "data-extraction", "translation", "sentiment-analysis", "image-captioning", "question-answering", "classification"];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <Label>Agent Name <span className="text-red-500">*</span></Label>
        <Input placeholder="e.g. PR Review Agent" {...register("name")} className="bg-white/5 border-white/10" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name?.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label>Description <span className="text-red-500">*</span></Label>
        <textarea
          placeholder="What does it do? Who is it for?"
          {...register("description")}
          className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-sm min-h-[100px] hover:border-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-y"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description?.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label>Capability Tags</Label>
        <div className="flex flex-wrap gap-2">
          {suggestedTags.map(tag => (
            <Controller
              key={tag}
              name="capabilityTags"
              control={control}
              render={({ field }) => (
                <label className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-mono transition-colors border ${field.value?.includes(tag) ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10'}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    value={tag}
                    checked={field.value?.includes(tag)}
                    onChange={(e) => {
                      const updatedTags = e.target.checked
                        ? [...(field.value || []), tag]
                        : field.value?.filter((t: string) => t !== tag);
                      field.onChange(updatedTags);
                    }}
                  />
                  {tag}
                </label>
              )}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Label>Supported Languages</Label>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {langs.map(lang => (
            <Controller
              key={lang}
              name="supportedLanguages"
              control={control}
              render={({ field }) => (
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <Checkbox
                    checked={field.value?.includes(lang)}
                    onCheckedChange={(checked) => {
                      const updated = checked
                        ? [...(field.value || []), lang]
                        : field.value?.filter((l: string) => l !== lang);
                      field.onChange(updated);
                    }}
                    className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">{lang}</span>
                </label>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
