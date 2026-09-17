import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatTL } from "@/lib/format";
import { ServiceMark } from "@/components/service-mark";
import type { PlatformSummary } from "@/lib/platform-types";

export function ServiceCard({
  platform,
  countryCode,
}: {
  platform: PlatformSummary;
  countryCode?: string;
}) {
  const country = countryCode
    ? platform.countries.find((c) => c.code === countryCode || c.alpha2 === countryCode)
    : null;
  const price = country?.best ? country.best.price : platform.minPrice;
  const stock = country ? country.stock : platform.stock;

  return (
    <Link href={`/hizmetler/${encodeURIComponent(platform.code)}`} className="group block">
      <Card className="h-full bg-card/70 transition-colors ring-foreground/8 hover:ring-primary/35">
        <CardContent className="flex h-full flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <ServiceMark slug={platform.code} name={platform.name} />
            <Badge variant="secondary">{stock} hat</Badge>
          </div>
          <div>
            <h3 className="font-heading text-base font-medium">{platform.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
              FerPay stoklu sanal numara. Alınca 24 saat açık; sınırsız SMS gelen kutuya düşer.
            </p>
          </div>
          <div className="mt-auto flex items-end justify-between pt-1">
            <div>
              <p className="text-[11px] text-muted-foreground">
                {country ? country.name : "En uygun"}
              </p>
              <p className="font-medium text-primary">
                {price != null ? formatTL(price) : "Stok yok"}
              </p>
            </div>
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/6 text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
