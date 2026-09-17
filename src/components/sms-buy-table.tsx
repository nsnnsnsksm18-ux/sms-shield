"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart } from "lucide-react";
import { HexMark } from "@/components/hex-mark";
import { Input } from "@/components/ui/input";
import { DEMO_PLATFORMS } from "@/data/demo-platforms";
import type { CountrySummary, PlatformSummary, ServiceOption } from "@/lib/platform-types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function Flag({ alpha2 }: { alpha2: string }) {
  const code = alpha2.trim().toLowerCase();
  if (code.length === 2) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://flagcdn.com/w20/${code}.png`}
        alt=""
        width={18}
        height={12}
        className="h-3 w-[18px] rounded-[2px] object-cover"
      />
    );
  }
  return <span className="text-[11px]">🌐</span>;
}

function PlatformCard({
  platform,
  defaultCountry,
  busy,
  demo,
  onBuy,
}: {
  platform: PlatformSummary;
  defaultCountry?: string;
  busy: boolean;
  demo?: boolean;
  onBuy: (input: {
    country: CountrySummary;
    service: ServiceOption;
    qty: number;
  }) => Promise<void>;
}) {
  const first =
    (defaultCountry
      ? platform.countries.find((c) => c.code === defaultCountry && c.stock > 0)
      : null) ??
    platform.countries.find((c) => c.stock > 0) ??
    platform.countries[0];
  const [countryOverride, setCountryOverride] = useState<string | null>(null);
  const countryCode = countryOverride ?? first?.code ?? "";
  const country =
    platform.countries.find((c) => c.code === countryCode) ?? first;
  const services = country?.services?.length
    ? country.services
    : country?.best
      ? [country.best]
      : [];
  const [serviceOverride, setServiceOverride] = useState<string | null>(null);
  const service =
    services.find((s) => s.code === serviceOverride) ??
    services.find((s) => s.code === country?.best?.code) ??
    services[0] ??
    null;
  const [qty, setQty] = useState(1);

  const stock = service?.count ?? country?.stock ?? 0;
  const price = service?.price ?? 0;
  const total = price * qty;
  const canBuy = Boolean(service && stock > 0);

  return (
    <article className="flex flex-col rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(40,44,90,0.06)]">
      <div className="flex flex-col items-center pt-2">
        <HexMark className="size-12" />
        <h2 className="mt-3 line-clamp-1 text-center text-[17px] font-semibold text-[#2b2f5c]">
          {platform.name}
        </h2>
      </div>

      <label className="relative mt-4 block">
        <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2">
          <Flag alpha2={country?.alpha2 ?? ""} />
        </span>
        <select
          className="h-10 w-full appearance-none rounded-lg border border-[#eceef8] bg-white pl-9 pr-8 text-sm text-[#2b2f5c] outline-none focus:border-[#4f46e5]"
          value={country?.code ?? ""}
          onChange={(e) => {
            setCountryOverride(e.target.value);
            setServiceOverride(null);
          }}
          aria-label={`${platform.name} ülke`}
        >
          {platform.countries.map((c) => (
            <option key={c.code} value={c.code} disabled={c.stock === 0}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {services.length === 0 ? (
          <span className="text-xs text-muted-foreground">Servis yok</span>
        ) : (
          services.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => setServiceOverride(item.code)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium",
                item.code === service?.code
                  ? "bg-[#3d4dff] text-white"
                  : "bg-[#e8ebff] text-[#3d4dff]",
              )}
            >
              {item.code}
            </button>
          ))
        )}
      </div>

      <div className="mt-4 flex items-end justify-between text-sm">
        <div>
          <p className="text-xs text-[#8b90b0]">Stok</p>
          <p className="font-semibold text-[#2b2f5c]">{stock}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#8b90b0]">Fiyat</p>
          <p className="font-semibold text-[#2b2f5c]">
            {price ? `${price.toFixed(2)}₺` : "—"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#8b90b0]">
        <span>Adet</span>
        <span>Toplam Fiyat: {total ? `${total.toFixed(2)}₺` : "—"}</span>
      </div>
      <div className="mt-1.5 flex items-center overflow-hidden rounded-lg border border-[#eceef8]">
        <button
          type="button"
          className="h-9 w-10 text-lg text-[#2b2f5c]"
          onClick={() => setQty((n) => Math.max(1, n - 1))}
          aria-label="Azalt"
        >
          −
        </button>
        <input
          className="h-9 min-w-0 flex-1 border-x border-[#eceef8] text-center text-sm font-medium text-[#2b2f5c] outline-none"
          value={qty}
          onChange={(e) => {
            const n = Number(e.target.value.replace(/\D/g, ""));
            setQty(Number.isFinite(n) && n > 0 ? Math.min(n, 20) : 1);
          }}
          inputMode="numeric"
          aria-label="Adet"
        />
        <button
          type="button"
          className="h-9 w-10 text-lg text-[#2b2f5c]"
          onClick={() => setQty((n) => Math.min(20, n + 1))}
          aria-label="Arttır"
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={!canBuy || busy || demo}
        onClick={() => {
          if (demo || !country || !service) return;
          void onBuy({ country, service, qty });
        }}
        className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3d4dff] text-sm font-semibold text-white hover:bg-[#3240e6] disabled:opacity-50"
      >
        <ShoppingCart className="size-4" />
        {demo ? "Bağlantı yok" : busy ? "Alınıyor…" : "Satın Al"}
      </button>
    </article>
  );
}

export function SmsBuyTable() {
  const router = useRouter();
  const { buy } = useStore();
  const [query, setQuery] = useState("");
  const [platforms, setPlatforms] = useState<PlatformSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/platforms")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Liste alınamadı");
        if (!alive) return;
        setDemo(false);
        setError(null);
        setPlatforms(data.platforms as PlatformSummary[]);
      })
      .catch((err: Error) => {
        if (!alive) return;
        setError(err.message);
        setDemo(true);
        setPlatforms(DEMO_PLATFORMS);
      });
    return () => {
      alive = false;
    };
  }, []);

  const items = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return (platforms ?? [])
      .filter((p) => {
        return (
          !q ||
          p.name.toLocaleLowerCase("tr").includes(q) ||
          p.code.toLocaleLowerCase("tr").includes(q)
        );
      })
      .sort((a, b) => b.stock - a.stock || a.name.localeCompare(b.name, "tr"));
  }, [platforms, query]);

  async function onBuy(
    platform: PlatformSummary,
    country: CountrySummary,
    service: ServiceOption,
    qty: number,
  ) {
    setBusyKey(platform.code);
    let last = null;
    for (let i = 0; i < qty; i += 1) {
      last = await buy({
        platform: platform.code,
        country: country.code,
        service: service.code,
        platformName: platform.name,
        countryName: country.name,
      });
      if (!last) break;
    }
    setBusyKey(null);
    if (last) router.push(`/gelen-kutusu?hat=${encodeURIComponent(last.id)}`);
  }

  return (
    <div>
      {demo && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Canlı FerPay stoğu bağlanamadı. Kartlar örnek, Satın Al kapalı.
          {error ? ` (${error})` : ""}
        </div>
      )}

      <div className="relative mb-5">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#8b90b0]" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Platform Ara"
          className="h-11 rounded-xl border-none bg-white pl-10 shadow-[0_8px_24px_rgba(40,44,90,0.05)]"
          aria-label="Platform Ara"
        />
      </div>

      {platforms == null ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-[360px] animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-16 text-center">
          <p className="font-medium text-[#2b2f5c]">Eşleşen platform yok</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((platform) => (
            <PlatformCard
              key={platform.code}
              platform={platform}
              busy={busyKey === platform.code}
              demo={demo}
              onBuy={({ country, service, qty }) =>
                onBuy(platform, country, service, qty)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
