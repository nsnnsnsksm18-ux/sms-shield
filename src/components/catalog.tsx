"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlatformSummary } from "@/lib/platform-types";

export function Catalog({
  heading = "Hizmetler",
  compact = false,
}: {
  heading?: string;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [platforms, setPlatforms] = useState<PlatformSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const shown = compact ? items.slice(0, 8) : items;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            {heading}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            FerPay stoğundan ülke ve hizmet seç, numarayı kirala.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-56">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="WhatsApp, Telegram…"
              className="pl-8"
              aria-label="Hizmet ara"
            />
          </div>
          <Select value={country} onValueChange={(v) => setCountry(String(v))}>
            <SelectTrigger className="w-full sm:w-48" aria-label="Ülke">
              <SelectValue />
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
      </div>
      {error ? (
        <div className="rounded-2xl border border-dashed border-amber-400/30 px-6 py-12 text-center">
          <p className="font-medium">FerPay listesi alınamadı</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
      ) : platforms == null ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/12 px-6 py-16 text-center">
          <p className="font-medium">Eşleşen hizmet yok</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Aramayı sadeleştirin veya başka ülke deneyin.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((platform) => (
            <ServiceCard
              key={platform.code}
              platform={platform}
              countryCode={country === "all" ? undefined : country}
            />
          ))}
        </div>
      )}
    </section>
  );
}
