"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Globe, ShieldAlert } from "lucide-react";
import { ServiceMark } from "@/components/service-mark";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTL } from "@/lib/format";
import type { PlatformSummary } from "@/lib/platform-types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ServiceRent({ platformCode }: { platformCode: string }) {
  const router = useRouter();
  const { buy, balance } = useStore();
  const [platform, setPlatform] = useState<PlatformSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/platforms")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Liste alınamadı");
        const found = (data.platforms as PlatformSummary[]).find(
          (p) => p.code === platformCode,
        );
        if (!found) throw new Error("Bu hizmet FerPay’de yok");
        if (!alive) return;
        setPlatform(found);
        const first = found.countries.find((c) => c.stock > 0) ?? found.countries[0];
        if (first) setCountryCode(first.code);
      })
      .catch((err: Error) => {
        if (alive) setError(err.message);
      });
    return () => {
      alive = false;
    };
  }, [platformCode]);

  const country = useMemo(
    () => platform?.countries.find((c) => c.code === countryCode),
    [platform, countryCode],
  );
  const best = country?.best ?? null;
  const price = best?.price ?? null;
  const stock = country?.stock ?? 0;
  const canPay =
    best != null &&
    stock > 0 &&
    price != null &&
    (balance == null || balance >= price);

  async function onRent() {
    if (!platform || !country || !best) return;
    setBusy(true);
    const rental = await buy({
      platform: platform.code,
      country: country.code,
      service: best.code,
      platformName: platform.name,
      countryName: country.name,
    });
    setBusy(false);
    if (rental) router.push(`/gelen-kutusu?hat=${encodeURIComponent(rental.id)}`);
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (!platform) {
    return <Skeleton className="h-64 rounded-2xl" />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <div className="flex items-start gap-4">
          <ServiceMark slug={platform.code} name={platform.name} className="size-14 text-lg" />
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              {platform.name} SMS onay
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Numara FerPay üzerinden kiralanır. Gelen SMS bu sitedeki kutuya düşer.
            </p>
          </div>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          <li className="rounded-xl border border-white/8 bg-card/60 p-4">
            <Clock className="mb-2 size-4 text-primary" />
            <p className="text-sm font-medium">Süre FerPay’den</p>
            <p className="text-xs text-muted-foreground">Siparişin expiresAt değeri</p>
          </li>
          <li className="rounded-xl border border-white/8 bg-card/60 p-4">
            <Globe className="mb-2 size-4 text-primary" />
            <p className="text-sm font-medium">{stock} hazır hat</p>
            <p className="text-xs text-muted-foreground">{country?.name ?? "Ülke seç"}</p>
          </li>
          <li className="rounded-xl border border-white/8 bg-card/60 p-4">
            <ShieldAlert className="mb-2 size-4 text-primary" />
            <p className="text-sm font-medium">Canlı SMS</p>
            <p className="text-xs text-muted-foreground">Kod 4–5 sn aralıkla sorgulanır</p>
          </li>
        </ul>
      </div>
      <Card className="bg-card/80">
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Ülke</p>
            <Select
              value={countryCode}
              onValueChange={(v) => setCountryCode(String(v))}
            >
              <SelectTrigger className="mt-2 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platform.countries.map((c) => (
                  <SelectItem key={c.code} value={c.code} disabled={c.stock === 0}>
                    {c.name} · {c.stock} stok
                    {c.best ? ` · ${formatTL(c.best.price)}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end justify-between rounded-xl bg-white/4 px-3 py-3">
            <div>
              <p className="text-xs text-muted-foreground">Tutar</p>
              <p className="font-heading text-2xl font-semibold text-primary">
                {price != null ? formatTL(price) : "—"}
              </p>
            </div>
            <Badge variant={stock > 0 ? "secondary" : "outline"}>{stock} stok</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            FerPay bakiyen: {balance == null ? "…" : formatTL(balance)}
          </p>
          {stock === 0 && (
            <p className="text-sm text-amber-300">Bu ülkede stok yok.</p>
          )}
          {best && balance != null && price != null && balance < price && (
            <p className="text-sm text-amber-300">
              Bakiye yetmiyor. ferpay.com.tr üzerinden yükle.
            </p>
          )}
          <button
            type="button"
            data-testid="rent-btn"
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
            onClick={onRent}
            disabled={!canPay || busy}
          >
            {busy ? "Alınıyor…" : "Numarayı kirala"}
          </button>
          <p className="text-xs leading-5 text-muted-foreground">
            Tıklayınca FerPay bakiyenden düşer. SMS gelmezse gelen kutusundan
            iptal et; FerPay iade eder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
