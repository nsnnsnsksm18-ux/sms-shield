"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Inbox, Loader2, Timer } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { ServiceMark } from "@/components/service-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { extractCode } from "@/lib/ferpay-display";
import { formatClock, formatEndsAt, formatTimeLeft, formatTL } from "@/lib/format";
import { isRentalLive, useStore, type LiveRental } from "@/lib/store";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

function statusMeta(rental: LiveRental, now: number) {
  if (rental.status === "banned") {
    return { label: "İptal", className: "bg-muted text-muted-foreground" };
  }
  if (now && !isRentalLive(rental, now)) {
    return { label: "24 saat doldu", className: "bg-muted text-muted-foreground" };
  }
  if (rental.messages.length > 0) {
    return { label: "Aktif · SMS geliyor", className: "bg-emerald-100 text-emerald-800" };
  }
  if (rental.status === "received") {
    return { label: "SMS bekleniyor", className: "bg-amber-100 text-amber-800" };
  }
  return { label: rental.status || "Bitti", className: "bg-white/8 text-muted-foreground" };
}

export function InboxClient() {
  const params = useSearchParams();
  const router = useRouter();
  const now = useNow();
  const { rentals, cancel, refreshRental } = useStore();
  const requested = params.get("hat");
  const selectedId =
    requested && rentals.some((r) => r.id === requested) ? requested : rentals[0]?.id;
  const selected = rentals.find((r) => r.id === selectedId) ?? null;
  const pollId = selected && isRentalLive(selected, now) ? selected.id : null;

  useEffect(() => {
    if (!pollId) return;
    const t = window.setInterval(() => {
      void refreshRental(pollId);
    }, 5000);
    void refreshRental(pollId);
    return () => window.clearInterval(t);
  }, [pollId, refreshRental]);

  const ordered = useMemo(
    () => [...rentals].sort((a, b) => b.createdAt - a.createdAt),
    [rentals],
  );

  if (rentals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card px-6 py-16 text-center">
        <Inbox className="mx-auto mb-3 size-8 text-muted-foreground" />
        <p className="font-heading text-lg font-medium">Henüz numara yok</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Hizmet seçip numarayı al. 24 saat boyunca gelen SMS’ler burada birikir;
          tek kullanımlık değil.
        </p>
        <Button className="mt-5" render={<Link href="/hizmetler" />}>
          Hizmetlere git
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col gap-2">
        {ordered.map((rental) => (
          <button
            key={rental.id}
            type="button"
            onClick={() =>
              router.replace(`/gelen-kutusu?hat=${encodeURIComponent(rental.id)}`)
            }
            className={cn(
              "rounded-xl border bg-card p-3 text-left transition-colors",
              selected?.id === rental.id && "border-primary ring-1 ring-primary/30",
            )}
          >
            <div className="flex items-center gap-2">
              <ServiceMark
                slug={rental.platformCode}
                name={rental.platform}
                className="size-8 text-[11px]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{rental.platform}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {rental.phone}
                </p>
              </div>
              {rental.messages.length > 0 && (
                <span className="rounded-full bg-teal-400/15 px-1.5 py-0.5 text-[10px] text-teal-200">
                  {rental.messages.length}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      {selected && <RentalPane rental={selected} now={now} onCancel={cancel} />}
    </div>
  );
}

function RentalPane({
  rental,
  now,
  onCancel,
}: {
  rental: LiveRental;
  now: number;
  onCancel: (id: string) => void;
}) {
  const live = isRentalLive(rental, now);
  const meta = statusMeta(rental, now);
  const waiting = live && rental.messages.length === 0;
  const canCancel = waiting;
  const smsNewestFirst = [...rental.messages].reverse();

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              {rental.platform} · {rental.country}
            </p>
            <p className="mt-1 font-mono text-xl tracking-wide">{rental.phone}</p>
          </div>
          <Badge className={meta.className}>{meta.label}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={rental.phone.replace(/\s/g, "")} label="Numarayı kopyala" />
          {canCancel && (
            <Button variant="destructive" size="sm" onClick={() => onCancel(rental.id)}>
              İptal et · iade
            </Button>
          )}
        </div>
        <div
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          suppressHydrationWarning
        >
          <Timer className="size-4" />
          {live
            ? `Kalan ${now ? formatTimeLeft(rental.expiresAt, now) : formatEndsAt(rental.expiresAt)} · bitiş ${formatEndsAt(rental.expiresAt)}`
            : `24 saat doldu · ${formatTL(rental.price)}`}
        </div>
        {waiting && (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-5">
            <Loader2 className="size-5 animate-spin text-primary" />
            <div>
              <p className="text-sm font-medium">İlk SMS bekleniyor</p>
              <p className="text-xs text-muted-foreground">
                Hat 24 saat açık. FerPay 5 saniyede bir sorgulanır; gelen her SMS
                burada kalır.
              </p>
            </div>
          </div>
        )}
        {live && rental.messages.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Bu numara 24 saat boyunca sınırsız SMS alır. Yeni mesajlar alta eklenir.
          </p>
        )}
        {smsNewestFirst.length > 0 ? (
          <ul className="space-y-3">
            {smsNewestFirst.map((text, index) => {
              const code = extractCode(text);
              const newest = index === 0;
              return (
                <li
                  key={`${rental.id}-${rental.messages.length - index}-${text.slice(0, 24)}`}
                  className={cn(
                    "rounded-xl border bg-muted/40 p-4",
                    newest && "ring-1 ring-primary/25",
                  )}
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{rental.platform}</span>
                    <span>{newest ? "Son SMS" : formatClock(rental.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 whitespace-pre-wrap">{text}</p>
                  {code && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <p className="font-mono text-3xl tracking-[0.28em] text-primary">
                        {code}
                      </p>
                      <CopyButton value={code} label="Kodu kopyala" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : rental.status === "banned" ? (
          <p className="text-sm text-muted-foreground">Bu numara iptal edildi.</p>
        ) : !live ? (
          <p className="text-sm text-muted-foreground">
            24 saat doldu. Bu hatta yeni SMS gelmez.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
