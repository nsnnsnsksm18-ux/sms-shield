"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Kopyala",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      toast.success("Panoya kopyalandı");
      window.setTimeout(() => setDone(false), 1400);
    } catch {
      toast.error("Kopyalanamadı");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onCopy}
      className={cn(className)}
    >
      {done ? <Check /> : <Copy />}
      {label}
    </Button>
  );
}
