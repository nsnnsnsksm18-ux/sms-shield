"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HelpCircle,
  Inbox,
  LayoutGrid,
  Menu,
  Scale,
  Wallet,
} from "lucide-react";
import { Logo } from "@/components/logo";
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
  { href: "/", label: "SMS Al", icon: LayoutGrid },
  { href: "/gelen-kutusu", label: "Numaralarım", icon: Inbox },
  { href: "/cuzdan", label: "Bakiye", icon: Wallet },
  { href: "/nasil-calisir", label: "Nasıl çalışır", icon: HelpCircle },
  { href: "/yasal", label: "Yasal", icon: Scale },
];

function NavLinks({
  pathname,
  waiting,
  onClick,
}: {
  pathname: string;
  waiting: number;
  onClick?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/" || pathname.startsWith("/hizmetler")
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-white/12 text-white"
                : "text-white/65 hover:bg-white/8 hover:text-white",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.href === "/gelen-kutusu" && waiting > 0 && (
              <span
                className="inline-flex min-w-5 items-center justify-center rounded-full bg-violet-400 px-1.5 text-[10px] font-semibold text-violet-950"
                suppressHydrationWarning
              >
                {waiting}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function PanelShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { balance, rentals } = useStore();
  const now = useNow();
  const waiting = rentals.filter((r) => isRentalLive(r, now)).length;

  return (
    <div className="flex min-h-full">
      <aside className="hidden w-[240px] shrink-0 flex-col bg-[var(--sidebar)] text-[var(--sidebar-foreground)] md:flex">
        <div className="px-4 py-4">
          <Logo className="text-white" />
          <p className="mt-2 text-[11px] text-white/45">24 saat · sınırsız SMS</p>
        </div>
        <div className="flex-1 px-2">
          <NavLinks pathname={pathname} waiting={waiting} />
        </div>
        <p className="px-4 py-4 text-[11px] leading-5 text-white/40">
          Numaralar FerPay stoğundan alınır. hizlismsal.com
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b bg-card px-4">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon-sm" className="md:hidden" />
              }
            >
              <Menu />
              <span className="sr-only">Menü</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-[var(--sidebar)] p-0 text-white">
              <SheetHeader className="px-4 pt-4">
                <SheetTitle className="text-white">Menü</SheetTitle>
              </SheetHeader>
              <div className="px-2 pb-4">
                {NAV.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                      />
                    }
                  >
                    {item.label}
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <div className="md:hidden">
            <Logo compact />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="rounded-lg border bg-muted px-3 py-1.5 text-sm">
              <span className="mr-2 text-muted-foreground">Bakiye</span>
              <span className="font-semibold text-primary" suppressHydrationWarning>
                {balance == null ? "…" : formatTL(balance)}
              </span>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
