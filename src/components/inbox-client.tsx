"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Inbox, Loader2, Timer } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { ServiceMark } from "@/components/service-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCountry, getService } from "@/lib/data";
import { formatClock, formatTimeLeft, formatTL } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Rental } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS: Record<Rental["status"], { label: string; className: string }> = {
  waiting: { label: "SMS bekleniyor", className: "bg-amber-400/15 text-amber-200" },
  received: { label: "Kod geldi", className: "bg-teal-400/15 text-teal-200" },
  expired: { label: "Süresi doldu", className: "bg-white/8 text-muted-foreground" },
  cancelled: { label: "İptal", className: "bg-white/8 text-muted-foreground" },
};

function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, [active]);
  return now;
}

export function InboxClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { rentals, cancel, hydrated } = useStore();
  const requested = params.get("hat");
  const selectedId = requested && rentals.some((r) => r.id === requested)
    ? requested
    : rentals[0]?.id;
  const selected = rentals.find((r) => r.id === selectedId) ?? null;
  const now = useNow(Boolean(selected && selected.status === "waiting"));

  const ordered = useMemo(
    () =>
      [...rentals].sort((a, b) => {
        const rank = { waiting: 0, received: 1, expired: 2, cancelled: 3 };
        return rank[a.status] - rank[b.status] || b.createdAt - a.createdAt;
      }),
    [rentals],
  );

  if (!hydrated) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Gelen kutusu yükleniyor…
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/12 px-6 py-20 text-center">
        <Inbox className="mx-auto mb-3 size-8 text-muted-foreground" />
        <p className="font-heading text-lg font-medium">Henüz kiralık hat yok</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Bir hizmet seçip numara kiralayın. Demo SMS 4–9 saniye içinde bu
          ekrana düşer.
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
        {ordered.map((rental) => {
          const service = getService(rental.serviceSlug);
          const country = getCountry(rental.countryCode);
          return (
            <button
              key={rental.id}
              type="button"
              onClick={() => router.replace(`/gelen-kutusu?hat=${rental.id}`)}
              className={cn(
                "rounded-xl border border-transparent bg-card/50 p-3 text-left ring-1 ring-white/8 transition-colors",
                selected?.id === rental.id && "border-primary/40 bg-card ring-primary/30",
              )}
            >
              <div className="flex items-center gap-2">
                {service && (
                  <ServiceMark
                    slug={service.slug}
                    name={service.name}
                    className="size-8 text-[11px]"
                  />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {service?.name} · {country?.flag}
                  </p>
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {rental.phone}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
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
  rental: Rental;
  now: number;
  onCancel: (id: string) => void;
}) {
  const service = getService(rental.serviceSlug);
  const country = getCountry(rental.countryCode);
  const status = STATUS[rental.status];
  const waiting = rental.status === "waiting";
  const last = rental.messages[0];

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              {service?.name} · {country?.flag} {country?.name}
            </p>
            <p className="mt-1 font-mono text-xl tracking-wide">{rental.phone}</p>
          </div>
          <Badge className={status.className}>{status.label}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={rental.phone.replace(/\s/g, "")} label="Numarayı kopyala" />
          {waiting && (
            <Button variant="destructive" size="sm" onClick={() => onCancel(rental.id)}>
              İptal et · %70 iade
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Timer className="size-4" />
          {waiting
            ? `Kalan süre ${formatTimeLeft(rental.expiresAt, now)}`
            : `Kiralama ${formatTL(rental.price)}`}
        </div>
        {waiting && (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary/25 bg-primary/6 px-4 py-5">
            <Loader2 className="size-5 animate-spin text-primary" />
            <div>
              <p className="text-sm font-medium">SMS bekleniyor</p>
              <p className="text-xs text-muted-foreground">
                Demo kod birkaç saniye içinde düşecek. Gerçek operatör yok.
              </p>
            </div>
          </div>
        )}
        {last ? (
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{last.from}</span>
              <span>{formatClock(last.receivedAt)}</span>
            </div>
            <p className="mt-2 text-sm leading-6">{last.body}</p>
            {last.code && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="font-mono text-3xl tracking-[0.28em] text-primary">
                  {last.code}
                </p>
                <CopyButton value={last.code} label="Kodu kopyala" />
              </div>
            )}
          </div>
        ) : rental.status === "expired" ? (
          <p className="text-sm text-muted-foreground">
            Süre doldu, SMS gelmedi. Yeni bir hat kiralayabilirsiniz.
          </p>
        ) : rental.status === "cancelled" ? (
          <p className="text-sm text-muted-foreground">Bu kiralama iptal edildi.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
