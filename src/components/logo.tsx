import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="relative flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_45%,transparent)]">
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden>
          <path
            d="M5 7.5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v6.2c0 1.1-.9 2-2 2H11l-4.2 2.6c-.5.3-1.1-.1-1.1-.7V15.7c-1-.3-1.7-1.2-1.7-2.3V7.5Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="10.5" r="1" fill="currentColor" />
          <circle cx="12" cy="10.5" r="1" fill="currentColor" />
          <circle cx="15" cy="10.5" r="1" fill="currentColor" />
        </svg>
      </span>
      {!compact && (
        <span className="font-heading text-[15px] font-semibold tracking-tight">
          SMSAl
        </span>
      )}
    </Link>
  );
}
