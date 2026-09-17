import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { COUNTRIES, priceFor, stockFor } from "@/lib/data";
import { formatTL } from "@/lib/format";
import type { Service } from "@/lib/types";
import { ServiceMark } from "@/components/service-mark";

export function ServiceCard({
  service,
  countryCode = "TR",
}: {
  service: Service;
  countryCode?: string;
}) {
  const country = COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];
  const price = priceFor(service, country);
  const stock = stockFor(service.slug, country.code);

  return (
    <Link href={`/hizmetler/${service.slug}`} className="group block">
      <Card className="h-full bg-card/70 transition-colors ring-foreground/8 hover:ring-primary/35">
        <CardContent className="flex h-full flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <ServiceMark slug={service.slug} name={service.name} />
            <Badge variant="secondary">{stock} hat</Badge>
          </div>
          <div>
            <h3 className="font-heading text-base font-medium">{service.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
              {service.blurb}
            </p>
          </div>
          <div className="mt-auto flex items-end justify-between pt-1">
            <div>
              <p className="text-[11px] text-muted-foreground">{country.flag} {country.name}’den</p>
              <p className="font-medium text-primary">{formatTL(price)}</p>
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
