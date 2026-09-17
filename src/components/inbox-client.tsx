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
import { formatClock, formatTL } from "@/lib/format";
import { useStore, type LiveRental } from "@/lib/store";
import { cn } from "@/lib/utils";

function statusMeta(rental: LiveRental) {
  if (rental.status === "banned") {
    return { label: "İptal", className: "bg-white/8 text-muted-foreground" };
  }
  if (rental.message) {
    return { label: "Kod geldi", className: "bg-teal-400/15 text-teal-200" };
  }
  if (rental.status === "received") {
    return { label: "SMS bekleniyor", className: "bg-amber-400/15 text-amber-200" };
  }
  return { label: rental.status || "Bitti", className: "bg-white/8 text-muted-foreground" };
}

export function InboxClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { rentals, cancel, refreshRental } = useStore();
  const requested = params.get("hat");
  const selectedId =
    requested && rentals.some((r) => r.id === requested) ? requested : rentals[0]?.id;
  const selected = rentals.find((r) => r.id === selectedId) ?? null;

  const pollId =
    selected && !selected.message && selected.status !== "banned"
      ? selected.id
      : null;

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
      <div className="rounded-2xl border border-dashed border-white/12 px-6 py-20 text-center">
        <Inbox className="mx-auto mb-3 size-8 text-muted-foreground" />
        <p className="font-heading text-lg font-medium">Henüz kiralık hat yok</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Bir hizmet seçip numara kiralayın. Gelen SMS 4–5 saniyede bir kontrol edilir.
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
              "rounded-xl border border-transparent bg-card/50 p-3 text-left ring-1 ring-white/8 transition-colors",
              selected?.id === rental.id && "border-primary/40 bg-card ring-primary/30",
            )}
          >
            <div className="flex items-center gap-2">
              <ServiceMark
                slug={rental.platformCode}
                name={rental.platform}
                className="size-8 text-[11px]"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{rental.platform}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {rental.phone}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {selected && <RentalPane rental={selected} onCancel={cancel} />}
    </div>
  );
}

function RentalPane({
  rental,
  onCancel,
}: {
  rental: LiveRental;
  onCancel: (id: string) => void;
}) {
  const meta = statusMeta(rental);
  const waiting = rental.status === "received" && !rental.message;

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
          {waiting && (
            <Button variant="destructive" size="sm" onClick={() => onCancel(rental.id)}>
              İptal et · iade
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Timer className="size-4" />
          {waiting
            ? `Bitiş ${formatClock(rental.expiresAt)}`
            : `Tutar ${formatTL(rental.price)}`}
        </div>
        {waiting && (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary/25 bg-primary/6 px-4 py-5">
            <Loader2 className="size-5 animate-spin text-primary" />
            <div>
              <p className="text-sm font-medium">SMS bekleniyor</p>
              <p className="text-xs text-muted-foreground">
                FerPay 5 saniyede bir sorgulanıyor. Uygulamaya numarayı yaz, kodu bekle.
              </p>
            </div>
          </div>
        )}
        {rental.message ? (
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{rental.platform}</span>
              <span>{formatClock(rental.createdAt)}</span>
            </div>
            <p className="mt-2 text-sm leading-6 whitespace-pre-wrap">{rental.message}</p>
            {rental.code && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="font-mono text-3xl tracking-[0.28em] text-primary">
                  {rental.code}
                </p>
                <CopyButton value={rental.code} label="Kodu kopyala" />
              </div>
            )}
          </div>
        ) : rental.status === "banned" ? (
          <p className="text-sm text-muted-foreground">Bu kiralama iptal edildi.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
