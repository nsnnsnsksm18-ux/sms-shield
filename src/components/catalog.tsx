"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, COUNTRIES, SERVICES } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Catalog({
  heading = "Hizmetler",
  compact = false,
}: {
  heading?: string;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [country, setCountry] = useState("TR");

  const items = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return SERVICES.filter((service) => {
      const catOk = category === "all" || service.category === category;
      const textOk =
        !q ||
        service.name.toLocaleLowerCase("tr").includes(q) ||
        service.blurb.toLocaleLowerCase("tr").includes(q);
      return catOk && textOk;
    }).sort((a, b) => b.popularity - a.popularity);
  }, [query, category]);

  const shown = compact ? items.slice(0, 8) : items;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            {heading}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ülke ve hizmet seç, numarayı kirala, kod gelsin.
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
            <SelectTrigger className="w-full sm:w-44" aria-label="Ülke">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs value={category} onValueChange={(v) => setCategory(String(v))}>
        <TabsList variant="line" className="w-full max-w-full flex-wrap justify-start">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/12 px-6 py-16 text-center">
          <p className="font-medium">Eşleşen hizmet yok</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Aramayı sadeleştirin veya başka bir kategori deneyin.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((service) => (
            <ServiceCard
              key={service.slug}
              service={service}
              countryCode={country}
            />
          ))}
        </div>
      )}
    </section>
  );
}
