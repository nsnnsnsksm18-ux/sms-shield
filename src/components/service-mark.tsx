import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  whatsapp: "bg-emerald-500/18 text-emerald-300",
  telegram: "bg-sky-500/18 text-sky-300",
  signal: "bg-indigo-400/18 text-indigo-300",
  instagram: "bg-fuchsia-500/18 text-fuchsia-300",
  tiktok: "bg-cyan-400/18 text-cyan-200",
  x: "bg-zinc-400/16 text-zinc-200",
  facebook: "bg-blue-500/18 text-blue-300",
  snapchat: "bg-yellow-400/18 text-yellow-200",
  google: "bg-red-400/16 text-red-300",
  discord: "bg-violet-500/18 text-violet-300",
  steam: "bg-slate-400/16 text-slate-200",
  microsoft: "bg-sky-400/16 text-sky-200",
  openai: "bg-teal-400/18 text-teal-200",
  binance: "bg-amber-400/18 text-amber-200",
  amazon: "bg-orange-400/16 text-orange-200",
  linkedin: "bg-blue-400/18 text-blue-200",
};

export function ServiceMark({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-xl text-sm font-semibold tracking-tight",
        TONES[slug] ?? "bg-primary/15 text-primary",
        className,
      )}
      aria-hidden
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
