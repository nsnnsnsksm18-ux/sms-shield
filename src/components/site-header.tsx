"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Wallet } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatTL } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/gelen-kutusu", label: "Gelen kutusu" },
  { href: "/cuzdan", label: "Cüzdan" },
  { href: "/nasil-calisir", label: "Nasıl çalışır" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { balance, rentals } = useStore();
  const waiting = rentals.filter(
    (r) => r.status === "received" && !r.message,
  ).length;

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                pathname.startsWith(item.href) && "bg-white/6 text-foreground",
              )}
            >
              {item.label}
              {item.href === "/gelen-kutusu" && waiting > 0 && (
                <span className="ml-1.5 inline-flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {waiting}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/cuzdan"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden gap-1.5 sm:inline-flex",
            )}
          >
            <Wallet className="size-3.5" />
            <span suppressHydrationWarning>
              {balance == null ? "…" : formatTL(balance)}
            </span>
          </Link>
          <Link
            href="/hizmetler"
            className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
          >
            Numara kirala
          </Link>
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon-sm" className="md:hidden" />
              }
            >
              <Menu />
              <span className="sr-only">Menü</span>
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
                <p className="mt-3 px-3 text-sm text-muted-foreground">
                  Bakiye: {balance == null ? "…" : formatTL(balance)}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
