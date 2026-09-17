"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ServiceMark } from "@/components/service-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function SmsBuyTable() {
  const router = useRouter();
  const { buy, balance } = useStore();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [platforms, setPlatforms] = useState<PlatformSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [picked, setPicked] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    fetch("/api/platforms")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Liste alınamadı");
        if (alive) setPlatforms(data.platforms as PlatformSummary[]);
      })
      .catch((err: Error) => {
        if (alive) setError(err.message);
      });
    return () => {
      alive = false;
    };
  }, []);

  const countries = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of platforms ?? []) {
      for (const c of p.countries) {
        if (!map.has(c.code)) map.set(c.code, c.name);
      }
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1], "tr"));
  }, [platforms]);

  const items = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return (platforms ?? [])
      .filter((p) => {
        const textOk =
          !q ||
          p.name.toLocaleLowerCase("tr").includes(q) ||
          p.code.toLocaleLowerCase("tr").includes(q);
        const countryOk =
          country === "all" ||
          p.countries.some((c) => c.code === country && c.stock > 0);
        return textOk && countryOk;
      })
      .sort((a, b) => b.stock - a.stock || a.name.localeCompare(b.name, "tr"));
  }, [platforms, query, country]);

  function rowCountry(platform: PlatformSummary) {
    const chosen = picked[platform.code];
    if (chosen) {
      return platform.countries.find((c) => c.code === chosen) ?? platform.countries[0];
    }
    if (country !== "all") {
      return (
        platform.countries.find((c) => c.code === country) ?? platform.countries[0]
      );
    }
    return platform.countries.find((c) => c.stock > 0) ?? platform.countries[0];
  }

  async function onBuy(platform: PlatformSummary) {
    const c = rowCountry(platform);
    const best = c?.best;
    if (!c || !best) return;
    setBusyId(platform.code);
    const rental = await buy({
      platform: platform.code,
      country: c.code,
      service: best.code,
      platformName: platform.name,
      countryName: c.name,
    });
    setBusyId(null);
    if (rental) router.push(`/gelen-kutusu?hat=${encodeURIComponent(rental.id)}`);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">SMS Al</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hizmet ve ülke seç, numarayı al. Hat 24 saat açık kalır, sınırsız SMS
          Numaralarım’a düşer.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Servis ara (WhatsApp, Telegram…)"
            className="bg-card pl-8"
            aria-label="Hizmet ara"
          />
        </div>
        <Select value={country} onValueChange={(v) => setCountry(String(v))}>
          <SelectTrigger className="w-full bg-card sm:w-52" aria-label="Ülke">
            <SelectValue placeholder="Tüm ülkeler" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm ülkeler</SelectItem>
            {countries.map(([code, name]) => (
              <SelectItem key={code} value={code}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="rounded-xl border border-dashed bg-card px-6 py-12 text-center">
          <p className="font-medium">Liste alınamadı</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
      ) : platforms == null ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card px-6 py-16 text-center">
          <p className="font-medium">Eşleşen servis yok</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Servis</th>
                <th className="px-4 py-3 font-medium">Ülke</th>
                <th className="px-4 py-3 font-medium">Stok</th>
                <th className="px-4 py-3 font-medium">Fiyat</th>
                <th className="px-4 py-3 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {items.map((platform) => {
                const c = rowCountry(platform);
                const price = c?.best?.price ?? null;
                const stock = c?.stock ?? 0;
                const canPay =
                  c?.best != null &&
                  stock > 0 &&
                  price != null &&
                  (balance == null || balance >= price);
                return (
                  <tr key={platform.code} className="border-b last:border-0">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <ServiceMark
                          slug={platform.code}
                          name={platform.name}
                          className="size-8 text-[11px]"
                        />
                        <span className="font-medium">{platform.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <Select
                        value={c?.code ?? ""}
                        onValueChange={(v) =>
                          setPicked((prev) => ({ ...prev, [platform.code]: String(v) }))
                        }
                      >
                        <SelectTrigger className="h-8 w-44" aria-label={`${platform.name} ülke`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {platform.countries.map((item) => (
                            <SelectItem
                              key={item.code}
                              value={item.code}
                              disabled={item.stock === 0}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">{stock}</td>
                    <td className="px-4 py-2.5 font-medium text-primary">
                      {price != null ? formatTL(price) : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <Button
                        size="sm"
                        disabled={!canPay || busyId === platform.code}
                        onClick={() => void onBuy(platform)}
                      >
                        {busyId === platform.code ? "Alınıyor…" : "Satın Al"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
