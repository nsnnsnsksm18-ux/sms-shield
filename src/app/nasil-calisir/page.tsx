import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nasıl çalışır",
  description: "SMSOnay demosu nasıl kullanılır ve canlı site için neler gerekir.",
};

const FLOW = [
  {
    title: "1. Hizmeti seç",
    body: "WhatsApp, Telegram, Instagram gibi platformlardan birini aç. Fiyat ülkeye göre değişir; stok o ülke havuzundaki demo hat sayısıdır.",
  },
  {
    title: "2. Numarayı kirala",
    body: "Cüzdandan tutar düşer, 15 dakikalık bir hat oluşur. Numarayı kopyalayıp ilgili uygulamaya yazarsın.",
  },
  {
    title: "3. Kodu al",
    body: "Demo 4–9 saniye içinde sahte bir SMS üretir. Kodu kopyala. Süre dolmadan iptalde %70 iade edilir.",
  },
];

const NEED = [
  {
    title: "Numara tedariki",
    body: "Gerçek SMS için sanal numara API’si gerekir: Twilio, Telnyx, veya toptan SMS-Activate / 5sim benzeri sağlayıcı. Her gelen mesaj webhook ile sizin sunucuya düşer.",
  },
  {
    title: "Ödeme",
    body: "Türkiye için iyzico veya PayTR, yurt dışı için Stripe. Bakiye cüzdanı, fatura ve iade kuralları.",
  },
  {
    title: "Hesap ve kayıt",
    body: "E-posta veya telefonla üyelik, oturum, sipariş geçmişi. İsterseniz API anahtarı ile toptan satış.",
  },
  {
    title: "Yasal",
    body: "KVKK aydınlatma, çerez, kullanım şartları, yasaklı kullanım (dolandırıcılık, başkasının 2FA’sı, spam). Bazı platformlar sanal numarayı reddeder; bunu kullanıcıya yazın.",
  },
  {
    title: "Operasyon",
    body: "Domain, Vercel (bu arayüz), arka plan işçisi (SMS webhook), destek kanalı, fiyat ve stok yönetimi.",
  },
];

export default function HowPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Nasıl çalışır ve ne lazım?
      </h1>
      <p className="mt-3 text-muted-foreground leading-7">
        SMSOnay, sanal numarayla SMS doğrulama kodu alan bir pazaryeri. Şu an
        gördüğünüz sürüm tarayıcıda çalışan bir demo: bakiye, kiralama ve SMS
        localStorage’da. Canlıya geçince aynı ekranlar gerçek API’ye bağlanır.
      </p>

      <h2 className="font-heading mt-10 text-xl font-semibold">Demo akışı</h2>
      <ol className="mt-4 space-y-4">
        {FLOW.map((item) => (
          <li key={item.title} className="rounded-2xl border border-white/8 bg-card/50 p-5">
            <h3 className="font-medium">{item.title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ol>

      <h2 className="font-heading mt-10 text-xl font-semibold">Canlı site için gerekli olanlar</h2>
      <ul className="mt-4 space-y-4">
        {NEED.map((item) => (
          <li key={item.title} className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/hizmetler" className={cn(buttonVariants())}>
          Demoyu dene
        </Link>
        <Link href="/yasal" className={cn(buttonVariants({ variant: "outline" }))}>
          Yasal uyarı
        </Link>
      </div>
    </div>
  );
}
