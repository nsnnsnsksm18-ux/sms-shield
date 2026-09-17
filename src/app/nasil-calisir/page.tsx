import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nasıl çalışır",
};

export default function HowPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Nasıl çalışır
      </h1>
      <p className="mt-3 text-muted-foreground leading-7">
        hizlismsal.com, FerPay stoğunu gösterir. Hizmet seçince sunucu
        FerPay’den numara alır. Kiralama yok: hat 24 saat senindir, o süre
        boyunca sınırsız SMS gelen kutuya yazılır.
      </p>
      <ol className="mt-8 list-decimal space-y-3 pl-5 text-sm leading-6">
        <li>ferpay.com.tr’de bakiye yükle.</li>
        <li>Hizmet ve ülke seç, numarayı al (bakiyen FerPay’den düşer).</li>
        <li>Numarayı hedef uygulamaya yaz. Hat 24 saat açık kalır.</li>
        <li>
          Gelen her SMS burada birikir; tek kullanımlık değil. İlk SMS
          gelmezse iptal et, iade FerPay’de olur.
        </li>
      </ol>
      <p className="mt-8 text-sm text-muted-foreground leading-6">
        Token sadece sunucuda durur (`FERPAY_TOKEN`). Tarayıcıya verilmez.
        Domain’i Vercel’e bağlayınca canlı adres hizlismsal.com olur.
      </p>
      <Link href="/hizmetler" className={cn(buttonVariants(), "mt-8")}>
        Hizmetlere git
      </Link>
    </div>
  );
}
