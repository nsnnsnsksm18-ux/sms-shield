import { cn } from "@/lib/utils";

export function HexMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <path
        d="M16 2.4 28.2 9.2v13.6L16 29.6 3.8 22.8V9.2L16 2.4Z"
        fill="#4f46e5"
      />
      <path
        d="M16 8.2 22.4 12v8L16 23.8 9.6 20v-8L16 8.2Z"
        fill="white"
      />
      <path d="M16 11.4 19.6 13.6v4.4L16 20.2 12.4 18v-4.4L16 11.4Z" fill="#6366f1" />
    </svg>
  );
}
