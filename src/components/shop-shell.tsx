"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Menu, Wallet } from "lucide-react";
import { HexMark } from "@/components/hex-mark";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatTL } from "@/lib/format";
import { isRentalLive, useStore } from "@/lib/store";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "SMS Al" },
  { href: "/gelen-kutusu", label: "Numaralarım" },
  { href: "/cuzdan", label: "Bakiye" },
  { href: "/nasil-calisir", label: "Nasıl çalışır" },
];

export function ShopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { balance, rentals } = useStore();
  const now = useNow();
  const waiting = rentals.filter((r) => isRentalLive(r, now)).length;
  const initials = "AL";

  return (
    <div className="flex min-h-full flex-col bg-[#f4f5fb]">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white">
        <div className="mx-auto flex h-[64px] max-w-[1400px] items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <HexMark />
            <span className="text-lg font-bold tracking-wide text-[#2b2f5c]">
              SMSAL
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <span className="hidden rounded-full bg-[#f4f5fb] px-3 py-1 text-xs font-medium text-[#2b2f5c] sm:inline">
              TR
            </span>
            <Link
              href="/gelen-kutusu"
              className="relative inline-flex size-9 items-center justify-center rounded-full text-[#5b618a] hover:bg-[#f4f5fb]"
              aria-label="Numaralarım"
            >
              <Inbox className="size-4.5" />
              {waiting > 0 && (
                <span
                  className="absolute top-1 right-1 size-2 rounded-full bg-[#4f46e5]"
                  suppressHydrationWarning
                />
              )}
            </Link>
            <Link
              href="/cuzdan"
              className="hidden items-center gap-1.5 rounded-full bg-[#f4f5fb] px-3 py-1.5 text-sm font-semibold text-[#4f46e5] sm:inline-flex"
            >
              <Wallet className="size-3.5" />
              <span suppressHydrationWarning>
                {balance == null ? "…" : formatTL(balance)}
              </span>
            </Link>
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon-sm" className="sm:hidden" />
                }
              >
                <Menu />
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>Menü</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-3">
                  {NAV.map((item) => (
                    <SheetClose
                      key={item.href}
                      render={
                        <Link
                          href={item.href}
                          className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
                        />
                      }
                    >
                      {item.label}
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <Link
              href="/cuzdan"
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full bg-[#4f46e5] text-xs font-bold text-white",
                pathname.startsWith("/cuzdan") && "ring-2 ring-[#4f46e5]/30",
              )}
            >
              {initials}
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-5 sm:px-6">
        {children}
      </main>
    </div>
  );
}
