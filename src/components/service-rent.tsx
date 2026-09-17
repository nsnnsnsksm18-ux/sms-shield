"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Clock, Globe, ShieldAlert } from "lucide-react";
import { ServiceMark } from "@/components/service-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, priceFor, stockFor } from "@/lib/data";
import { formatTL } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Service } from "@/lib/types";

export function ServiceRent({ service }: { service: Service }) {
  const router = useRouter();
  const { rent, balance, hydrated } = useStore();
  const [countryCode, setCountryCode] = useState("TR");
  const country = COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];
  const price = priceFor(service, country);
  const stock = stockFor(service.slug, country.code);
  const canPay = hydrated && balance >= price;

  function onRent() {
    const rental = rent(service.slug, country.code);
    if (rental) router.push(`/gelen-kutusu?hat=${rental.id}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <div className="flex items-start gap-4">
          <ServiceMark slug={service.slug} name={service.name} className="size-14 text-lg" />
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              {service.name} SMS onay
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">{service.blurb}</p>
          </div>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          <li className="rounded-xl border border-white/8 bg-card/60 p-4">
            <Clock className="mb-2 size-4 text-primary" />
            <p className="text-sm font-medium">15 dakika</p>
            <p className="text-xs text-muted-foreground">Kiralama süresi</p>
          </li>
          <li className="rounded-xl border border-white/8 bg-card/60 p-4">
            <Globe className="mb-2 size-4 text-primary" />
            <p className="text-sm font-medium">{stock} hazır hat</p>
            <p className="text-xs text-muted-foreground">{country.name}</p>
          </li>
          <li className="rounded-xl border border-white/8 bg-card/60 p-4">
            <ShieldAlert className="mb-2 size-4 text-primary" />
            <p className="text-sm font-medium">Demo kod</p>
            <p className="text-xs text-muted-foreground">4–9 sn içinde simüle</p>
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
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.flag} {c.name} · {formatTL(priceFor(service, c))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end justify-between rounded-xl bg-white/4 px-3 py-3">
            <div>
              <p className="text-xs text-muted-foreground">Tutar</p>
              <p className="font-heading text-2xl font-semibold text-primary">
                {formatTL(price)}
              </p>
            </div>
            <Badge variant={stock > 20 ? "secondary" : "outline"}>
              {stock} stok
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Bakiyeniz: {hydrated ? formatTL(balance) : "…"}
          </p>
          {!canPay && hydrated && (
            <p className="text-sm text-amber-300">
              Bu hat için bakiyeniz yetmiyor. Cüzdandan demo yükleme yapın.
            </p>
          )}
          <Button
            size="lg"
            className="w-full"
            onClick={onRent}
            disabled={!hydrated || !canPay}
          >
            Numarayı kirala
          </Button>
          <p className="text-xs leading-5 text-muted-foreground">
            Kod gelmezse süre dolmadan iptal edebilirsiniz; tutarın %70’i
            iade edilir. Gerçek SMS bu demoda gönderilmez.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
